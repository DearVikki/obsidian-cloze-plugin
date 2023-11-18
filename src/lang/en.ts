import { Ilangs } from './types';

const langs: Ilangs = {
    add_cloze: 'Create cloze',
	add_cloze_with_hint: 'Create cloze with hint',
    remove_cloze: 'Remove cloze',
    toggle_cloze: 'Toggle all clozes',
    setting_selector_tag:'Required tag',
    setting_selector_tag_desc: 'If you provide a tag here, the plugin will only activate on notes with that tag i.e. #cloze.',
    setting_hide_by_default: 'Hide by default',
    setting_hide_by_default_desc: 'Enable this setting, all clozes will be hidden by default when reading the page. 🙈',
    setting_auto_convert: 'Auto Convert',
    setting_highlight: 'Highlighted text',
    setting_highlight_desc: 'Enable this setting, all ==highlighted texts== will be converted to cloze.',
    setting_bold: 'Bolded text',
    setting_bold_desc: 'Enable this setting, all **bolded texts** will be converted to cloze.',
	setting_curly_brackets: 'Text enclosed in curly brackets',
	setting_curly_brackets_desc: 'Enable this setting, all {text enclosed in curly brackets} will be converted to cloze.',
    setting_underline: 'Underlined text',
    setting_underline_desc: 'Enable this setting, all <u>underlined texts</u> will be converted to cloze.',
	setting_editor_menu: 'Editor menu',
	setting_editor_menu_add_cloze: 'Display add cloze button',
	setting_editor_menu_add_cloze_with_hint: 'Display add cloze with hint button',
	setting_editor_menu_remove_cloze: 'Display remove cloze button',
    setting_custom_setting: 'Custom settings',
    setting_fixed_cloze_width: 'Fixed cloze width',
    setting_fixed_cloze_width_desc: 'Enable this setting, clozes will have the same default width, which helps to ensure that the original text length is not revealed.',
	setting_contact: 'Thank you for using Cloze! Any feedback is welcomed',
}

export default langs;
