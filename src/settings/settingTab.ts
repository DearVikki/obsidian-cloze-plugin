import {
  App,
  Setting,
  PluginSettingTab,
} from "obsidian";
import type ClozePlugin from "src/main";
import lang from "src/lang";
import { HINT_STRATEGY } from './settingData';

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
		this.displayAutoConvert(containerEl);
		this.displayCustomSetting(containerEl);
		this.displayHintSetting(containerEl);
		this.displayEditorMenuSetting(containerEl);
		this.displayContact(containerEl);
	}

	displayAutoConvert(containerEl: HTMLElement) : void {
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
		new Setting(containerEl)
			.setName(lang.setting_italics)
			.setDesc(lang.setting_italics_desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.includeItalics)
				.onChange(value => {
					this.plugin.settings.includeItalics = value;
					this.plugin.saveSettings();
				}))
		new Setting(containerEl)
			.setName(lang.setting_bracket)
			.setDesc(lang.setting_bracket_desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.includeBracketed)
				.onChange(value => {
					this.plugin.settings.includeBracketed = value;
					this.plugin.saveSettings();
				}))
		new Setting(containerEl)
			.setName(lang.setting_curly_bracket)
			.setDesc(lang.setting_curly_bracket_desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.includeCurlyBrackets)
				.onChange(value => {
					this.plugin.settings.includeCurlyBrackets = value;
					this.plugin.saveSettings();
				}))
	}

	displayCustomSetting(containerEl: HTMLElement) : void {
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
		
	}

	displayHintSetting(containerEl: HTMLElement) : void {
		// hint settings
		const settingEl = containerEl.createEl('div');
		settingEl.createEl('h2', { text: 'Hint' });
		new Setting(settingEl)
		.setName(lang.setting_hint_strategy)
		.setDesc(lang.setting_hint_strategy_desc)
		.addDropdown((comp)=>{
			comp.addOptions({[HINT_STRATEGY.none]:'Off', [HINT_STRATEGY.count]:'By Count', [HINT_STRATEGY.percentage]:'By Percentage'});
			comp.setValue(this.plugin.settings.hintStrategy.toString());
			comp.onChange((val)=>{
				this.plugin.settings.hintStrategy = Number(val);
				initHintStrategyVaule(Number(val));
				this.plugin.saveSettings();
			});
		})
		
		let hintStrategySetting: Setting | undefined;
		const initHintStrategyVaule = (strategy: number) => {
			if(hintStrategySetting) hintStrategySetting.settingEl.parentElement?.removeChild(hintStrategySetting.settingEl);
			switch (strategy) {
				case HINT_STRATEGY.none:
					break;
				case HINT_STRATEGY.count:
					hintStrategySetting = new Setting(settingEl)
					.setName(lang.setting_hint_by_count)
					.setDesc(lang.setting_hint_by_count_desc)
					.addText((text) => {
						text
						.setValue(this.plugin.settings.hintCount.toString())
						.onChange(async (value) => {
							const valueNumber = Number(value);
							if(isNaN(valueNumber)) return;
							this.plugin.settings.hintCount = valueNumber;
							this.plugin.saveSettings();
						});
					});
					break;
				case HINT_STRATEGY.percentage:
					hintStrategySetting = new Setting(settingEl)
					.setName(lang.setting_hint_by_percentage)
					.setDesc(lang.setting_hint_by_percentage_desc)
					.addText((text) => {
						text
						.setValue(this.plugin.settings.hintPercentage*100+'%')
						.onChange(async (value) => {
							const matches = value.match(/^(\d+)%$/);
							if(!matches) return;
							const valueNumber = Number(matches[1])/100;
							if(isNaN(valueNumber)) return;
							this.plugin.settings.hintPercentage = valueNumber;
							this.plugin.saveSettings();
						});
					});
					break;
			}
		}
		initHintStrategyVaule(Number(this.plugin.settings.hintStrategy));
	}

	displayEditorMenuSetting(containerEl: HTMLElement) : void {
		// editor menu settings
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
	}

	displayContact(containerEl: HTMLElement) : void {
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
