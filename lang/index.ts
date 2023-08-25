import { Ilangs } from './types';
import en from './en';
import zh from './zh';

const langs: {
    [key: string]: Ilangs;
} = {
    en,
    zh,
}

const language = window.localStorage.getItem('language') || "en";
export default langs[language] || en;