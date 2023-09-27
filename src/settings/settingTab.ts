import {
  App,
  Setting,
  PluginSettingTab,
} from "obsidian";
import type ClozePlugin from "src/main";
import lang from "src/lang";

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
		
		containerEl.createEl('h2', { text: lang.setting_editor_menu });
		new Setting(containerEl)
			.setName(lang.setting_editor_menu_add_cloze)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.editorMenuAddCloze)
				.onChange(value => {
					this.plugin.settings.editorMenuAddCloze = value;
					this.plugin.saveSettings();
				}))
		new Setting(containerEl)
		.setName(lang.setting_editor_menu_add_cloze_with_hint)
		.addToggle(toggle => toggle
			.setValue(this.plugin.settings.editorMenuAddClozeWithHint)
			.onChange(value => {
				this.plugin.settings.editorMenuAddClozeWithHint = value;
				this.plugin.saveSettings();
			}))
		new Setting(containerEl)
		.setName(lang.setting_editor_menu_remove_cloze)
		.addToggle(toggle => toggle
			.setValue(this.plugin.settings.editorMenuRemoveCloze)
			.onChange(value => {
				this.plugin.settings.editorMenuRemoveCloze = value;
				this.plugin.saveSettings();
			}))
		
		containerEl.createEl('h2', { text: lang.setting_custom_setting });
		new Setting(containerEl)
		.setName(lang.setting_selector_tag)
		.setDesc(lang.setting_selector_tag_desc)
		.addText((text) => text
			.setValue(this.plugin.settings.selectorTag)
			.onChange(async (value) => {
				this.plugin.settings.selectorTag = this.sanitizeTag(value);
				await this.plugin.saveSettings();
			}));
		new Setting(containerEl)
			.setName(lang.setting_fixed_cloze_width)
			.setDesc(lang.setting_fixed_cloze_width_desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.fixedClozeWidth)
				.onChange(value => {
					this.plugin.settings.fixedClozeWidth = value;
					this.plugin.saveSettings();
				}));
		new Setting(containerEl)
			.setName(lang.setting_hide_by_default)
			.setDesc(lang.setting_hide_by_default_desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.defaultHide)
				.onChange(value => {
					this.plugin.settings.defaultHide = value;
					this.plugin.saveSettings();
				}));
		
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

export default SettingTab;
