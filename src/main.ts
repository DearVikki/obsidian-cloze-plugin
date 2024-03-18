import { App, Plugin, Menu, Editor, MarkdownView, Notice, Workspace } from 'obsidian';
import lang from './lang';
import DEFAULT_SETTINGS, { ClozePluginSettings, HINT_STRATEGY } from './settings/settingData';
import SettingTab from './settings/settingTab';
import HintModal from './components/modal-hint';
import utils from './utils';
import { ATTRS, CLASSES } from './const';
import langs from './lang/en';

export default class ClozePlugin extends Plugin {
	settings: ClozePluginSettings;

	isSourceHide = false;
	isPreviewHide = true;

	async onload() {
		console.log('load cloze plugin');
		await this.loadSettings();
		this.addSettingTab(new SettingTab(this.app, this));
		this.initRibbon();
		this.initEditorMenu();
		this.initCommand();
		this.initMarkdownPostProcessor();
		this.registerDomEvent(document, 'click', (event) => {
			if (this.isPreviewMode()) {
				this.toggleHide(utils.getClozeEl(event.target as HTMLElement));
			}
		});
		this.registerDomEvent(document, 'contextmenu', (event)=>{
			if (this.isPreviewMode()) { 
				this.onRightClick(event, utils.getClozeEl(event.target as HTMLElement));
			}
		})

		const observer = new MutationObserver((records, observer) => {
			for (const record of records) {
				for (const addedNode of record.addedNodes) {
					console.log('added node');
					if (addedNode.nodeType == 1) {
						this.toggleAllHide(addedNode, this.isPreviewHide);
					}
				}
			}
		})

		this.registerEvent(
			this.app.workspace.on('active-leaf-change', (leaf) => {
				console.log("======active leaf change, observer disconnected", leaf);
				observer.disconnect();

				const view = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (view && view.getMode() === 'preview') {
					const containerEl = view.containerEl;
					if (containerEl) {
						console.log('====observer observe new file')
						observer.observe(containerEl, {childList: true, subtree: true,});
					}
				}
			})
		)
	}

	private initRibbon() {
		this.addRibbonIcon('fish', lang.toggle_cloze, (evt: MouseEvent) => {
			if(this.checkTags()) {
				this.togglePageAllHide();
			}
		});
	}

	private initEditorMenu() {
		this.registerEvent(
			this.app.workspace.on("editor-menu", (
				menu: Menu,
				editor: Editor
			): void => {
				const selection = editor.getSelection();
				if (selection && this.checkTags()) {
					if(this.settings.editorMenuAddCloze) {
						menu.addItem((item) => {
							item
								.setTitle(lang.add_cloze)
								.onClick((e) => {
									this.addCloze(editor);
								});
						});
					}
					if (this.settings.editorMenuAddClozeWithHint) {
						menu.addItem((item) => {
							item
								.setTitle(lang.add_cloze_with_hint)
								.onClick((e) => {
									this.addCloze(editor, true);
								});
						});
					}
					if (this.settings.editorMenuRemoveCloze) {
						menu.addItem((item) => {
							item
								.setTitle(lang.remove_cloze)
								.onClick((e) => {
									this.removeCloze(editor);
								});
						});
					}
					
				}
			})
		);
	}

	private initCommand() {
		this.addCommand({
			id: "add-cloze",
			name: lang.add_cloze,
			icon: "fish",
			editorCallback: (editor, ctx) => {
				const selection = editor.getSelection();
				if (selection && this.checkTags()) {
					this.addCloze(editor);
				}
			}
		})

		this.addCommand({
			id: "add-cloze-with-hint",
			name: lang.add_cloze_with_hint,
			icon: "fish-symbol",
			editorCallback: (editor, ctx) => {
				const selection = editor.getSelection();
				if (selection && this.checkTags()) {
					this.addCloze(editor, true);
				}
			}
		})

		this.addCommand({
			id: "remove-cloze",
			name: lang.remove_cloze,
			icon: "fish-off",
			editorCallback: (editor, ctx) => {
				const selection = editor.getSelection();
				if (selection && this.checkTags()) {
					this.removeCloze(editor);
				}
			},
		})

		this.addCommand({
			id: "toggle-cloze",
			name: lang.toggle_cloze,
			callback: () => {
				if(this.checkTags()) {
					this.togglePageAllHide();
				}
			},
		})
	}

	private initMarkdownPostProcessor() {
		this.registerMarkdownPostProcessor((element, context) => {
			if (!this.checkTags()) { return; }

			if (this.settings.fixedClozeWidth) {
				const containerEl = (context as any).containerEl as HTMLElement;
				if (containerEl) {
					containerEl.classList.add(CLASSES.fixedWidth);
				} else {
					new Notice('Cloze plugin: No containerEl.');
				}
			}
			
			// bracketed texts need to be surrounded with span
			if (this.settings.includeBracketed) {
				this.transformBracketedText(element);
			}

			// curly bracketed text need to be surrounded with span
			if (this.settings.includeCurlyBrackets) {
				this.transformCurlyBracketedText(element);
			}

			element.querySelectorAll<HTMLElement>(this.clozeSelector())
				.forEach(this.renderCloze);
			this.toggleAllHide(element, this.isPreviewHide);
		})
	}

	private onRightClick(event: MouseEvent, $cloze: HTMLElement | null) {
		if(!$cloze) return;
		if(!utils.isClozeHide($cloze)) return;
		if(utils.hasCustomHint($cloze)) return;
		const menu = new Menu();
		menu.addItem((item) =>
			item
			.setTitle(langs.reveal_more_hint)
			.setIcon("snail")
			.onClick(() => {
				this.revealMoreHint($cloze);
			})
		);
		menu.showAtMouseEvent(event);
	}

	private isPreviewMode(): boolean {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (view == null) return true; // Under canvas mode
		return view.getMode() === 'preview';
	}

	// Extract and verify tags - works in both preview and edit mode
	private checkTags(): boolean {
		if (this.settings.selectorTag === '' || this.settings.selectorTag === "#") { // Skip of this feature is not used
			return true;
		}

		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (activeView) {
			const { app, file } = activeView;
			if (file) {
				const cachedMetadata = app.metadataCache.getFileCache(file);
				const tags = (cachedMetadata?.tags || []).map(t => t.tag);
				const frontmatterTags = cachedMetadata?.frontmatter?.tags || [];
				return [...frontmatterTags, ...tags].some((t:string) => {
					if(!t.startsWith('#')) {
						t = '#' + t;
					}
					return t.toLowerCase() === this.settings.selectorTag.toLowerCase();
				});
			}
		}
		return false;
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		this.isPreviewHide = this.settings.defaultHide;
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.isPreviewHide = this.settings.defaultHide;
	}

	clozeSelector = () => {
		const selectors = ['.cloze-span'];
		if (this.settings.includeHighlighted) {
			selectors.push('mark');
			selectors.push('.cm-highlight');
		}
		if (this.settings.includeUnderlined) {
			selectors.push('u');
		}
		if (this.settings.includeBolded) {
			selectors.push('strong');
			selectors.push('.cm-strong');
		}
		if (this.settings.includeItalics) {
			selectors.push('em');
			selectors.push('.cm-em');
		}
		return selectors.join(', ');
	}

	transformBracketedText = (element: HTMLElement) => {
		const items = element.querySelectorAll("p, h1, h2, h3, h4, h5, li, td, th, code");
		items.forEach((item: HTMLElement) => {
			item.innerHTML = item.innerHTML.replace(/\[(.*?)\]/g, '<span class="cloze-span">$1</span>');
		})
	}

	transformCurlyBracketedText = (element: HTMLElement) => {
		const items = element.querySelectorAll("p, h1, h2, h3, h4, h5, li, td, th, code");
		items.forEach((item: HTMLElement) => {
			item.innerHTML = item.innerHTML.replace(/\{(.*?)\}/g, '<span class="cloze-span">$1</span>');
		})
	}
	
	renderCloze = ($cloze: HTMLElement) => {
		$cloze.classList.add(CLASSES.cloze);
		$cloze.innerHTML = `<span class="cloze-hint"></span>`
		+ `<span class="cloze-content">${$cloze.innerHTML}</span>`;
		
		this.initHint($cloze);
	}

	initHint = ($cloze: HTMLElement) => {
		let hint = "";
		if(utils.hasCustomHint($cloze)) { 							// if we have attribute: data-cloze-hint then
			hint = utils.getClozeCustomHint($cloze); 				// use it                 
		} else {
			const textContent = utils.getClozeContent($cloze);
			if(this.settings.hintStrategy === HINT_STRATEGY.count) {
				hint = textContent.slice(0, this.settings.hintCount);
			} else if(this.settings.hintStrategy === HINT_STRATEGY.percentage) {
				hint = textContent.slice(0, Math.ceil(textContent.length * this.settings.hintPercentage));
			}
		}
		utils.setClozeHint($cloze, hint);
	}

	// ----------- cloze interaction ------------

	hideClozeContent = (target: HTMLElement) => {
		if(!target.getAttribute(ATTRS.hide)) {                         
			target.setAttribute(ATTRS.hide, 'true');     // add attribute: data-cloze-hide: true
		}
		this.initHint(target);                 			// reinit hint
	}

	showClozeContent = (target: HTMLElement) => {
		if(target.getAttribute(ATTRS.hide)) {      					  
			target.removeAttribute(ATTRS.hide);        					  // remove attribute: data-cloze-hide:true
		}
	}

	toggleHide(target: HTMLElement | null) {
		if(!target) return;
		if (target.getAttribute(ATTRS.hide)) {
			this.showClozeContent(target);
		} else {
			this.hideClozeContent(target);
		}
	}

	toggleAllHide(dom: HTMLElement | Document | null = document, hide: boolean) {
		if (dom && this.checkTags()) {
			const marks = dom.querySelectorAll<HTMLElement>(this.clozeSelector());
			if (hide) {
				marks.forEach((mark) => {
					this.hideClozeContent(mark);
				})
			} else {
				marks.forEach((mark) => {
					this.showClozeContent(mark);
				})
			}
		}
	}

	togglePageAllHide() {
		const mostRecentLeaf = this.app.workspace.getMostRecentLeaf() as unknown as {containerEl: HTMLElement};
		if (!mostRecentLeaf) return;
		const leafContainer = mostRecentLeaf.containerEl as HTMLElement;
		if(!leafContainer) return;
		if(this.isPreviewMode()) {
			const nodeContainers = leafContainer.querySelectorAll<HTMLElement>('.markdown-preview-view');
			nodeContainers.forEach((nodeContainer) => {
				this.toggleAllHide(nodeContainer, !this.isPreviewHide);
			})
			this.isPreviewHide = !this.isPreviewHide;
		} else {
			const nodeContainers = leafContainer.querySelectorAll<HTMLElement>('.markdown-source-view');
			nodeContainers.forEach((nodeContainer) => {
				this.toggleAllHide(nodeContainer, !this.isSourceHide);
			})
			this.isSourceHide = !this.isSourceHide;
		}
	}

	addCloze = (editor: Editor, needHint?: boolean) => {
		const currentStr = editor.getSelection();
		const content = currentStr
			.replace(/<span class="cloze-span">(.*?)<\/span>/g, "$1");
		if (needHint) {
			new HintModal(this.app, content, (hint) => {
				const newStr = `<span class="cloze-span" data-cloze-hint="${hint}">` + content + '</span>';
				editor.replaceSelection(newStr);
				editor.blur();
			}).open();
		} else {
			const newStr = '<span class="cloze-span">' + content + '</span>';
			editor.replaceSelection(newStr);
			editor.blur();
		}
	}

	removeCloze = (editor: Editor) => {
		const currentStr = editor.getSelection();
		const newStr = currentStr
			.replace(/<span.*?class="cloze-span".*?>(.*?)<\/span>/g, "$1");
		editor.replaceSelection(newStr);
	};

	revealMoreHint = ($cloze: HTMLElement) => {
		const currentHint = utils.getClozeCurrentHint($cloze);
		const hintLength = currentHint.length + 3;
		utils.setClozeHint($cloze, utils.getClozeContent($cloze).slice(0, hintLength));
	}
}

