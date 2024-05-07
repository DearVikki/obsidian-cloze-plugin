import { ATTRS, CLASSES } from './const';

const utils = {
	getClozeEl: (target: HTMLElement) : HTMLElement | null => {
		return target.closest('.' + CLASSES.cloze);
	},
	getClozeContentEl: (target: HTMLElement) : HTMLElement | null => {
		return target.querySelector('.' + CLASSES.clozeContent);
	},
	getClozeHintEl: (target: HTMLElement) : HTMLElement | null => {
		return target.querySelector('.' + CLASSES.hint);
	},
	getClozeContent: (clozeEl: HTMLElement) : string => {
		const $content = clozeEl.querySelector('.' + CLASSES.clozeContent);
		if ($content) {
			return $content.textContent || "";
		}
		return "";
	},
	hasCustomHint: (clozeEl: HTMLElement) : boolean => {
		return !!clozeEl.getAttribute(ATTRS.hint);
	},
	getClozeCustomHint: (clozeEl: HTMLElement) : string => {
		return clozeEl.getAttribute(ATTRS.hint) || "";
	},
	getClozeCurrentHint: (clozeEl: HTMLElement) : string => {
		const $hint = clozeEl.querySelector('.' + CLASSES.hint);
		if ($hint) {
			return $hint.textContent || "";
		}
		return "";
	},
	setClozeHint: (clozeEl: HTMLElement, hint: string | undefined) => {
		const $hint = utils.getClozeHintEl(clozeEl);
		if(!$hint || hint === undefined) return;
		$hint.textContent = hint;
		if($hint.parentElement) $hint.parentElement.title = hint;
	},
	isClozeHide: (clozeEl: HTMLElement):boolean => {
		return !!clozeEl.getAttribute(ATTRS.hide);
	}
}

export default utils;
