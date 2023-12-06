export interface ClozePluginSettings {
	defaultHide: boolean;
	selectorTag: string;
	includeHighlighted: boolean;
	includeUnderlined: boolean;
	includeBolded: boolean;
	includeBracketed: boolean;
	fixedClozeWidth: boolean;
	editorMenuAddCloze: boolean;
	editorMenuAddClozeWithHint: boolean;
	editorMenuRemoveCloze: boolean;
}

const DEFAULT_SETTINGS: ClozePluginSettings = {
	defaultHide: true,
	selectorTag: "#",
	includeHighlighted: false,
	includeUnderlined: false,
	includeBolded: false,
	includeBracketed: false,
	fixedClozeWidth: false,
	editorMenuAddCloze: true,
	editorMenuAddClozeWithHint: true,
	editorMenuRemoveCloze: true,
}

export default DEFAULT_SETTINGS;
