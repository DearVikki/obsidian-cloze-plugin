import { Ilangs } from './types';

const langs: Ilangs = {
    add_cloze: 'Add cloze',
    remove_cloze: 'Remove cloze',
    toggle_cloze: 'Toggle all clozes',
    setting_hide_by_default: 'Hide by default',
    setting_hide_by_default_desc: 'Enable this setting, all clozes will be hidden by default when reading the page. 🙈',
    setting_auto_convert: 'Auto Convert',
    setting_highlight: 'Highlighted text',
    setting_highlight_desc: 'Enable this setting, all ==highlighted texts== will be converted to cloze.',
    setting_bold: 'Bolded text',
    setting_bold_desc: 'Enable this setting, all **bolded texts** will be converted to cloze.',
    setting_underline: 'Underlined text',
    setting_underline_desc: 'Enable this setting, all <u>underlined texts</u> will be converted to cloze.',
    setting_custom_cloze: 'Custom cloze',
    setting_fixed_cloze_width: 'Fixed cloze width',
    setting_fixed_cloze_width_desc: 'Enable this setting, all custom clozes will have the same default width, which helps to ensure that the original text length is not revealed.',
	setting_contact: 'Thank you for using Cloze! Any feedback is welcomed',
}

export default langs;
