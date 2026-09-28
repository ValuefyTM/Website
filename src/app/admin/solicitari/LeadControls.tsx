"use client";

import { useState } from "react";
import a from "../admin.module.css";

const patch = (id: string, body: object) =>
  fetch(`/api/admin/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

export function LeadStatusSelect({ id, status, options }: { id: string; status: string; options: readonly (readonly [string, string])[] }) {
  const [value, setValue] = useState(status);
  return (
    <select
      className={`${a.select} ${a[`st${value}`] ?? ""}`}
      value={value}
      aria-label="Status"
      onChange={async (e) => {
        const prev = value;
        setValue(e.target.value);
        if (!(await patch(id, { status: e.target.value })).ok) setValue(prev);
      }}
    >
      {options.map(([k, label]) => <option key={k} value={k}>{label}</option>)}
    </select>
  );
}

export function LeadNotes({ id, notes }: { id: string; notes: string }) {
  const [value, setValue] = useState(notes);
  const [state, setState] = useState<"" | "saving" | "saved" | "error">("");
  const save = async () => {
    setState("saving");
    setState((await patch(id, { admin_notes: value })).ok ? "saved" : "error");
  };
  return (
    <div className={a.notes}>
      <textarea value={value} onChange={(e) => { setValue(e.target.value); setState(""); }} rows={5} placeholder="ex. Sunat pe 12.10, trimis ofertă 450 lei, revine luni." />
      <div className={a.actions}>
        <button type="button" className={a.primary} onClick={save} disabled={state === "saving"}>{state === "saving" ? "Se salvează…" : "Salvează notițele"}</button>
        {state === "saved" && <span className={a.hint}>Salvat.</span>}
        {state === "error" && <span className={a.err}>Nu am putut salva.</span>}
      </div>
    </div>
  );
}
