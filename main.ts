import { App, Plugin, PluginSettingTab, Setting, Menu, Editor, MarkdownView, Notice } from 'obsidian';
import lang from './lang';

interface ClozePluginSettings {
	defaultHide: boolean;
	selectorTag: string;
	includeHighlighted: boolean;
	includeUnderlined: boolean;
	includeBolded: boolean;
	fixedClozeWidth: boolean;
}

const DEFAULT_SETTINGS: ClozePluginSettings = {
	defaultHide: true,
	selectorTag: "",
	includeHighlighted: false,
	includeUnderlined: false,
	includeBolded: false,
	fixedClozeWidth: false,
}

const ATTRS = {
	hide: 'data-cloze-hide',
	hint: 'data-cloze-hint',
	content: 'data-cloze-content',
}

const CLASSES = {
	cloze: 'cloze',
	hint: 'cloze-hint',
	fixedWidth: 'cloze-fixed-width',
}

export default class ClozePlugin extends Plugin {
	settings: ClozePluginSettings;

	isAllHide = true;

	async onload() {
		console.log('load cloze plugin');

		await this.loadSettings();

		// This creates an icon in the left ribbon.
		this.addRibbonIcon('fish', lang.toggle_cloze, (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			this.toggleAllHide(document, !this.isAllHide);
			this.isAllHide = !this.isAllHide;
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingTab(this.app, this));

		this.registerDomEvent(document, 'click', (event) => {
			if (this.isPreviewMode() && this.checkTags()) { 
				this.toggleHide(event.target as HTMLElement);
			}
		});

		this.registerEvent(
			this.app.workspace.on("editor-menu", (
				menu: Menu,
				editor: Editor
			): void => {
				const selection = editor.getSelection();
				if (selection && this.checkTags()) {
					menu.addItem((item) => {
						item
							.setTitle(lang.add_cloze)
							.onClick((e) => {
								this.addCloze(editor);
							});
					});
					menu.addItem((item) => {
						item
							.setTitle(lang.remove_cloze)
							.onClick((e) => {
								this.removeCloze(editor);
							});
					});
				}
			})
		);

		this.addCommand({
			id: "add-cloze",
			name: lang.add_cloze,
			icon: "fish",
			editorCheckCallback: (checking, editor, ctx) => {
				const selection = editor.getSelection();
				if (selection && this.checkTags()) {
					if (!checking) {
						this.addCloze(editor);
					}
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
				if (selection && this.checkTags()) {
					if (!checking) {
						this.removeCloze(editor);
					}
					return true;
				} else {
					return false;
				}
			},
		})

		this.registerMarkdownPostProcessor((element, context) => {
			if (this.checkTags()) {
				const containerEl = (context as any).containerEl as HTMLElement;
				if (!containerEl) {
					new Notice('Cloze plugin: No containerEl.')
					return;
				}
				containerEl.classList.add(CLASSES.cloze);
				if(this.settings.fixedClozeWidth) {
					containerEl.classList.add(CLASSES.fixedWidth);
				}
			}
			
			this.toggleAllHide(element, this.isAllHide);
		})
		
	}

	private isPreviewMode(): boolean {
		return this.app.workspace.getActiveViewOfType(MarkdownView)?.getMode() === 'preview';
	}

	// Extract and verify tags - works in both preview and edit mode
	private checkTags(): boolean {
		if (this.settings.selectorTag === "#") { // Skip of this feature is not used
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

	onunload() {

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
		return selectors.join(', ');
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

	addCloze = (editor: Editor) => {
		const currentStr = editor.getSelection();
		const newStr = currentStr
			.replace(/<span class="cloze-span">(.*?)<\/span>/g, "$1");
		editor.replaceSelection(`<span class="cloze-span">${newStr}</span>`);
		editor.blur();
	}

	removeCloze = (editor: Editor) => {
		const currentStr = editor.getSelection();
		const newStr = currentStr
			.replace(/<span.*?class="cloze-span".*?>(.*?)<\/span>/g, "$1");
		editor.replaceSelection(newStr);
	};

}

class SettingTab extends PluginSettingTab {
	plugin: ClozePlugin;

	constructor(app: App, plugin: ClozePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		containerEl.createEl("h1", { text: "Cloze" });

		new Setting(containerEl)
		.setName(lang.setting_selector_tag)
		.setDesc(lang.setting_selector_tag_desc)
		.addText((text) => text
			.setValue(this.plugin.settings.selectorTag)
			.onChange(async (value) => {
				this.plugin.settings.selectorTag = this.sanitizeTag(value);
				await this.plugin.saveSettings();
			}))

		new Setting(containerEl)
			.setName(lang.setting_hide_by_default)
			.setDesc(lang.setting_hide_by_default_desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.defaultHide)
				.onChange(value => {
					this.plugin.settings.defaultHide = value;
					this.plugin.saveSettings();
				}))

		containerEl.createEl('h2', { text: lang.setting_auto_convert });
		new Setting(containerEl)
			.setName(lang.setting_highlight)
			.setDesc(lang.setting_highlight_desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.includeHighlighted)
				.onChange(value => {
					this.plugin.settings.includeHighlighted = value;
					this.plugin.saveSettings();
				}))

		new Setting(containerEl)
			.setName(lang.setting_bold)
			.setDesc(lang.setting_bold_desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.includeBolded)
				.onChange(value => {
					this.plugin.settings.includeBolded = value;
					this.plugin.saveSettings();
				}))

		new Setting(containerEl)
			.setName(lang.setting_underline)
			.setDesc(lang.setting_underline_desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.includeUnderlined)
				.onChange(value => {
					this.plugin.settings.includeUnderlined = value;
					this.plugin.saveSettings();
				}))
		
		containerEl.createEl('h2', { text: lang.setting_custom_cloze });
		new Setting(containerEl)
			.setName(lang.setting_fixed_cloze_width)
			.setDesc(lang.setting_fixed_cloze_width_desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.fixedClozeWidth)
				.onChange(value => {
					this.plugin.settings.fixedClozeWidth = value;
					this.plugin.saveSettings();
				}))
		
		containerEl.createEl("p", { 
			text: lang.setting_contact + " ",
			cls: "setting-item-description"
		}).createEl("a", {
			text: "here",
			href: "https://github.com/DearVikki/obsidian-cloze-plugin/issues",
		});
	}


	// Check and clean up tags that are not (what I understand to be) well formed Obsidian tags.
	sanitizeTag(tagInput: string): string {
		const allowedCharacters = /^[a-zA-Z0-9-_]+$/;

		// Remove initial '#' if present
		const tagBody = tagInput.startsWith('#') ? tagInput.slice(1) : tagInput;
		if (allowedCharacters.test(tagBody)) {
			return '#' + tagBody;
		}

		// Hopefully never needed, this is where we replace disallowed characters with underscores
		const sanitizedTagBody = tagBody.replace(/[^a-zA-Z0-9-_]/g, '_');
		return '#' + sanitizedTagBody;
	}
}
