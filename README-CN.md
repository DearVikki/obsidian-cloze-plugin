# Cloze - Obsidian Plugin

简体中文 | [English](./README.md)

什么是 Cloze？简而言之，就是完型填空。熟悉 Anki 的朋友们绝对不陌生的！记忆单词、句型、语录时，超好用。

这款干净的 Obsidian 插件支持高亮文本、粗体文本、下划线文本以及任何自选文本区域的 cloze 化。不过仅在阅读模式 reading mode 下才可有效交互哦！

p.s.刚发现 [Spaced Repetition](https://www.stephenmwangi.com/obsidian-spaced-repetition/) 这款插件简直就是 Obsidian 版本的 Anki，并且也支持 cloze card! 相较起来，Cloze plugin 更适合页面/整篇文章回顾的场景。

<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/demo.gif" width="500" />

## 使用

### 基本

选中文本，点击右键唤出编辑器菜单。

- 创建填空: 将所选区域转换为填空.
- 创建带提示的填空： 会弹出弹框，以便于先录入提示. 提示后续会显示在填空中。
- 移除填空: 移除选中文本里的所有填空.

<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/editor-menu.png" width="400" />

然后在预览模式下，点击填空切换显隐。点击侧边 ribbon icon 小鱼，可以切换当页所有填空的显隐。注意新开阅读页面的默认显隐也会受此小鱼的状态影响。

<p>
<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/fish.png" width="300" />
<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/fish-mobile.png" width="280" />
</p>

### 功能

#### 自动转换

在「设置」里开启高亮文本、粗体文本、下划线文本的自动转换后，在阅读模式下，它们便会自动转换为填空。

<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/settings1.png" width="350" />

#### 填空提示

因为填空的本质是 span 标签，所以有提供以下两种提示方式。

- 提示直接显示在填空里

  通过“创建带提示的填空”创建填空，或者在填空的 span 标签里添加 `data-cloze-hint="提示内容"`，e.g. `<span class="cloze-span" data-cloze-hint="提示内容"></span>`

  <img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/hint.png" width="300" />

- 鼠标 hover 填空时显示提示（仅支持电脑端） 

  在填空的 span 标签里添加 `title="提示内容"`，e.g. `<span class="cloze-span" title="提示内容"></span>`

  <img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/hint2.png" width="300" />

#### 固定填空长度

在设置里开启 固定填空长度 后，所有的填空长度将会保持一致，不随文本内容变化。可以通过自定义样式自定义固定填空长度。

<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/setting-fixed-width.png" />

#### 特定页面启用

通过设置里的「作用标签」设置标签后，该插件将仅作用于带有该标签的笔记上，默认空则作用于所有笔记。

<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/setting-tag.png" />

#### 自定义右键菜单

在设置里可以自定义右键菜单选项。

<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/setting-editor-menu.png" />

#### 自定义样式

可以通过自定义 CSS 和 CSS 变量自定义样式。

| CSS变量  | 描述  |
|---|---|
| --cloze-underline-color  | 填空下划线颜色  |
| --cloze-underline-width  | 填空下划线宽度  |
| --cloze-underline-style  | 填空下划线样式  |
| --cloze-hint-color  | 填空提示颜色  |
| --cloze-hint-font-size  | 填空提示文字大小 |
| --cloze-fixed-width  | 填空固定宽度 (如果开启了固定宽度的话) |

示例:

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

### 最佳实践

- 将「添加填空」操作添加为 Obsidian 热键可以大大节省时间！<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/hotkeys.png" width="700" /><img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/hotkeys2.png" width="700" />
- 页面温习好助手：[Spaced Repetition #review 标签](https://www.stephenmwangi.com/obsidian-spaced-repetition/notes/)

## Q&As

### 页面导出为 PDF时，填空的显隐状态如何控制？

目前只能为“全显”或是“全隐”。

- 点击小鱼, 全局隐藏 --> 导出的 pdf 也隐
- 点击小鱼, 全局显示 --> 导出的 pdf 显示

## 安装

插件市场（可能需要科学上网）搜索 **Cloze** 即可。

手动安装的话，可以参考[这里](https://www.cnblogs.com/zd2021/articles/15410243.html)。
