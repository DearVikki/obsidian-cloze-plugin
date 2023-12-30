import { App, Plugin, Menu, Editor, MarkdownView, Notice } from 'obsidian';
import lang from './lang';
import DEFAULT_SETTINGS, { ClozePluginSettings } from './settings/settingData';
import SettingTab from './settings/settingTab';
import HintModal from './components/modal-hint';

const ATTRS = {
	hide: 'data-cloze-hide',
	hint: 'data-cloze-hint',
	content: 'data-cloze-content',
}

const CLASSES = {
	cloze: 'cloze',
	highlight: 'cloze-highlight',
	bold: 'cloze-bold',
	underline: 'cloze-underline',
	hint: 'cloze-hint',
	fixedWidth: 'cloze-fixed-width',
}

export default class ClozePlugin extends Plugin {
	settings: ClozePluginSettings;

	isAllHide = true;

	async onload() {
		console.log('load cloze plugin');

		await this.loadSettings();
		this.addSettingTab(new SettingTab(this.app, this));
		this.initRibbon();
		this.registerDomEvent(document, 'click', (event) => {
			if (this.isPreviewMode() && this.checkTags()) { 
				this.toggleHide(event.target as HTMLElement);
			}
		});
		this.initEditorMenu();
		this.initCommand();
		this.initMarkdownPostProcessor();
	}

	private initRibbon() {
		this.addRibbonIcon('fish', lang.toggle_cloze, (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			this.toggleAllHide(document, !this.isAllHide);
			this.isAllHide = !this.isAllHide;
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
			editorCheckCallback: (checking, editor, ctx) => {
				const selection = editor.getSelection();
				if (selection && this.checkTags() && !checking) {
					this.addCloze(editor);
					return true;
				} else {
					return false;
				}
			}
		})

		this.addCommand({
			id: "add-cloze-with-hint",
			name: lang.add_cloze_with_hint,
			icon: "fish-symbol",
			editorCheckCallback: (checking, editor, ctx) => {
				const selection = editor.getSelection();
				if (selection && this.checkTags() && !checking) {
					this.addCloze(editor, true);
					return true;
				} else {
					return false;
				}
			}
		})

		this.addCommand({
			id: "remove-cloze",
			name: lang.remove_cloze,
			icon: "fish-off",
			editorCheckCallback: (checking, editor, ctx) => {
				const selection = editor.getSelection();
				if (selection && this.checkTags() && !checking) {
					this.removeCloze(editor);
					return true;
				} else {
					return false;
				}
			},
		})

		this.addCommand({
			id: "toggle-cloze",
			name: lang.toggle_cloze,
			icon: "fish-symbol",
			editorCheckCallback: (checking, editor, ctx) => {
				// Called when the user call the command.
				this.isAllHide = !this.isAllHide;
				this.toggleAllHide(document, this.isAllHide);
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
					.forEach(el => el.classList.add(CLASSES.cloze));
			this.toggleAllHide(element, this.isAllHide);
		})
	}

	private isPreviewMode(): boolean {
		return this.app.workspace.getActiveViewOfType(MarkdownView)?.getMode() === 'preview';
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
		this.isAllHide = this.settings.defaultHide;
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.isAllHide = this.settings.defaultHide;
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

	hideClozeContent = (target: HTMLElement) => {
		if(!target.getAttribute(ATTRS.hide)) {                         
			if(target.getAttribute(ATTRS.hint)) { 							// if we have attribute: data-cloze-hint then
				target.setAttribute(ATTRS.content, target.innerHTML)         // store original in attribute:data-cloze-content
				target.innerHTML = target.getAttribute(ATTRS.hint) || '';    // restore HTML from attribute:data-cloze-hint or ''
				target.removeAttribute(ATTRS.hint);
				target.classList.add(CLASSES.hint);                          // add .cloze-hint class
			}
			target.setAttribute(ATTRS.hide, 'true');                      // add attribute: data-cloze-hide: true
		}
	}

	showClozeContent = (target: HTMLElement) => {
		if(target.getAttribute(ATTRS.hide)) {      					  
			if(target.getAttribute(ATTRS.content)) { 							// if we have attribute: data-cloze-content then
				target.setAttribute(ATTRS.hint, target.innerHTML)         	// store original in attribute:data-cloze-content
				target.innerHTML = target.getAttribute(ATTRS.content) || ''; // restore innerHTML from attribute: data-cloze-content or ''
				target.removeAttribute(ATTRS.content);                       // remove attribute: data-cloze-content
				target.classList.remove(CLASSES.hint);    				     // remove .cloze-hint class
			}
			target.removeAttribute(ATTRS.hide);        					  // remove attribute: data-cloze-hide:true
		}
	}

	toggleHide(target: HTMLElement) {
		if (target.matches(this.clozeSelector())) {
			if (target.getAttribute(ATTRS.hide)) {
				this.showClozeContent(target);
			} else {
				this.hideClozeContent(target);
			}
		}
	}

	toggleAllHide(dom: HTMLElement | Document = document, hide: boolean) {
		if (this.checkTags()) {
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
}

