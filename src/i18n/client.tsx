"use client";

import { createContext, useContext } from "react";
import type { Lang } from "./lang";

const LangContext = createContext<Lang>("ro");

/** Set by the root layout of each language. */
export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
