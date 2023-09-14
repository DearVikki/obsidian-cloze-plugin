# Cloze - Obsidian Plugin

English | [简体中文](./README-CN.md)

Inspired from anki cards, this simple plugin for [Obsidian](https://obsidian.md/) enables you to create a cloze from highlighted, underlined, or bolded texts, as well as any selected text in reading mode.

Update: FYI, I just found that there is a fantastic plugin called [Spaced Repetition](https://www.stephenmwangi.com/obsidian-spaced-repetition/) that works just as an Obsidian version Anki, which also supports Cloze Cards. On the other hand, the Cloze plugin serves as more of a helper for reviewing pages/articles.

<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/demo.gif" width="500" />

## Usage

### Create clozes

You can create clozes by directly converting specific text segments, such as highlights or bolded texts, or by selecting any text.

#### Convert from specific text segments

By enabling the following three settings, the corresponding text will automatically be converted into clozes in reading mode.

<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/settings1.png" width="350" />

#### Custom clozes

By default, the plugin adds 2 menu items: "Add Cloze" and "Remove Cloze", which are only visible when text is selected. The selected text will be underlined to indicate it has been clozed.

<p>
<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/add.png" width="280" />
<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/remove.png" width="500" />
</p>

Note: When clozing text, a custom `<span></span>` will be added around the text. Therefore, if you intend to export the file, please ensure that all custom clozes have been removed. You can conveniently select and remove multiple clozed texts at once.

##### Cloze hint

There're mainly two ways to display the hint.

- Hint directly displays in the cloze. 

  Add `data-cloze-hint="your hint"` attribute to clozed `<span></span>`

- Hint displays when hovered.

  Add `title="your hint"` attribute to clozed `<span></span>`

#### Fixed cloze width

You may enable 'Fixed cloze width' in the settings, which helps to ensure that the original text length is not revealed.

### Utilizing clozes

Note: it only works in reading mode. Everything remains same in editing mode.

#### Single cloze

To toggle the visibility of a cloze area, simply click on it. 

<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/enable_highlight.gif" width="400" />

#### All clozes

If you want to toggle the visibility of all clozes, click on the ribbon icon --- the small fish.

Note that currently, it will also affect the default cloze visibility of the new page.

<p>
<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/fish.png" width="300" />
<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/fish-mobile.png" width="280" />
</p>

### Customized styles

There are certain style variables that you may customize via css snippets.

Here is an example.

```css
body {
	--cloze-underline-width: 2px;
	--cloze-underline-style: dashed;
	--cloze-underline-color: var(--text-normal);
	--cloze-fixed-width: 10px;
	--cloze-hint-color: blue;
	--cloze-hint-font-size: 30px;
}

```

### Best practices

- Enable Obsidian hotkey for "Add Cloze" could save you enough time for a cup of tea! <img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/hotkey.png" width="700" />
- Cloze-mate: [Spaced Repetition #review flag](https://www.stephenmwangi.com/obsidian-spaced-repetition/notes/) is a best mate for reviewing pages.

## Q&As

### What's the visibility of the clozes when the page is exported to PDF?

Sadly, it can only be "all visibile" or "all hidden" for the present.

Click the ribbon fish first, make sure that the page state is what you expect, and then click "export to PDF".

## Installation

This plugin is available in the Obsidian community plugin store. Look for **Cloze**.

To manually install, simply download the required files and put them in your plugins folder.
