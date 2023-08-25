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

	isAllHide: boolean = false;

	async onload() {
		console.log('load cloze plugin');

		await this.loadSettings();

		// This creates an icon in the left ribbon.
		this.addRibbonIcon('fish', lang.toggle_cloze, (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			this.toggleAllHide(!this.isAllHide);
		});		

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingTab(this.app, this));

		this.registerDomEvent(document, 'click', (event) => {
			this.toggleHide(event.target as HTMLElement);
		});
	
		this.registerEvent(
			this.app.workspace.on('file-open', async () => {
				setTimeout(() => {
					this.addClass();
					this.toggleAllHide(this.settings.defaultHide);
				}, 0);
			})
		);

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
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	addClass() {
		const markdownView = document.querySelector('.markdown-reading-view');
		if (markdownView) {
			markdownView.classList.remove('cloze-highlighted', 'cloze-underlined', 'cloze-bolded');
			if (this.settings.includeHighlighted) {
				markdownView.classList.add('cloze-highlighted');
			}
			if (this.settings.includeUnderlined) {
				markdownView.classList.add('cloze-underlined');
			}
			if (this.settings.includeBolded) {
				markdownView.classList.add('cloze-bolded');
			}
		}
	}

	clozeSelector = () => {
		const selectors = ['.markdown-reading-view .cloze-span'];
		if (this.settings.includeHighlighted) {
			selectors.push('.markdown-reading-view.cloze-highlighted mark');
		}
		if (this.settings.includeUnderlined) {
			selectors.push('.markdown-reading-view.cloze-underlined u');
		}
		if (this.settings.includeBolded) {
			selectors.push('.markdown-reading-view.cloze-bolded strong');
		}
		return selectors.join(', ');
	}

	hideClozeContent = (target: HTMLElement) => {
		target.style.color = 'transparent';
		target.setAttribute('data-mark-hide', 'true');
	}

	showClozeContent = (target: HTMLElement) => {
		target.style.color = 'inherit';
		target.removeAttribute('data-mark-hide');
	}

	toggleHide(target: HTMLElement) {
		if (target.matches(this.clozeSelector())) {
			if(target.getAttribute('data-mark-hide')) {
				this.showClozeContent(target);
			} else {
				this.hideClozeContent(target);
			}
		}
	}

	toggleAllHide(hide: boolean) {
		const marks = document.querySelectorAll<HTMLElement>(this.clozeSelector());
		if(hide) {
			marks.forEach((mark) => {
				this.hideClozeContent(mark);
			})
			this.isAllHide = true;
		} else {
			marks.forEach((mark) => {
				this.showClozeContent(mark);
			})
			this.isAllHide = false;
		}
	}

	addCloze = (editor: Editor) => {
		const currentStr = editor.getSelection();
		const newStr = currentStr
		  		.replace(/\<span class="cloze-span">(.*?)<\/span>/g, "$1");
		editor.replaceSelection(`<span class="cloze-span">${newStr}</span>`);
		editor.blur();
	}

	removeCloze = (editor: Editor) => {
		const currentStr = editor.getSelection();
		const newStr = currentStr
		  .replace(/\<span class="cloze-span">(.*?)<\/span>/g, "$1");
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
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
		  .setName(lang.setting_hide_by_default)
		  .setDesc(lang.setting_hide_by_default_desc)
		  .addToggle(toggle => toggle
			  .setValue(this.plugin.settings.defaultHide)
			  .onChange(value => {
				  this.plugin.settings.defaultHide = value;
				  this.plugin.saveSettings();
			  }))

		containerEl.createEl('h2', {text: lang.setting_auto_convert});
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
		
	}
}
