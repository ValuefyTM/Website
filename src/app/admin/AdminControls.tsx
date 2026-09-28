"use client";

import { useState } from "react";
import a from "./admin.module.css";

export function PublishToggle({ id, published }: { id: string; published: boolean }) {
  const [on, setOn] = useState(published);
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className={`${a.toggle} ${on ? a.toggleOn : ""}`}
      disabled={busy}
      aria-pressed={on}
      title={on ? "Vizibil pe site — apasă pentru a ascunde" : "Ciornă — apasă pentru a publica"}
      onClick={async () => {
        setBusy(true);
        const r = await fetch(`/api/admin/listings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !on }) });
        if (r.ok) setOn(!on);
        setBusy(false);
      }}
    >
      <span />{on ? "Publicat" : "Ciornă"}
    </button>
  );
}

const LABELS: Record<string, string> = { NEW: "Nouă", SENT: "Raport trimis", DONE: "Rezolvată" };

export function InquiryStatus({ id, status, kind }: { id: number; status: string; kind: string }) {
  const [value, setValue] = useState(status);
  const options = kind === "report" ? ["NEW", "SENT", "DONE"] : ["NEW", "DONE"];
  return (
    <select
      className={a.select}
      value={value}
      onChange={async (e) => {
        const v = e.target.value;
        setValue(v);
        await fetch(`/api/admin/inquiries/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: v }) });
      }}
    >
      {options.map((o) => <option key={o} value={o}>{LABELS[o]}</option>)}
    </select>
  );
}
