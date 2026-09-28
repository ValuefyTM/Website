// Server-only: send an email through Resend. Returns false (never throws) when it cannot send.
export async function sendEmail(opts: { to: string[]; subject: string; html: string; text?: string; replyTo?: string }): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_EMAIL_FROM;
  if (!apiKey || !from || !opts.to.length) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: opts.to, subject: opts.subject, html: opts.html, text: opts.text, reply_to: opts.replyTo || undefined }),
    });
    if (!res.ok) {
      console.error("[email] failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("[email] failed", error);
    return false;
  }
}

export const officeEmails = () =>
  (process.env.LEAD_EMAIL_TO || process.env.NEXT_PUBLIC_EMAIL || "contact@valuefy.ro").split(",").map((s) => s.trim()).filter(Boolean);

export const esc = (s: unknown) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
