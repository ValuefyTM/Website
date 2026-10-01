"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useLang } from "@/i18n/client";
import s from "./client.module.css";

/** Two kinds of portal users: clients, and partners (real-estate agents, credit brokers) who order valuations for their clients. */
export type Role = "client" | "partner";

const RoleContext = createContext<{ role: Role; setRole: (r: Role) => void }>({ role: "client", setRole: () => {} });
export const useRole = () => useContext(RoleContext).role;

// ?tip=colaborator (or ?tip=partner) opens the partner tab directly — handy for links sent to agents.
const fromUrl = (): Role => (/^(colaborator|partner)$/i.test(new URLSearchParams(location.search).get("tip") ?? "") ? "partner" : "client");

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("client");
  useEffect(() => setRoleState(fromUrl()), []);
  const setRole = (r: Role) => {
    setRoleState(r);
    const url = new URL(location.href);
    if (r === "partner") url.searchParams.set("tip", "colaborator");
    else url.searchParams.delete("tip");
    history.replaceState(null, "", url);
  };
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
}

/** Renders its children only for one role (server-rendered content can be passed in). */
export function RoleOnly({ role, children }: { role: Role; children: React.ReactNode }) {
  return useRole() === role ? <>{children}</> : null;
}

const T = {
  ro: { label: "Tip de cont", client: "Client", partner: "Colaborator" },
  en: { label: "Account type", client: "Client", partner: "Partner" },
};

export function RoleTabs() {
  const { role, setRole } = useContext(RoleContext);
  const t = T[useLang()];
  const tabs: Role[] = ["client", "partner"];
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const next = role === "client" ? "partner" : "client";
    setRole(next);
    document.getElementById(`role-${next}`)?.focus();
  };
  return (
    <div className={s.tabs} role="tablist" aria-label={t.label} onKeyDown={onKey}>
      {tabs.map((r) => (
        <button
          key={r}
          id={`role-${r}`}
          type="button"
          role="tab"
          aria-selected={role === r}
          aria-controls="login-panel"
          tabIndex={role === r ? 0 : -1}
          className={s.tab}
          onClick={() => setRole(r)}
        >
          {t[r]}
        </button>
      ))}
    </div>
  );
}
