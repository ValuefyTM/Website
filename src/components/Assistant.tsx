"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { site } from "@/config/site";
import {
  ASSET_TYPES, CITIES, CUSTOMERS, DEADLINES, DOCS, DOC_HELP, GREETING, MOBILE, PURPOSES, SALE_GREETING, SALE_PURPOSE, SALE_TYPES,
  groupNames, groupOf, isSale, nextStep, question, typeObj, type Lead, type Step,
} from "@/lib/lead";
import { useMediaQuery } from "@/lib/useMediaQuery";
import s from "./Assistant.module.css";

/** `sale`: the visitor wants to sell a property through VALUEFY (no valuation purpose / deadline questions). */
type Ctx = { type?: string; purpose?: string; sale?: boolean };
type Msg =
  | { kind: "text"; role: "user" | "assistant"; text: string }
  | { kind: "file"; id: string; name: string; ext: string; status: string; pct: number; color: string };

type AssistantApi = { open: (ctx?: Ctx) => void; menuOpen: boolean; setMenuOpen: (v: boolean) => void };
const AssistantContext = createContext<AssistantApi | null>(null);
export const useAssistant = () => {
  const c = useContext(AssistantContext);
  if (!c) throw new Error("useAssistant must be used inside <AssistantProvider>");
  return c;
};

const MAX_UPLOAD = 4 * 1024 * 1024;
const TYPING_MS = 650;
const greetingMsg = (sale = false): Msg => ({ kind: "text", role: "assistant", text: sale ? SALE_GREETING : GREETING });
const baseLead = (sale = false): Lead => (sale ? { request_kind: "sale", valuation_purpose: SALE_PURPOSE } : {});
const fold = (v: string) => v.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

type Form = { describe: string; city: string; address: string; surface: string; rooms: string; land: string; price: string; notes: string; date: string; name: string; phone: string; email: string; consent: boolean };
const emptyForm: Form = { describe: "", city: "", address: "", surface: "", rooms: "", land: "", price: "", notes: "", date: "", name: "", phone: "", email: "", consent: false };

/** `saleCta`: on phones, the floating / sticky button reads "Vinde și tu" and starts a sale request (listing pages). */
export function AssistantProvider({ children, saleCta = false }: { children: React.ReactNode; saleCta?: boolean }) {
  const isMobile = useMediaQuery("(max-width: 1079px)");
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([greetingMsg()]);
  const [step, setStepState] = useState<Step>("type");
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [lead, setLeadState] = useState<Lead>({});
  const [f, setF] = useState<Form>(emptyForm);
  const [contactErr, setContactErr] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState("");
  const [leadId, setLeadId] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  // AI availability: null = checking, true = online, false = offline.
  const [aiOnline, setAiOnline] = useState<boolean | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  // Refs mirror state that async callbacks (timers, fetches) must read fresh.
  const leadRef = useRef<Lead>({});
  const stepRef = useRef<Step>("type");
  const stepAskedRef = useRef<Step | null>("type");
  const msgsRef = useRef<Msg[]>(msgs);
  const filesRef = useRef<File[]>([]);
  const genRef = useRef(0); // bumps on reset so stale timers are ignored
  const lastGroup = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  msgsRef.current = msgs;
  const setStep = (v: Step) => { stepRef.current = v; setStepState(v); };
  const setLead = (l: Lead) => { leadRef.current = l; setLeadState(l); };
  const push = (...m: Msg[]) => setMsgs((prev) => [...prev, ...m]);

  const botSay = useCallback((text: string, then?: () => void) => {
    const gen = genRef.current;
    setTyping(true);
    setTimeout(() => {
      if (gen !== genRef.current) return;
      setTyping(false);
      setMsgs((prev) => [...prev, { kind: "text", role: "assistant", text }]);
      then?.();
    }, TYPING_MS);
  }, []);

  const advance = useCallback((extra?: string) => {
    const l = leadRef.current;
    const next = nextStep(l);
    const say = () => {
      setStep(next);
      setEditMode(false);
      if (next !== stepAskedRef.current || next === "summary") {
        stepAskedRef.current = next;
        botSay(question(next, l));
      }
    };
    setStep("wait");
    if (extra) botSay(extra, say);
    else say();
  }, [botSay]);

  const patchLead = useCallback((patch: Lead, userText?: string, extra?: string) => {
    if (userText) push({ kind: "text", role: "user", text: userText });
    setLead({ ...leadRef.current, ...patch });
    advance(extra);
  }, [advance]);

  const reset = useCallback((sale = isSale(leadRef.current)) => {
    genRef.current++;
    setMsgs([greetingMsg(sale)]);
    msgsRef.current = [greetingMsg(sale)];
    setStep("type");
    stepAskedRef.current = "type";
    setLead(baseLead(sale));
    setF(emptyForm);
    setLeadId("");
    setEditMode(false);
    setContactErr("");
    setSubmitErr("");
    filesRef.current = [];
    setFiles([]);
    setTyping(false);
    setBusy(false);
  }, []);

  const openAssistant = useCallback((ctx: Ctx = {}) => {
    openerRef.current = document.activeElement as HTMLElement | null;
    setOpen(true);
    setMenuOpen(false);
    const wasDone = stepRef.current === "done";
    // Switching between selling and a valuation request starts a fresh conversation.
    const curSale = isSale(leadRef.current);
    const switching = ctx.sale ? !curSale : curSale && !!(ctx.type || ctx.purpose);
    const fresh0 = wasDone || switching;
    if (fresh0) reset(!!ctx.sale);
    const patch: Lead = {};
    if (ctx.type) patch.property_type = ctx.type;
    if (ctx.purpose) patch.valuation_purpose = ctx.purpose;
    if (Object.keys(patch).length) {
      const fresh = fresh0 || msgsRef.current.length <= 1;
      if (fresh) setMsgs([]);
      const prev: Lead = { ...leadRef.current };
      // A different asset type makes the previous description/size irrelevant.
      if (ctx.type && prev.property_type && prev.property_type !== ctx.type) {
        for (const k of ["property_description", "details_done", "surface_area", "land_area", "rooms"] as const) delete prev[k];
      }
      const l = { ...prev, ...patch };
      setLead(l);
      const next = nextStep(l);
      const pre = ctx.purpose && !ctx.type ? `Am notat: evaluare pentru ${ctx.purpose.toLowerCase()}. ` : "";
      const text = next === "type" ? pre + "Ce dorești să evaluezi?" : (pre ? pre + "\n\n" : "") + question(next, l);
      setStep(next);
      stepAskedRef.current = next;
      botSay(text);
    }
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 400);
  }, [botSay, reset]);

  const close = useCallback(() => {
    setOpen(false);
    openerRef.current?.focus?.({ preventScroll: true });
  }, []);

  // Free-text question → Claude (server route) extracts fields and replies.
  const ask = async (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;
    const gen = genRef.current;
    const userMsg: Msg = { kind: "text", role: "user", text };
    const history = [...msgsRef.current, userMsg]
      .filter((m): m is Extract<Msg, { kind: "text" }> => m.kind === "text")
      .map((m) => ({ role: m.role, content: m.text }));
    push(userMsg);
    setInput("");
    setBusy(true);
    setTyping(true);
    let reply = "Momentan nu pot răspunde. Poți continua solicitarea folosind opțiunile de mai jos.";
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, step: stepRef.current, lead: leadRef.current }),
      });
      if (res.ok) {
        const data = (await res.json()) as { reply?: string; fields?: Lead; ai?: boolean };
        if (gen !== genRef.current) return;
        if (data.fields && Object.keys(data.fields).length) setLead({ ...leadRef.current, ...data.fields });
        reply = (data.reply || "").trim() || "Am notat.";
        setAiOnline(data.ai !== false);
      } else {
        setAiOnline(false);
      }
    } catch {
      /* network error → fallback reply */
    }
    if (gen !== genRef.current) return;
    setBusy(false);
    setTyping(false);
    push({ kind: "text", role: "assistant", text: reply });
    const next = nextStep(leadRef.current);
    const cur = stepRef.current;
    if (cur === "done") return;
    if (next !== cur || next === "summary") {
      setStep(next);
      if (next !== stepAskedRef.current) {
        stepAskedRef.current = next;
        botSay(question(next, leadRef.current));
      }
    }
  };

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files || []);
    e.target.value = "";
    for (const file of list) {
      const id = Math.random().toString(36).slice(2);
      const ext = (file.name.split(".").pop() || "").toUpperCase().slice(0, 4);
      const upd = (p: Partial<Extract<Msg, { kind: "file" }>>) =>
        setMsgs((prev) => prev.map((m) => (m.kind === "file" && m.id === id ? { ...m, ...p } : m)));
      const used = filesRef.current.reduce((n, x) => n + x.size, 0);
      if (used + file.size > MAX_UPLOAD) {
        push({ kind: "file", id, name: file.name, ext, status: "Fișier prea mare — îl poți trimite după ce primești oferta", pct: 100, color: "#C2362B" });
        continue;
      }
      filesRef.current = [...filesRef.current, file];
      push({ kind: "file", id, name: file.name, ext, status: "Se încarcă…", pct: 8, color: "#C98A10" });
      setTimeout(() => upd({ pct: 70 }), 80);
      setTimeout(() => upd({ status: "Se procesează…", pct: 90 }), 1000);
      setTimeout(() => {
        upd({ status: "✓ Document încărcat", pct: 100, color: "#1FA971" });
        setFiles([...filesRef.current]);
      }, 1900);
    }
  };

  const submit = async () => {
    setSubmitting(true);
    setSubmitErr("");
    const body = new FormData();
    body.set("lead", JSON.stringify(leadRef.current));
    body.set("consent", String(f.consent));
    filesRef.current.forEach((file) => body.append("files", file));
    try {
      const res = await fetch("/api/leads", { method: "POST", body });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; lead_id?: string; confirmation_sent?: boolean };
      if (!res.ok || !data.lead_id) throw new Error(String(res.status));
      setLeadId(data.lead_id);
      setConfirmed(!!data.confirmation_sent);
      setStep("done");
    } catch {
      setSubmitErr(`Nu am putut trimite solicitarea. Încearcă din nou sau sună-ne la ${site.phone}.`);
    } finally {
      setSubmitting(false);
    }
  };

  // Is the AI actually reachable? Checked once per page (cached 5 min per tab).
  useEffect(() => {
    const KEY = "vf_ai_status";
    try {
      const c = JSON.parse(sessionStorage.getItem(KEY) || "null") as { online: boolean; at: number } | null;
      if (c && Date.now() - c.at < 5 * 60 * 1000) { setAiOnline(c.online); return; }
    } catch { /* storage unavailable */ }
    const id = setTimeout(() => {
      fetch("/api/assistant/status")
        .then(async (r) => (r.ok ? ((await r.json()) as { online?: boolean }) : { online: false }))
        .then((d) => {
          const online = !!d.online;
          setAiOnline(online);
          try { sessionStorage.setItem(KEY, JSON.stringify({ online, at: Date.now() })); } catch { /* ignore */ }
        })
        .catch(() => setAiOnline(false));
    }, 1200);
    return () => clearTimeout(id);
  }, []);

  // Page scroll → mobile sticky CTA.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep the conversation scrolled to the latest message.
  useEffect(() => {
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, [msgs, step, typing, editMode]);

  // Esc closes; lock page scroll behind the full-screen mobile drawer.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    if (isMobile) document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, isMobile, close]);

  const api = useMemo(() => ({ open: openAssistant, menuOpen, setMenuOpen }), [openAssistant, menuOpen]);

  // ---------- derived view ----------
  const st: Step = typing ? "wait" : step;
  const done = step === "done";
  const sale = isSale(lead);
  const names = groupNames(lead);
  if (groupOf(step, lead)) lastGroup.current = groupOf(step, lead);
  const group = Math.min(lastGroup.current, names.length);
  const typeK = lead.property_type;
  const tObj = typeObj(typeK);

  const chipSets: Partial<Record<Step, string[]>> = { type: sale ? SALE_TYPES : ASSET_TYPES.map((t) => t.k), purpose: PURPOSES, deadline: DEADLINES, documents: DOCS, customer: CUSTOMERS };
  const chipField: Partial<Record<Step, keyof Lead>> = { type: "property_type", purpose: "valuation_purpose", deadline: "deadline", documents: "documents_status", customer: "customer_type" };
  const pick = (field: keyof Lead, v: string) => {
    if (field === "deadline" && v === "Termen specific") {
      push({ kind: "text", role: "user", text: v });
      setStep("date");
      return botSay(question("date", leadRef.current));
    }
    if (field === "documents_status" && v === DOCS[2]) return patchLead({ documents_status: v }, v, DOC_HELP);
    const extra =
      field === "documents_status"
        ? v !== "Da"
          ? "În regulă. Poți încărca acum ce ai, iar restul le trimiți după ce primești oferta."
          : "Excelent. Le poți încărca aici acum sau după ce primești oferta."
        : undefined;
    patchLead({ [field]: v }, v, extra);
  };

  const q = fold(f.city);
  const citySugg = f.city ? CITIES.filter((c) => fold(c).startsWith(q) && c !== f.city).slice(0, 5) : ["Timișoara", "Arad", "Lugoj", "Reșița", "Deva"];
  const setField = <K extends keyof Form>(k: K) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((prev) => ({ ...prev, [k]: (e.target.type === "checkbox" ? e.target.checked : e.target.value) as Form[K] }));

  const describeSubmit = () => {
    const d = f.describe.trim();
    if (!d) return;
    patchLead({ property_description: d }, d);
  };
  const citySubmit = () => {
    const c = f.city.trim();
    if (!c) return;
    const a = f.address.trim();
    patchLead({ city: c, ...(a ? { address: a } : {}) }, [c, a].filter(Boolean).join(", "));
  };
  const detailsSubmit = () => {
    const p: Lead = { details_done: true };
    if (f.surface) p.surface_area = f.surface;
    if (f.rooms) p.rooms = f.rooms;
    if (f.land) p.land_area = f.land;
    if (sale && f.price) p.asking_price = f.price.replace(/[^\d]/g, "");
    if (f.notes) p.notes = f.notes;
    const txt = [f.surface && f.surface + " m²", f.rooms && f.rooms + " camere", f.land && f.land + " m² teren", sale && f.price && "preț dorit " + f.price + " €", f.notes].filter(Boolean).join(" · ") || "Continuă";
    patchLead(p, txt);
  };
  const contactSubmit = () => {
    const name = f.name.trim(), phone = f.phone.trim(), email = f.email.trim();
    let err = "";
    if (!name) err = "Te rog completează numele.";
    else if (!phone && !email) err = "Adaugă un număr de telefon sau o adresă de email.";
    else if (email && !/^\S+@\S+\.\S+$/.test(email)) err = "Adresa de email nu pare validă.";
    else if (phone && phone.replace(/\D/g, "").length < 9) err = "Numărul de telefon pare incomplet.";
    else if (!f.consent) err = "Este necesar acordul pentru a putea trimite oferta.";
    setContactErr(err);
    if (err) return;
    patchLead({ name, ...(phone ? { phone } : {}), ...(email ? { email } : {}) }, [name, phone, email].filter(Boolean).join(" · "));
  };

  const sumRows: [string, string | undefined][] = [
    ...(lead.property_description ? ([["Descriere", lead.property_description]] as [string, string][]) : []),
    ["Localitate", [lead.city, lead.address].filter(Boolean).join(", ")],
    ...(typeK === MOBILE
      ? []
      : ([["Suprafață", lead.surface_area ? lead.surface_area + " m²" : lead.land_area ? lead.land_area + " m² teren" : "—"]] as [string, string][])),
    ...(sale
      ? ([["Solicitare", "Vânzare prin VALUEFY"], ["Preț dorit", lead.asking_price ? Number(lead.asking_price).toLocaleString("ro-RO") + " €" : "De stabilit"]] as [string, string][])
      : ([
          ["Scop", lead.valuation_purpose],
          ["Termen", lead.deadline_date ? new Date(lead.deadline_date).toLocaleDateString("ro-RO") : lead.deadline],
        ] as [string, string | undefined][])),
    ["Documente", lead.documents_status === DOCS[2] ? "De clarificat" : lead.documents_status === "Da" ? "Disponibile" : lead.documents_status],
    ["Client", lead.customer_type],
    ["Contact", lead.name],
    ["Telefon / email", [lead.phone, lead.email].filter(Boolean).join(" · ")],
  ];
  const editMap: [string, (keyof Lead)[]][] = [
    ["Proprietate", ["property_type", "property_description", "details_done", "surface_area", "land_area", "rooms"]],
    ["Localizare", ["city", "address"]],
    ["Detalii", ["details_done", "surface_area", "land_area", "rooms", "asking_price"]],
    ...(sale
      ? []
      : ([
          ["Scop", ["valuation_purpose"]],
          ["Termen", ["deadline", "deadline_date"]],
        ] as [string, (keyof Lead)[]][])),
    ["Documente", ["documents_status"]],
    ["Client", ["customer_type"]],
    ["Contact", ["name", "phone", "email"]],
  ];
  const editField = (keys: (keyof Lead)[]) => {
    const nl = { ...leadRef.current };
    keys.forEach((k) => delete nl[k]);
    setLead(nl);
    setEditMode(false);
    stepAskedRef.current = null;
    advance();
  };

  const sellHere = saleCta && isMobile;
  const showSticky = isMobile && !open && scrolled;
  const showFab = !open && !showSticky && !(isMobile && menuOpen);
  const chips = !busy ? chipSets[st] : undefined;

  const logoMark = (
    <span className={s.logoMark} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/valuefy-logo.png" alt="" />
    </span>
  );

  return (
    <AssistantContext.Provider value={api}>
      {children}

      {showFab && (
        <button
          type="button"
          className={s.fab}
          onClick={() => openAssistant(sellHere ? { sale: true } : undefined)}
          aria-label={sellHere ? "Vinde și tu o proprietate" : "Deschide asistentul de evaluare"}
        >
          <span className={s.fabIcon}>
            {logoMark}
            <span className={s.fabDot} style={{ background: aiOnline ? "var(--green)" : "#9A9FA8" }} />
          </span>
          {sellHere ? "Vinde și tu" : "Asistent evaluare"}
        </button>
      )}

      {showSticky && (
        <div className={s.sticky}>
          {sellHere
            ? <button type="button" className={s.stickyCta} onClick={() => openAssistant({ sale: true })}>Vinde și tu</button>
            : <button type="button" className={s.stickyCta} onClick={() => openAssistant()}>Solicită evaluare</button>}
          <button type="button" className={s.stickyAi} onClick={() => openAssistant()} aria-label="Asistent evaluare">{logoMark}</button>
        </div>
      )}

      <div
        role="dialog"
        aria-modal={isMobile}
        aria-label={sale ? "Asistent vânzare VALUEFY" : "Asistent evaluare VALUEFY"}
        aria-hidden={!open}
        inert={!open}
        className={`${s.drawer} ${open ? s.drawerOpen : ""}`}
      >
        <div className={s.head}>
          <div className={s.headLogo}>{logoMark}</div>
          <div className={s.headText}>
            <div className={s.headEyebrow}>VALUEFY AI</div>
            <div className={s.headTitle}>
              {sale ? "Asistent vânzare" : "Asistent evaluare"}{" "}
              <span className={`${s.online} ${aiOnline ? "" : s.offline}`} title={aiOnline === false ? "Asistentul AI nu este disponibil momentan. Poți folosi opțiunile ghidate." : undefined}>
                <span />{aiOnline === null ? "Se verifică…" : aiOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
          <button type="button" className={s.iconBtn} onClick={() => reset()} aria-label="Solicitare nouă" title="Solicitare nouă">↺</button>
          <button type="button" className={`${s.iconBtn} ${s.closeBtn}`} onClick={close} aria-label="Închide asistentul">×</button>
        </div>

        <div className={s.progress}>
          <div className={s.progressText}>
            <span>{done ? "Solicitare trimisă" : `Pasul ${group} din ${names.length}`}</span>
            <span className={s.progressName}>{names[group - 1]}</span>
          </div>
          <div role="progressbar" aria-valuemin={0} aria-valuemax={names.length} aria-valuenow={done ? names.length : group - 1} aria-label="Progresul solicitării" className={s.segs}>
            {names.map((n, i) => (
              <span key={n} style={{ background: done || i < group - 1 ? "var(--acc)" : i === group - 1 ? "var(--acc-soft)" : "#E7E9ED" }} />
            ))}
          </div>
        </div>

        <div ref={scrollRef} className={s.body} aria-live="polite">
          {msgs.map((m, i) =>
            m.kind === "text" ? (
              <div key={i} className={m.role === "assistant" ? s.bot : s.user}>{m.text}</div>
            ) : (
              <div key={m.id} className={s.file}>
                <span className={s.fileExt}>{m.ext}</span>
                <span className={s.fileInfo}>
                  <span className={s.fileName}>{m.name}</span>
                  <span style={{ color: m.color, fontSize: 12 }}>{m.status}</span>
                  <span className={s.fileBar}><span style={{ width: m.pct + "%", background: m.color }} /></span>
                </span>
              </div>
            ),
          )}

          {typing && (
            <div className={s.typing} aria-label="Asistentul scrie">
              <span /><span /><span />
            </div>
          )}

          {chips && (
            <div className={s.chips}>
              {chips.map((v) => (
                <button type="button" key={v} className={s.chip} onClick={() => pick(chipField[st]!, v)}>{v}</button>
              ))}
            </div>
          )}

          {st === "describe" && (
            <div className={s.card}>
              <label className={s.label}>{typeK === MOBILE ? "Ce bunuri dorești să evaluezi?" : "Ce proprietate dorești să evaluezi?"}
                <textarea
                  className={`${s.input} ${s.textarea}`}
                  value={f.describe}
                  onChange={(e) => setF((p) => ({ ...p, describe: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); describeSubmit(); } }}
                  placeholder={typeK === MOBILE ? "ex. 3 utilaje CNC și un stivuitor" : "ex. pensiune cu 12 camere"}
                  rows={3}
                  maxLength={500}
                />
              </label>
              <button type="button" className={s.primary} onClick={describeSubmit}>Continuă</button>
            </div>
          )}

          {st === "city" && (
            <div className={s.card}>
              <label className={s.label}>Localitate
                <input className={s.input} value={f.city} onChange={setField("city")} onKeyDown={(e) => e.key === "Enter" && citySubmit()} placeholder="ex. Timișoara" autoComplete="address-level2" />
              </label>
              {citySugg.length > 0 && (
                <div className={s.sugg} aria-label="Sugestii localitate">
                  {citySugg.map((c) => (
                    <button type="button" key={c} className={s.suggBtn} onClick={() => setF((p) => ({ ...p, city: c }))}>{c}</button>
                  ))}
                </div>
              )}
              <label className={s.label}><span>Adresă <span className={s.opt}>(opțional)</span></span>
                <input className={s.input} value={f.address} onChange={setField("address")} placeholder="Stradă, număr" autoComplete="street-address" />
              </label>
              <button type="button" className={s.primary} onClick={citySubmit}>Continuă</button>
            </div>
          )}

          {st === "details" && (
            <div className={s.card}>
              <div className={s.grid2}>
                {typeK !== "Teren" && (
                  <label className={s.label}>Suprafață utilă (m²)
                    <input className={s.input} inputMode="decimal" value={f.surface} onChange={setField("surface")} placeholder="ex. 72" />
                  </label>
                )}
                {(typeK === "Apartament" || typeK === "Casă") && (
                  <label className={s.label}>Camere
                    <input className={s.input} inputMode="numeric" value={f.rooms} onChange={setField("rooms")} placeholder="ex. 3" />
                  </label>
                )}
                {(typeK === "Casă" || typeK === "Teren") && (
                  <label className={s.label}>Suprafață teren (m²)
                    <input className={s.input} inputMode="decimal" value={f.land} onChange={setField("land")} placeholder="ex. 500" />
                  </label>
                )}
                {sale && (
                  <label className={s.label}><span>Preț dorit (€) <span className={s.opt}>(opțional)</span></span>
                    <input className={s.input} inputMode="numeric" value={f.price} onChange={setField("price")} placeholder="ex. 145000" />
                  </label>
                )}
              </div>
              <label className={s.label}><span>Alte detalii utile <span className={s.opt}>(opțional)</span></span>
                <input className={s.input} value={f.notes} onChange={setField("notes")} placeholder={typeK === "Teren" ? "ex. intravilan, deschidere 20 m" : typeK === "Apartament" ? "ex. etaj 3, an construcție 2015" : "ex. an construcție, stare"} />
              </label>
              <div className={s.row}>
                <button type="button" className={s.secondary} onClick={() => patchLead({ details_done: true }, "Nu știu exact", "Nicio problemă — specialistul le va clarifica la inspecție.")}>Nu știu exact</button>
                <button type="button" className={`${s.primary} ${s.grow}`} onClick={detailsSubmit}>Continuă</button>
              </div>
            </div>
          )}

          {st === "date" && (
            <div className={s.card}>
              <label className={s.label}>Data până la care ai nevoie de raport
                <input className={s.input} type="date" value={f.date} min={new Date().toISOString().slice(0, 10)} onChange={setField("date")} />
              </label>
              <button type="button" className={s.primary} onClick={() => f.date && patchLead({ deadline: "Termen specific", deadline_date: f.date }, new Date(f.date).toLocaleDateString("ro-RO"))}>Confirmă data</button>
            </div>
          )}

          {(st === "documents" || (st === "customer" && files.length > 0)) && (
            <button type="button" className={s.upload} onClick={() => fileRef.current?.click()}>↑ Încarcă documente (opțional)</button>
          )}

          {st === "contact" && (
            <div className={s.card}>
              <label className={s.label}>Nume și prenume
                <input className={s.input} value={f.name} onChange={setField("name")} autoComplete="name" />
              </label>
              <label className={s.label}>Telefon
                <input className={s.input} type="tel" value={f.phone} onChange={setField("phone")} autoComplete="tel" placeholder="07xx xxx xxx" />
              </label>
              <label className={s.label}>Email
                <input className={s.input} type="email" value={f.email} onChange={setField("email")} autoComplete="email" placeholder="nume@exemplu.ro" />
              </label>
              <label className={s.consent}>
                <input type="checkbox" checked={f.consent} onChange={setField("consent")} />
                <span>Sunt de acord ca datele să fie folosite {sale ? "pentru a fi contactat de un consultant VALUEFY" : "pentru a primi oferta"}, conform <a href="/politica-de-confidentialitate">Politicii de confidențialitate</a>.</span>
              </label>
              {contactErr && <div role="alert" className={s.err}>{contactErr}</div>}
              <button type="button" className={s.primary} onClick={contactSubmit}>Continuă spre verificare</button>
            </div>
          )}

          {st === "summary" && (
            <div className={s.summary}>
              <div className={s.summaryHead}>Verifică solicitarea</div>
              <div className={s.summaryBody}>
                <div className={s.summaryProp}>
                  <div className={s.summaryIcon}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={tObj.icon} alt="" width={24} height={24} />
                  </div>
                  <div>
                    <div className={s.caps}>{(typeK || "").toUpperCase()}</div>
                    <div className={s.summaryLine}>
                      {[lead.property_description, lead.city, lead.surface_area ? lead.surface_area + " m²" : lead.land_area ? lead.land_area + " m²" : "", lead.rooms ? lead.rooms + " camere" : ""].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                </div>
                <dl className={s.dl}>
                  {sumRows.map(([k, v]) => (
                    <div key={k}><dt>{k}</dt><dd>{v || "—"}</dd></div>
                  ))}
                </dl>
              </div>
              {editMode && (
                <div className={s.editChips}>
                  {editMap.map(([label, keys]) => (
                    <button type="button" key={label} className={s.suggBtn} onClick={() => editField(keys)}>{label}</button>
                  ))}
                </div>
              )}
              {submitErr && <div role="alert" className={`${s.err} ${s.summaryErr}`}>{submitErr}</div>}
              <div className={s.summaryActions}>
                <button type="button" className={s.secondary} onClick={() => setEditMode(!editMode)}>Modifică</button>
                <button type="button" className={`${s.primary} ${s.grow}`} onClick={submit} disabled={submitting}>{submitting ? "Se trimite…" : "Trimite solicitarea"}</button>
              </div>
            </div>
          )}

          {st === "done" && (
            <div className={s.done}>
              <div className={s.doneCheck}>✓</div>
              <div className={s.doneTitle}>Solicitarea a fost trimisă.</div>
              <p>{sale
                ? "Un consultant VALUEFY va analiza informațiile și te va contacta pentru evaluare și planul de vânzare."
                : "Un specialist VALUEFY va verifica informațiile și te va contacta pentru ofertă și pașii următori."}</p>
              <div className={s.doneId}>Număr solicitare <code>{leadId}</code></div>
              {confirmed && <p className={s.doneMail}>Ți-am trimis o confirmare pe email, la {lead.email}.</p>}
              <button type="button" className={s.secondary} onClick={() => reset()}>Solicitare nouă</button>
            </div>
          )}
        </div>

        <div className={s.composer}>
          <label className={s.composerLabel}>
            <span className="sr-only">Mesaj</span>
            <input
              ref={inputRef}
              className={s.composerInput}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask(input)}
              placeholder={aiOnline === false ? "Asistentul AI e offline — alege din opțiunile de mai sus" : "Scrie un mesaj sau pune o întrebare…"}
              maxLength={2000}
            />
          </label>
          <button type="button" className={s.attach} onClick={() => fileRef.current?.click()} aria-label="Atașează document">+</button>
          <button type="button" className={s.send} onClick={() => ask(input)} aria-label="Trimite mesajul" disabled={busy}>↑</button>
          <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={onFiles} hidden />
        </div>
      </div>
    </AssistantContext.Provider>
  );
}
