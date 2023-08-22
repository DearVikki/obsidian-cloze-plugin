# Cloze - Obsidian Plugin

Inspired from anki cards, this simple plugin for [Obsidian](https://obsidian.md/) enables you to create a cloze from highlighted, underlined, or bolded texts, as well as any selected text in reading mode.

![Cloze Plugin](https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/demo.gif)

## Usage

### Create clozes

There're certain ways for creating clozes.

1. Convert from specific text segments

By enabling the following three settings, the corresponding text will automatically be converted into clozes in reading mode.

![Cloze Plugin](https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/settings1.png)

![Cloze Plugin](https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/enable_highlight.gif)

2. Custom clozes

By default, the plugin adds 2 menu items: "Add Cloze" and "Remove Cloze", which are only visible when text is selected. The selected text will be underlined to indicate it has been clozed.

![Cloze Plugin](https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/add.png)

![Cloze Plugin](https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/remove.png)

Note: When clozing text, a custom `<span></span>` will be added around the text. Therefore, if you intend to export the file, please ensure that all custom clozes have been removed. You can conveniently select and remove multiple clozed texts at once.

### Utilizing clozes

Note: it only works in reading mode. Everything remains same in editing mode.

To toggle the visibility of a cloze area, simply click on it. 

If you want to toggle the visibility of all clozes, click on the ribbon icon --- a small fish.

![Cloze Plugin](https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/fish.png)

![Cloze Plugin](https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/fish-mobile.png)

Additionally, all clozes will be hidden by default, but you can disable this feature in the settings.

## Installation

To manually install, simply download the required files and put them in your plugins folder.