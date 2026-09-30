"use client";

import a from "./admin.module.css";

export function LogoutButton() {
  return (
    <button
      type="button"
      className={a.ghostBtn}
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        location.href = "/admin/login";
      }}
    >
      Ieșire
    </button>
  );
}
