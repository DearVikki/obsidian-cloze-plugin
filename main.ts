import { App, Plugin, PluginSettingTab, Setting, } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	defaultHide: boolean;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	defaultHide: false
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	isAllHide: boolean = false;

	async onload() {
		console.log('load hidelight plugin')
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('replace', 'toggle highlighted text', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			this.toggleAllHide(!this.isAllHide);
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');
		

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.

		this.registerDomEvent(document, 'click', (event) => {
			const target = event.target as HTMLElement;
			if (target.matches('.markdown-reading-view mark')) {
			  // Perform the desired action when the specific HTML tag is clicked
			  // You can modify the DOM, trigger other functions, or interact with Obsidian's API here
				if(target.getAttribute('data-mark-hide')) {
					target.style.color = 'inherit';
					target.removeAttribute('data-mark-hide');
				} else {
					target.style.color = 'transparent';
					target.setAttribute('data-mark-hide', 'true');
				}
			}
		});
	
		this.app.workspace.on('file-open', async () => {
			this.toggleAllHide(this.settings.defaultHide);
		});
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	toggleAllHide(hide: boolean) {
		const marks = document.querySelectorAll<HTMLElement>('.markdown-reading-view mark');
		if(hide) {
			marks.forEach((mark) => {
				mark.style.color = 'transparent';
				mark.setAttribute('data-mark-hide', 'true');
			})
			this.isAllHide = true;
		} else {
			marks.forEach((mark) => {
				mark.style.color = 'inherit';
				mark.removeAttribute('data-mark-hide');
			})
			this.isAllHide = false;
		}
	}
}

class SettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();
		containerEl.createEl('h1', {text: 'Hidelight'});
    	containerEl.createEl("p", { text: "Created by " }).createEl("a", {
			text: "Vikki",
			href: "https://github.com/DearVikki",
		  });

    	containerEl.createEl('h2', {text: 'Settings'})

		new Setting(containerEl)
			.setName('Hide by default')
			.setDesc('By enabling this setting, all highlighted texts will be hidden by default. 🙈 ')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.defaultHide)
				.onChange(value => {
					this.plugin.settings.defaultHide = value;
					this.plugin.saveSettings();
				}))
	}
}
