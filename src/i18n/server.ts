// Server components: the language of the page being rendered.
// English route files call setLang("en") before rendering; everything else is Romanian.
import { cache } from "react";
import type { Lang } from "./lang";

const store = cache(() => ({ lang: "ro" as Lang }));

export const setLang = (lang: Lang) => { store().lang = lang; };
export const getLang = (): Lang => store().lang;
