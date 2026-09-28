"use client";

import { useState } from "react";
import a from "../admin.module.css";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className={a.form}
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setErr("");
        const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
        if (r.ok) location.href = "/admin";
        else {
          const d = (await r.json().catch(() => ({}))) as { error?: string };
          setErr(d.error || "Nu te-am putut autentifica.");
          setBusy(false);
        }
      }}
    >
      <label>Parolă<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" autoFocus /></label>
      {err && <div role="alert" className={a.err}>{err}</div>}
      <button type="submit" className={a.primary} disabled={busy || !password}>{busy ? "Se verifică…" : "Intră"}</button>
    </form>
  );
}
