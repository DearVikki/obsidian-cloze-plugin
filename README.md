# Cloze - Obsidian Plugin

English | [简体中文](./README-CN.md)

Inspired from anki cards, this simple plugin for [Obsidian](https://obsidian.md/) enables you to create a cloze from highlighted, underlined, or bolded texts, as well as any selected text in reading mode.

Update: FYI, I just found that there is a fantastic plugin called [Spaced Repetition](https://www.stephenmwangi.com/obsidian-spaced-repetition/) that works just as an Obsidian version Anki, which also supports Cloze Cards. On the other hand, the Cloze plugin serves as more of a helper for reviewing pages/articles.

<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/demo.gif" width="500" />

## Use

### Basic

Select any text and right-click to open the Editor Menu. 

- Create cloze: Quickly convert the selection into a cloze.
- Create cloze with hint: You will be prompted to input a hint for the cloze first.
- Remove cloze: Batch remove clozes from the selected text.

<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/editor-menu.png" width="400" />

Afterwards in the reading mode, you can toggle the visibility of a cloze area by just clicking it. If you want to toggle the visibility of all clozes, click on the ribbon icon --- the small fish.

<p>
<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/fish.png" width="300" />
<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/fish-mobile.png" width="280" />
</p>

### Features

#### Auto Convert

By enabling the following settings, the corresponding text will also automatically be converted into clozes in reading mode.

<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/settings1.png" width="350" />

#### Cloze hint

Since clozes are html span tags under the hood, there're mainly two ways to display the hint.

- Hint directly displays in the cloze. 

  Create the cloze with "Create cloze with hint" or manually add `data-cloze-hint="your hint"` attribute to clozed `<span></span>`, e.g. `<span class="cloze-span" data-cloze-hint="your hint"></span>`

  <img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/hint.png" width="300" />

- Hint displays when hovered over (only supported in PC).

  Add `title="your hint"` attribute to clozed `<span></span>`, e.g. `<span class="cloze-span" title="your hint"></span>`

  <img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/hint2.png" width="300" />

#### Fixed cloze width

You may enable 'Fixed cloze width' in the settings, which helps to ensure that the original text length is not revealed.

<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/setting-fixed-width.png" />

#### Activation

The plugin is active on all notes by default, but you can configure it to only activate on notes with a specific tag. Simply provide the desired tag in the 'Required tag' setting.

<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/setting-tag.png" />

#### Customized Editor Menu

You can customize editor menu by enabling/disabling the following settings.

<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/setting-editor-menu.png" />

#### Customized styles

There are certain css variables that you may customize via css snippets.

| Variable  | Description  |
|---|---|
| --cloze-underline-color  | Cloze underline color  |
| --cloze-underline-width  | Cloze underline width  |
| --cloze-underline-style  | Cloze underline style  |
| --cloze-hint-color  | Cloze hint color  |
| --cloze-hint-font-size  | Cloze hint font size |
| --cloze-fixed-width  | Cloze fixed width (if fix-width enabled) |

Here is an example.

```css
body {
	--cloze-underline-color: pink;
	--cloze-underline-width: 2px;
	--cloze-underline-style: dashed;
	--cloze-hint-color: blue;
	--cloze-hint-font-size: 30px;
	--cloze-fixed-width: 10px;
}

```

### Best practices

- Enable Obsidian hotkey for "Add Cloze" could save you enough time for a cup of tea! <img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/hotkeys.png" width="700" /><img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/hotkeys2.png" width="700" />
- Cloze-mate: [Spaced Repetition #review flag](https://www.stephenmwangi.com/obsidian-spaced-repetition/notes/) is a best mate for reviewing pages.

## Q&As

### What's the visibility of the clozes when the page is exported to PDF?

Sadly, it can only be "all visibile" or "all hidden" for the present.

Click the ribbon fish first, make sure that the page state is what you expect, and then click "export to PDF".

## Installation

This plugin is available in the Obsidian community plugin store. Look for **Cloze**.

To manually install, simply download the required files and put them in your plugins folder.
