"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { site } from "@/config/site";
import {
  ASSET_TYPES, CITIES, CUSTOMERS, DEADLINES, DOCS, MOBILE, PURPOSES, SALE_PURPOSE, SALE_TYPES,
  docHelp, greeting, groupNames, groupOf, isSale, nextStep, question, typeObj, type Lead, type Step,
} from "@/lib/lead";
import { useLang } from "@/i18n/client";
import { localize, numberLocale, type Lang } from "@/i18n/lang";
import { label } from "@/i18n/labels";
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
const greetingMsg = (sale = false, lang: Lang = "ro"): Msg => ({ kind: "text", role: "assistant", text: greeting(sale, lang) });
const baseLead = (sale = false, lang: Lang = "ro"): Lead => (sale ? { request_kind: "sale", valuation_purpose: SALE_PURPOSE, lang } : { lang });

const T = {
  ro: {
    notedPurpose: (p: string) => `Am notat: evaluare pentru ${p.toLowerCase()}. `,
    whatToValue: "Ce dorești să evaluezi?",
    replyFallback: "Momentan nu pot răspunde. Poți continua solicitarea folosind opțiunile de mai jos.",
    noted: "Am notat.",
    tooBig: "Fișier prea mare — îl poți trimite după ce primești oferta",
    uploading: "Se încarcă…",
    processing: "Se procesează…",
    uploaded: "✓ Document încărcat",
    submitErr: (phone: string) => `Nu am putut trimite solicitarea. Încearcă din nou sau sună-ne la ${phone}.`,
    docsPartial: "În regulă. Poți încărca acum ce ai, iar restul le trimiți după ce primești oferta.",
    docsYes: "Excelent. Le poți încărca aici acum sau după ce primești oferta.",
    rooms: "camere",
    landSuffix: "m² teren",
    askingPriceEcho: (p: string) => "preț dorit " + p + " €",
    cont: "Continuă",
    errName: "Te rog completează numele.",
    errContact: "Adaugă un număr de telefon sau o adresă de email.",
    errEmail: "Adresa de email nu pare validă.",
    errPhone: "Numărul de telefon pare incomplet.",
    errConsent: "Este necesar acordul pentru a putea trimite oferta.",
    rDescription: "Descriere",
    rCity: "Localitate",
    rSurface: "Suprafață",
    rRequest: "Solicitare",
    saleRequest: "Vânzare prin VALUEFY",
    rAskingPrice: "Preț dorit",
    toBeSet: "De stabilit",
    rPurpose: "Scop",
    rDeadline: "Termen",
    rDocuments: "Documente",
    docsToClarify: "De clarificat",
    docsAvailable: "Disponibile",
    rClient: "Client",
    rContact: "Contact",
    rPhoneEmail: "Telefon / email",
    eProperty: "Proprietate",
    eLocation: "Localizare",
    eDetails: "Detalii",
    sellLabel: "Vinde și tu o proprietate",
    openLabel: "Deschide asistentul de evaluare",
    sell: "Vinde și tu",
    valuationAssistant: "Asistent evaluare",
    saleAssistant: "Asistent vânzare",
    requestValuation: "Solicită evaluare",
    dialogSale: "Asistent vânzare VALUEFY",
    dialogValuation: "Asistent evaluare VALUEFY",
    offlineTitle: "Asistentul AI nu este disponibil momentan. Poți folosi opțiunile ghidate.",
    checking: "Se verifică…",
    newRequest: "Solicitare nouă",
    closeAssistant: "Închide asistentul",
    requestSent: "Solicitare trimisă",
    stepOf: (a: number, b: number) => `Pasul ${a} din ${b}`,
    progressLabel: "Progresul solicitării",
    typingLabel: "Asistentul scrie",
    describeMobile: "Ce bunuri dorești să evaluezi?",
    describeProperty: "Ce proprietate dorești să evaluezi?",
    describeMobilePh: "ex. 3 utilaje CNC și un stivuitor",
    describePropertyPh: "ex. pensiune cu 12 camere",
    city: "Localitate",
    cityPh: "ex. Timișoara",
    citySugg: "Sugestii localitate",
    address: "Adresă",
    optional: "(opțional)",
    addressPh: "Stradă, număr",
    usefulArea: "Suprafață utilă (m²)",
    roomsLabel: "Camere",
    landArea: "Suprafață teren (m²)",
    askingPrice: "Preț dorit (€)",
    otherDetails: "Alte detalii utile",
    notesLandPh: "ex. intravilan, deschidere 20 m",
    notesAptPh: "ex. etaj 3, an construcție 2015",
    notesPh: "ex. an construcție, stare",
    dontKnow: "Nu știu exact",
    dontKnowReply: "Nicio problemă — specialistul le va clarifica la inspecție.",
    dateLabel: "Data până la care ai nevoie de raport",
    confirmDate: "Confirmă data",
    upload: "↑ Încarcă documente (opțional)",
    fullName: "Nume și prenume",
    phone: "Telefon",
    email: "Email",
    emailPh: "nume@exemplu.ro",
    consentPre: "Sunt de acord ca datele să fie folosite ",
    consentSale: "pentru a fi contactat de un consultant VALUEFY",
    consentOffer: "pentru a primi oferta",
    consentMid: ", conform ",
    privacy: "Politicii de confidențialitate",
    toReview: "Continuă spre verificare",
    reviewTitle: "Verifică solicitarea",
    edit: "Modifică",
    sending: "Se trimite…",
    send: "Trimite solicitarea",
    doneTitle: "Solicitarea a fost trimisă.",
    doneSale: "Un consultant VALUEFY va analiza informațiile și te va contacta pentru evaluare și planul de vânzare.",
    doneValuation: "Un specialist VALUEFY va verifica informațiile și te va contacta pentru ofertă și pașii următori.",
    requestNo: "Număr solicitare",
    confirmationSent: "Ți-am trimis o confirmare pe email, la",
    message: "Mesaj",
    composerOffline: "Asistentul AI e offline — alege din opțiunile de mai sus",
    composerPh: "Scrie un mesaj sau pune o întrebare…",
    attach: "Atașează document",
    sendMessage: "Trimite mesajul",
  },
  en: {
    notedPurpose: (p: string) => `Noted: a valuation for ${label(p, "en").toLowerCase()}. `,
    whatToValue: "What would you like to have valued?",
    replyFallback: "I can't reply right now. You can continue your request using the options below.",
    noted: "Noted.",
    tooBig: "File too large — you can send it after you receive the offer",
    uploading: "Uploading…",
    processing: "Processing…",
    uploaded: "✓ Document uploaded",
    submitErr: (phone: string) => `We couldn't send your request. Please try again or call us on ${phone}.`,
    docsPartial: "That's fine. You can upload what you have now and send the rest after you receive the offer.",
    docsYes: "Excellent. You can upload them here now or after you receive the offer.",
    rooms: "rooms",
    landSuffix: "m² land",
    askingPriceEcho: (p: string) => "asking price " + p + " €",
    cont: "Continue",
    errName: "Please enter your name.",
    errContact: "Please add a phone number or an email address.",
    errEmail: "The email address doesn't look valid.",
    errPhone: "The phone number looks incomplete.",
    errConsent: "Your consent is needed so that we can send you the offer.",
    rDescription: "Description",
    rCity: "Location",
    rSurface: "Area",
    rRequest: "Request",
    saleRequest: "Sale through VALUEFY",
    rAskingPrice: "Asking price",
    toBeSet: "To be agreed",
    rPurpose: "Purpose",
    rDeadline: "Deadline",
    rDocuments: "Documents",
    docsToClarify: "To be clarified",
    docsAvailable: "Available",
    rClient: "Client",
    rContact: "Contact",
    rPhoneEmail: "Phone / email",
    eProperty: "Property",
    eLocation: "Location",
    eDetails: "Details",
    sellLabel: "Sell your property too",
    openLabel: "Open the valuation assistant",
    sell: "Sell yours too",
    valuationAssistant: "Valuation assistant",
    saleAssistant: "Sales assistant",
    requestValuation: "Request a valuation",
    dialogSale: "VALUEFY sales assistant",
    dialogValuation: "VALUEFY valuation assistant",
    offlineTitle: "The AI assistant is unavailable at the moment. You can use the guided options.",
    checking: "Checking…",
    newRequest: "New request",
    closeAssistant: "Close the assistant",
    requestSent: "Request sent",
    stepOf: (a: number, b: number) => `Step ${a} of ${b}`,
    progressLabel: "Request progress",
    typingLabel: "The assistant is typing",
    describeMobile: "Which assets would you like to have valued?",
    describeProperty: "Which property would you like to have valued?",
    describeMobilePh: "e.g. 3 CNC machines and a forklift",
    describePropertyPh: "e.g. guesthouse with 12 rooms",
    city: "Town / city",
    cityPh: "e.g. Timișoara",
    citySugg: "Location suggestions",
    address: "Address",
    optional: "(optional)",
    addressPh: "Street, number",
    usefulArea: "Usable area (m²)",
    roomsLabel: "Rooms",
    landArea: "Land area (m²)",
    askingPrice: "Asking price (€)",
    otherDetails: "Other useful details",
    notesLandPh: "e.g. within the built-up area, 20 m frontage",
    notesAptPh: "e.g. 3rd floor, built in 2015",
    notesPh: "e.g. year built, condition",
    dontKnow: "Not sure",
    dontKnowReply: "No problem — the specialist will clarify these at the inspection.",
    dateLabel: "Date by which you need the report",
    confirmDate: "Confirm date",
    upload: "↑ Upload documents (optional)",
    fullName: "Full name",
    phone: "Phone",
    email: "Email",
    emailPh: "name@example.com",
    consentPre: "I agree that my data may be used ",
    consentSale: "so that a VALUEFY consultant can contact me",
    consentOffer: "to receive the offer",
    consentMid: ", in line with the ",
    privacy: "Privacy Policy",
    toReview: "Continue to review",
    reviewTitle: "Check your request",
    edit: "Edit",
    sending: "Sending…",
    send: "Send request",
    doneTitle: "Your request has been sent.",
    doneSale: "A VALUEFY consultant will review the information and contact you about the valuation and the sales plan.",
    doneValuation: "A VALUEFY specialist will check the information and contact you about the offer and the next steps.",
    requestNo: "Request number",
    confirmationSent: "We've sent you a confirmation email at",
    message: "Message",
    composerOffline: "The AI assistant is offline — choose from the options above",
    composerPh: "Type a message or ask a question…",
    attach: "Attach a document",
    sendMessage: "Send message",
  },
};
const fold = (v: string) => v.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

type Form = { describe: string; city: string; address: string; surface: string; rooms: string; land: string; price: string; notes: string; date: string; name: string; phone: string; email: string; consent: boolean };
const emptyForm: Form = { describe: "", city: "", address: "", surface: "", rooms: "", land: "", price: "", notes: "", date: "", name: "", phone: "", email: "", consent: false };

/** `saleCta`: on phones, the floating / sticky button reads "Vinde și tu" and starts a sale request (listing pages). */
export function AssistantProvider({ children, saleCta = false }: { children: React.ReactNode; saleCta?: boolean }) {
  const lang = useLang();
  const t = T[lang];
  const loc = numberLocale(lang);
  const isMobile = useMediaQuery("(max-width: 1079px)");
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>(() => [greetingMsg(false, lang)]);
  const [step, setStepState] = useState<Step>("type");
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [lead, setLeadState] = useState<Lead>(() => baseLead(false, lang));
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
  const leadRef = useRef<Lead>(lead);
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
        botSay(question(next, l, lang));
      }
    };
    setStep("wait");
    if (extra) botSay(extra, say);
    else say();
  }, [botSay, lang]);

  const patchLead = useCallback((patch: Lead, userText?: string, extra?: string) => {
    if (userText) push({ kind: "text", role: "user", text: userText });
    setLead({ ...leadRef.current, ...patch });
    advance(extra);
  }, [advance]);

  const reset = useCallback((sale = isSale(leadRef.current)) => {
    genRef.current++;
    setMsgs([greetingMsg(sale, lang)]);
    msgsRef.current = [greetingMsg(sale, lang)];
    setStep("type");
    stepAskedRef.current = "type";
    setLead(baseLead(sale, lang));
    setF(emptyForm);
    setLeadId("");
    setEditMode(false);
    setContactErr("");
    setSubmitErr("");
    filesRef.current = [];
    setFiles([]);
    setTyping(false);
    setBusy(false);
  }, [lang]);

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
      const pre = ctx.purpose && !ctx.type ? T[lang].notedPurpose(ctx.purpose) : "";
      const text = next === "type" ? pre + T[lang].whatToValue : (pre ? pre + "\n\n" : "") + question(next, l, lang);
      setStep(next);
      stepAskedRef.current = next;
      botSay(text);
    }
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 400);
  }, [botSay, reset, lang]);

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
    let reply = t.replyFallback;
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, step: stepRef.current, lead: leadRef.current, lang }),
      });
      if (res.ok) {
        const data = (await res.json()) as { reply?: string; fields?: Lead; ai?: boolean };
        if (gen !== genRef.current) return;
        if (data.fields && Object.keys(data.fields).length) setLead({ ...leadRef.current, ...data.fields });
        reply = (data.reply || "").trim() || t.noted;
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
        botSay(question(next, leadRef.current, lang));
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
        push({ kind: "file", id, name: file.name, ext, status: t.tooBig, pct: 100, color: "#C2362B" });
        continue;
      }
      filesRef.current = [...filesRef.current, file];
      push({ kind: "file", id, name: file.name, ext, status: t.uploading, pct: 8, color: "#C98A10" });
      setTimeout(() => upd({ pct: 70 }), 80);
      setTimeout(() => upd({ status: t.processing, pct: 90 }), 1000);
      setTimeout(() => {
        upd({ status: t.uploaded, pct: 100, color: "#1FA971" });
        setFiles([...filesRef.current]);
      }, 1900);
    }
  };

  const submit = async () => {
    setSubmitting(true);
    setSubmitErr("");
    const body = new FormData();
    body.set("lead", JSON.stringify({ ...leadRef.current, lang }));
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
      setSubmitErr(t.submitErr(site.phone));
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
  const names = groupNames(lead, lang);
  if (groupOf(step, lead)) lastGroup.current = groupOf(step, lead);
  const group = Math.min(lastGroup.current, names.length);
  const typeK = lead.property_type;
  const tObj = typeObj(typeK);

  const chipSets: Partial<Record<Step, string[]>> = { type: sale ? SALE_TYPES : ASSET_TYPES.map((t) => t.k), purpose: PURPOSES, deadline: DEADLINES, documents: DOCS, customer: CUSTOMERS };
  const chipField: Partial<Record<Step, keyof Lead>> = { type: "property_type", purpose: "valuation_purpose", deadline: "deadline", documents: "documents_status", customer: "customer_type" };
  const pick = (field: keyof Lead, v: string) => {
    // Store the Romanian value; echo what the visitor saw.
    const shown = label(v, lang);
    if (field === "deadline" && v === "Termen specific") {
      push({ kind: "text", role: "user", text: shown });
      setStep("date");
      return botSay(question("date", leadRef.current, lang));
    }
    if (field === "documents_status" && v === DOCS[2]) return patchLead({ documents_status: v }, shown, docHelp(lang));
    const extra =
      field === "documents_status"
        ? v !== "Da"
          ? t.docsPartial
          : t.docsYes
        : undefined;
    patchLead({ [field]: v }, shown, extra);
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
    const txt = [f.surface && f.surface + " m²", f.rooms && f.rooms + " " + t.rooms, f.land && f.land + " " + t.landSuffix, sale && f.price && t.askingPriceEcho(f.price), f.notes].filter(Boolean).join(" · ") || t.cont;
    patchLead(p, txt);
  };
  const contactSubmit = () => {
    const name = f.name.trim(), phone = f.phone.trim(), email = f.email.trim();
    let err = "";
    if (!name) err = t.errName;
    else if (!phone && !email) err = t.errContact;
    else if (email && !/^\S+@\S+\.\S+$/.test(email)) err = t.errEmail;
    else if (phone && phone.replace(/\D/g, "").length < 9) err = t.errPhone;
    else if (!f.consent) err = t.errConsent;
    setContactErr(err);
    if (err) return;
    patchLead({ name, ...(phone ? { phone } : {}), ...(email ? { email } : {}) }, [name, phone, email].filter(Boolean).join(" · "));
  };

  const sumRows: [string, string | undefined][] = [
    ...(lead.property_description ? ([[t.rDescription, lead.property_description]] as [string, string][]) : []),
    [t.rCity, [lead.city, lead.address].filter(Boolean).join(", ")],
    ...(typeK === MOBILE
      ? []
      : ([[t.rSurface, lead.surface_area ? lead.surface_area + " m²" : lead.land_area ? lead.land_area + " " + t.landSuffix : "—"]] as [string, string][])),
    ...(sale
      ? ([[t.rRequest, t.saleRequest], [t.rAskingPrice, lead.asking_price ? Number(lead.asking_price).toLocaleString(loc) + " €" : t.toBeSet]] as [string, string][])
      : ([
          [t.rPurpose, label(lead.valuation_purpose, lang)],
          [t.rDeadline, lead.deadline_date ? new Date(lead.deadline_date).toLocaleDateString(loc) : label(lead.deadline, lang)],
        ] as [string, string | undefined][])),
    [t.rDocuments, lead.documents_status === DOCS[2] ? t.docsToClarify : lead.documents_status === "Da" ? t.docsAvailable : label(lead.documents_status, lang)],
    [t.rClient, label(lead.customer_type, lang)],
    [t.rContact, lead.name],
    [t.rPhoneEmail, [lead.phone, lead.email].filter(Boolean).join(" · ")],
  ];
  const editMap: [string, (keyof Lead)[]][] = [
    [t.eProperty, ["property_type", "property_description", "details_done", "surface_area", "land_area", "rooms"]],
    [t.eLocation, ["city", "address"]],
    [t.eDetails, ["details_done", "surface_area", "land_area", "rooms", "asking_price"]],
    ...(sale
      ? []
      : ([
          [t.rPurpose, ["valuation_purpose"]],
          [t.rDeadline, ["deadline", "deadline_date"]],
        ] as [string, (keyof Lead)[]][])),
    [t.rDocuments, ["documents_status"]],
    [t.rClient, ["customer_type"]],
    [t.rContact, ["name", "phone", "email"]],
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
          aria-label={sellHere ? t.sellLabel : t.openLabel}
        >
          <span className={s.fabIcon}>
            {logoMark}
            <span className={s.fabDot} style={{ background: aiOnline ? "var(--green)" : "#9A9FA8" }} />
          </span>
          {sellHere ? t.sell : t.valuationAssistant}
        </button>
      )}

      {showSticky && (
        <div className={s.sticky}>
          {sellHere
            ? <button type="button" className={s.stickyCta} onClick={() => openAssistant({ sale: true })}>{t.sell}</button>
            : <button type="button" className={s.stickyCta} onClick={() => openAssistant()}>{t.requestValuation}</button>}
          <button type="button" className={s.stickyAi} onClick={() => openAssistant()} aria-label={t.valuationAssistant}>{logoMark}</button>
        </div>
      )}

      <div
        role="dialog"
        aria-modal={isMobile}
        aria-label={sale ? t.dialogSale : t.dialogValuation}
        aria-hidden={!open}
        inert={!open}
        className={`${s.drawer} ${open ? s.drawerOpen : ""}`}
      >
        <div className={s.head}>
          <div className={s.headLogo}>{logoMark}</div>
          <div className={s.headText}>
            <div className={s.headEyebrow}>VALUEFY AI</div>
            <div className={s.headTitle}>
              {sale ? t.saleAssistant : t.valuationAssistant}{" "}
              <span className={`${s.online} ${aiOnline ? "" : s.offline}`} title={aiOnline === false ? t.offlineTitle : undefined}>
                <span />{aiOnline === null ? t.checking : aiOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
          <button type="button" className={s.iconBtn} onClick={() => reset()} aria-label={t.newRequest} title={t.newRequest}>↺</button>
          <button type="button" className={`${s.iconBtn} ${s.closeBtn}`} onClick={close} aria-label={t.closeAssistant}>×</button>
        </div>

        <div className={s.progress}>
          <div className={s.progressText}>
            <span>{done ? t.requestSent : t.stepOf(group, names.length)}</span>
            <span className={s.progressName}>{names[group - 1]}</span>
          </div>
          <div role="progressbar" aria-valuemin={0} aria-valuemax={names.length} aria-valuenow={done ? names.length : group - 1} aria-label={t.progressLabel} className={s.segs}>
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
            <div className={s.typing} aria-label={t.typingLabel}>
              <span /><span /><span />
            </div>
          )}

          {chips && (
            <div className={s.chips}>
              {chips.map((v) => (
                <button type="button" key={v} className={s.chip} onClick={() => pick(chipField[st]!, v)}>{label(v, lang)}</button>
              ))}
            </div>
          )}

          {st === "describe" && (
            <div className={s.card}>
              <label className={s.label}>{typeK === MOBILE ? t.describeMobile : t.describeProperty}
                <textarea
                  className={`${s.input} ${s.textarea}`}
                  value={f.describe}
                  onChange={(e) => setF((p) => ({ ...p, describe: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); describeSubmit(); } }}
                  placeholder={typeK === MOBILE ? t.describeMobilePh : t.describePropertyPh}
                  rows={3}
                  maxLength={500}
                />
              </label>
              <button type="button" className={s.primary} onClick={describeSubmit}>{t.cont}</button>
            </div>
          )}

          {st === "city" && (
            <div className={s.card}>
              <label className={s.label}>{t.city}
                <input className={s.input} value={f.city} onChange={setField("city")} onKeyDown={(e) => e.key === "Enter" && citySubmit()} placeholder={t.cityPh} autoComplete="address-level2" />
              </label>
              {citySugg.length > 0 && (
                <div className={s.sugg} aria-label={t.citySugg}>
                  {citySugg.map((c) => (
                    <button type="button" key={c} className={s.suggBtn} onClick={() => setF((p) => ({ ...p, city: c }))}>{c}</button>
                  ))}
                </div>
              )}
              <label className={s.label}><span>{t.address} <span className={s.opt}>{t.optional}</span></span>
                <input className={s.input} value={f.address} onChange={setField("address")} placeholder={t.addressPh} autoComplete="street-address" />
              </label>
              <button type="button" className={s.primary} onClick={citySubmit}>{t.cont}</button>
            </div>
          )}

          {st === "details" && (
            <div className={s.card}>
              <div className={s.grid2}>
                {typeK !== "Teren" && (
                  <label className={s.label}>{t.usefulArea}
                    <input className={s.input} inputMode="decimal" value={f.surface} onChange={setField("surface")} placeholder="ex. 72" />
                  </label>
                )}
                {(typeK === "Apartament" || typeK === "Casă") && (
                  <label className={s.label}>{t.roomsLabel}
                    <input className={s.input} inputMode="numeric" value={f.rooms} onChange={setField("rooms")} placeholder="ex. 3" />
                  </label>
                )}
                {(typeK === "Casă" || typeK === "Teren") && (
                  <label className={s.label}>{t.landArea}
                    <input className={s.input} inputMode="decimal" value={f.land} onChange={setField("land")} placeholder="ex. 500" />
                  </label>
                )}
                {sale && (
                  <label className={s.label}><span>{t.askingPrice} <span className={s.opt}>{t.optional}</span></span>
                    <input className={s.input} inputMode="numeric" value={f.price} onChange={setField("price")} placeholder="ex. 145000" />
                  </label>
                )}
              </div>
              <label className={s.label}><span>{t.otherDetails} <span className={s.opt}>{t.optional}</span></span>
                <input className={s.input} value={f.notes} onChange={setField("notes")} placeholder={typeK === "Teren" ? t.notesLandPh : typeK === "Apartament" ? t.notesAptPh : t.notesPh} />
              </label>
              <div className={s.row}>
                <button type="button" className={s.secondary} onClick={() => patchLead({ details_done: true }, t.dontKnow, t.dontKnowReply)}>{t.dontKnow}</button>
                <button type="button" className={`${s.primary} ${s.grow}`} onClick={detailsSubmit}>{t.cont}</button>
              </div>
            </div>
          )}

          {st === "date" && (
            <div className={s.card}>
              <label className={s.label}>{t.dateLabel}
                <input className={s.input} type="date" value={f.date} min={new Date().toISOString().slice(0, 10)} onChange={setField("date")} />
              </label>
              <button type="button" className={s.primary} onClick={() => f.date && patchLead({ deadline: "Termen specific", deadline_date: f.date }, new Date(f.date).toLocaleDateString(loc))}>{t.confirmDate}</button>
            </div>
          )}

          {(st === "documents" || (st === "customer" && files.length > 0)) && (
            <button type="button" className={s.upload} onClick={() => fileRef.current?.click()}>{t.upload}</button>
          )}

          {st === "contact" && (
            <div className={s.card}>
              <label className={s.label}>{t.fullName}
                <input className={s.input} value={f.name} onChange={setField("name")} autoComplete="name" />
              </label>
              <label className={s.label}>{t.phone}
                <input className={s.input} type="tel" value={f.phone} onChange={setField("phone")} autoComplete="tel" placeholder="07xx xxx xxx" />
              </label>
              <label className={s.label}>{t.email}
                <input className={s.input} type="email" value={f.email} onChange={setField("email")} autoComplete="email" placeholder={t.emailPh} />
              </label>
              <label className={s.consent}>
                <input type="checkbox" checked={f.consent} onChange={setField("consent")} />
                <span>{t.consentPre}{sale ? t.consentSale : t.consentOffer}{t.consentMid}<a href={localize(lang, "/politica-de-confidentialitate")}>{t.privacy}</a>.</span>
              </label>
              {contactErr && <div role="alert" className={s.err}>{contactErr}</div>}
              <button type="button" className={s.primary} onClick={contactSubmit}>{t.toReview}</button>
            </div>
          )}

          {st === "summary" && (
            <div className={s.summary}>
              <div className={s.summaryHead}>{t.reviewTitle}</div>
              <div className={s.summaryBody}>
                <div className={s.summaryProp}>
                  <div className={s.summaryIcon}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={tObj.icon} alt="" width={24} height={24} />
                  </div>
                  <div>
                    <div className={s.caps}>{label(typeK, lang).toUpperCase()}</div>
                    <div className={s.summaryLine}>
                      {[lead.property_description, lead.city, lead.surface_area ? lead.surface_area + " m²" : lead.land_area ? lead.land_area + " m²" : "", lead.rooms ? lead.rooms + " " + t.rooms : ""].filter(Boolean).join(" · ")}
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
                  {editMap.map(([name, keys]) => (
                    <button type="button" key={name} className={s.suggBtn} onClick={() => editField(keys)}>{name}</button>
                  ))}
                </div>
              )}
              {submitErr && <div role="alert" className={`${s.err} ${s.summaryErr}`}>{submitErr}</div>}
              <div className={s.summaryActions}>
                <button type="button" className={s.secondary} onClick={() => setEditMode(!editMode)}>{t.edit}</button>
                <button type="button" className={`${s.primary} ${s.grow}`} onClick={submit} disabled={submitting}>{submitting ? t.sending : t.send}</button>
              </div>
            </div>
          )}

          {st === "done" && (
            <div className={s.done}>
              <div className={s.doneCheck}>✓</div>
              <div className={s.doneTitle}>{t.doneTitle}</div>
              <p>{sale ? t.doneSale : t.doneValuation}</p>
              <div className={s.doneId}>{t.requestNo} <code>{leadId}</code></div>
              {confirmed && <p className={s.doneMail}>{t.confirmationSent} {lead.email}.</p>}
              <button type="button" className={s.secondary} onClick={() => reset()}>{t.newRequest}</button>
            </div>
          )}
        </div>

        <div className={s.composer}>
          <label className={s.composerLabel}>
            <span className="sr-only">{t.message}</span>
            <input
              ref={inputRef}
              className={s.composerInput}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask(input)}
              placeholder={aiOnline === false ? t.composerOffline : t.composerPh}
              maxLength={2000}
            />
          </label>
          <button type="button" className={s.attach} onClick={() => fileRef.current?.click()} aria-label={t.attach}>+</button>
          <button type="button" className={s.send} onClick={() => ask(input)} aria-label={t.sendMessage} disabled={busy}>↑</button>
          <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={onFiles} hidden />
        </div>
      </div>
    </AssistantContext.Provider>
  );
}
