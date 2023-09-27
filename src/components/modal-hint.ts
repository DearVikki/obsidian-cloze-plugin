import { App, Modal, Setting } from "obsidian";

export default class HintModal extends Modal {
  result: string;
  clozedText: string;
  onSubmit: (result: string) => void;

  constructor(app: App, clozedText: string, onSubmit: (result: string) => void) {
    super(app);
	this.clozedText = clozedText;
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl("p", { text: "Clozed text: " + this.clozedText });

    new Setting(contentEl)
		.setClass('modal-hint-setting')
		.setName("Hint text: ")
		.addText((text) =>
			text.onChange((value) => {
			this.result = value
			}));

    new Setting(contentEl)
		.addButton((btn) =>
			btn
			.setButtonText("Submit")
			.setCta()
			.onClick(() => {
				this.close();
				this.onSubmit(this.result);
			}));
		}

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
