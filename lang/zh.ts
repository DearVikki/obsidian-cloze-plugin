import { Ilangs } from './types';

const langs: Ilangs = {
    add_cloze: "添加填空",
    remove_cloze: "移除填空",
    toggle_cloze: "显/隐所有填空",
    setting_selector_tag:"作用标签",
    setting_selector_tag_desc: "该插件将仅作用于带有该标签的笔记上，为空则作用于所有笔记 i.e. #cloze。",
    setting_hide_by_default: "默认隐藏",
    setting_hide_by_default_desc: "启用此设置后，打开页面时所有填空内容将默认隐藏。🙈",
    setting_auto_convert: "自动转换",
    setting_highlight: "高亮文字",
    setting_highlight_desc: "启用此设置后，所有==高亮文字==也将转换为填空。",
    setting_bold: "粗体文字",
    setting_bold_desc: "启用此设置后，所有**粗体文字**也将转换为填空。",
    setting_underline: "下划线文字",
    setting_underline_desc: "启用此设置后，所有<u>下划线文字</u>也将转换为填空。",
    setting_custom_cloze: "自定义填空",
    setting_fixed_cloze_width: "固定填空宽度",
    setting_fixed_cloze_width_desc: "启用此设置后，所有自定义填空的宽度默认相同（可避免透露原文字长度）。",
	setting_contact: "谢谢你的使用~ 欢迎反馈！戳这里："
}

export default langs;
