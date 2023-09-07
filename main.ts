import { App, Plugin, PluginSettingTab, Setting, Menu, Editor } from 'obsidian';
import lang from './lang';

interface ClozePluginSettings {
	defaultHide: boolean;
	includeHighlighted: boolean;
	includeUnderlined: boolean;
	includeBolded: boolean;
}

const DEFAULT_SETTINGS: ClozePluginSettings = {
	defaultHide: true,
	includeHighlighted: false,
	includeUnderlined: false,
	includeBolded: false,
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
			this.toggleHide(event.target as HTMLElement);
		});

		this.registerEvent(
			this.app.workspace.on("editor-menu", (
				menu: Menu,
				editor: Editor
			): void => {
				const selection = editor.getSelection();
				if (selection) {
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
			editorCallback: (editor, context) => {
				this.addCloze(editor);
			}
		})

		this.addCommand({
			id: "remove-cloze",
			name: lang.remove_cloze,
			icon: "fish-off",
			editorCallback: async (editor: Editor) => {
				this.removeCloze(editor);
			},
		})

		this.registerMarkdownPostProcessor((element, context) => {
			element.classList.add('cloze');
			this.toggleAllHide(element, this.isAllHide);
		})

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
		const selectors = ['.cloze .cloze-span'];
		if (this.settings.includeHighlighted) {
			selectors.push('.cloze mark');
		}
		if (this.settings.includeUnderlined) {
			selectors.push('.cloze u');
		}
		if (this.settings.includeBolded) {
			selectors.push('.cloze strong');
		}
		return selectors.join(', ');
	}

	hideClozeContent = (target: HTMLElement) => {
		target.setAttribute('data-mark-hide', 'true');
	}

	showClozeContent = (target: HTMLElement) => {
		target.removeAttribute('data-mark-hide');
	}

	toggleHide(target: HTMLElement) {
		if (target.matches(this.clozeSelector())) {
			if (target.getAttribute('data-mark-hide')) {
				this.showClozeContent(target);
			} else {
				this.hideClozeContent(target);
			}
		}
	}

	toggleAllHide(dom: HTMLElement | Document = document, hide: boolean) {
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
			.replace(/<span class="cloze-span">(.*?)<\/span>/g, "$1");
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
		
		containerEl.createEl("p", { 
			text: lang.setting_contact + " ",
			cls: "setting-item-description"
		}).createEl("a", {
			text: "here",
			href: "https://github.com/DearVikki/obsidian-cloze-plugin/issues",
		});
	}
}
