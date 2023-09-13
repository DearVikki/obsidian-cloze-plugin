# Cloze - Obsidian Plugin

简体中文 | [English](./README.md)

什么是 Cloze？简而言之，就是完型填空。熟悉 Anki 的朋友们绝对不陌生的！记忆单词、句型、语录时，超好用。

这款干净的 Obsidian 插件支持高亮文本、粗体文本、下划线文本以及任何自选文本区域的 cloze 化。不过仅在阅读模式 reading mode 下才可有效交互哦！

p.s.刚发现 [Spaced Repetition](https://www.stephenmwangi.com/obsidian-spaced-repetition/) 这款插件简直就是 Obsidian 版本的 Anki，并且也支持 cloze card! 相较起来，Cloze plugin 更适合页面/整篇文章回顾的场景。

<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/demo.gif" width="500" />

## 使用

### 创建填空

可通过特定文本或任何自定义文本创建！

#### 特定文本

在「设置」里开启高亮文本、粗体文本、下划线文本的自动转换后，在阅读模式下，它们便会自动转换为填空。

<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/settings1.png" width="350" />

#### 自定义填空

编辑模式下，选中任意文字，右键弹出选项点击「添加填空」即可转换为填空；选中单个或多个填空, 右键弹出选项点击「移除填空」即可移除。

<p>
<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/add.png" width="280" />
<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/remove.png" width="500" />
</p>

Note：当自选文字被转换为填空时，会被加上一对自定义 `<span></span>` 标签。所以如果你对 markdown 原文本导出有需求，就需要先将自定义填空都移除掉喔。

### 使用

Note: 仅在阅读模式下有效。

#### 单个填空

点击切换单个填空的显隐。 

<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/enable_highlight.gif" width="400" />

#### 所有填空

点击侧边 ribbon icon 小鱼，可以切换当页所有填空的显隐。注意新开阅读页面的默认显隐也会受此小鱼的状态影响。

<p>
<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/fish.png" width="300" />
<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/fish-mobile.png" width="280" />
</p>

### 最佳实践

- 将「添加填空」操作添加为 Obsidian 热键可以大大节省时间！<img src="https://raw.githubusercontent.com/dearvikki/obsidian-cloze-plugin/main/assets/hotkey.png" width="800" />
- 页面温习好助手：[Spaced Repetition #review 标签](https://www.stephenmwangi.com/obsidian-spaced-repetition/notes/)

## Q&As

### 想给 cloze 增加提示

因为自定义 cloze 的本质就是 html span 标签，所以你刚好可以用上标签的 title 属性！

```html
This a <span class="cloze-span" title="提示这么放即可">custom</span> cloze.
```

然后鼠标悬浮在 cloze 上，即可看到提示啦。

### 页面导出为 PDF时，填空的显隐状态如何控制？

目前只能为“全显”或是“全隐”。

- 点击小鱼, 全局隐藏 --> 导出的 pdf 也隐
- 点击小鱼, 全局显示 --> 导出的 pdf 显示

### 我想要不一样的填空下划线样式

你可以自己修改喔！全局 CSS 里调整如下 class 即可：

```css
.cloze-span {
	border-bottom-color: blue;
 	border-bottom-width: 2px;
	/** or any other styles */
}
```

## 安装

插件市场（可能需要科学上网）搜索 **Cloze** 即可。

手动安装的话，可以参考[这里](https://www.cnblogs.com/zd2021/articles/15410243.html)。
