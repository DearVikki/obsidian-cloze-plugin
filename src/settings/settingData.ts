export interface ClozePluginSettings {
	defaultHide: boolean;
	selectorTag: string;
	hoverToReveal: boolean;
	includeHighlighted: boolean;
	includeUnderlined: boolean;
	includeBolded: boolean;
	includeItalics: boolean;
	includeCurlyBrackets: boolean;
	includeBracketed: boolean;
	fixedClozeWidth: boolean;
	editorMenuAddCloze: boolean;
	editorMenuAddClozeWithHint: boolean;
	editorMenuRemoveCloze: boolean;

	hintStrategy: number;
	hintCount: number;
	hintPercentage: number;
}

export const HINT_STRATEGY = {
	none: 0,
	count: 1,
	percentage: 2,
}

const DEFAULT_SETTINGS: ClozePluginSettings = {
	defaultHide: true,
	hoverToReveal: false,
	selectorTag: "#",
	includeHighlighted: false,
	includeUnderlined: false,
	includeBolded: false,
	includeItalics: false,
	includeBracketed: false,
	includeCurlyBrackets: false,
	fixedClozeWidth: false,
	editorMenuAddCloze: true,
	editorMenuAddClozeWithHint: true,
	editorMenuRemoveCloze: true,

	hintStrategy: HINT_STRATEGY.none,
	hintCount: 2,
	hintPercentage: 0.20, // 20%
}

export default DEFAULT_SETTINGS;
