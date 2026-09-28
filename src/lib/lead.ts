// Lead model shared by the assistant UI and the API routes.
import { ICONS } from "./icons";

export const TYPES = [
  { k: "Apartament", g: "apartamentului", icon: ICONS.apt, img: "photo-1545324418-cc1a3fa10c00" },
  { k: "Casă", g: "casei", icon: ICONS.house, img: "photo-1600596542815-ffad4c1539a9" },
  { k: "Teren", g: "terenului", icon: ICONS.land, img: "photo-1500382017468-9049fed747ef" },
  { k: "Spațiu comercial", g: "spațiului comercial", icon: ICONS.shop, img: "photo-1441986300917-64674bd600d8" },
  { k: "Hală / industrial", g: "halei / proprietății industriale", icon: ICONS.ind, img: "photo-1586528116311-ad8dd3c8310d" },
  { k: "Altă proprietate", g: "proprietății", icon: ICONS.other, img: "photo-1486406146926-c627a92ad1ab" },
] as const;

/** Movable assets — offered in the assistant, not as a property card. */
export const MOBILE = "Bunuri mobile";
export const ASSET_TYPES = [
  ...TYPES,
  { k: MOBILE, g: "bunurilor mobile", icon: ICONS.mobile, img: "" },
] as const;
/** Types where we ask the visitor to describe what they want valued. */
export const NEEDS_DESCRIPTION = ["Altă proprietate", MOBILE];

export const PURPOSES = [
  "Credit bancar",
  "Vânzare / cumpărare",
  "Impozitare",
  "Raportare financiară",
  "Succesiune / partaj",
  "Expertiză / litigiu",
  "Alt scop",
];
/** Set (hidden) when the visitor wants to sell a property through VALUEFY instead of ordering a valuation. */
export const SALE_PURPOSE = "Vânzare prin VALUEFY";
export const isSale = (l: Lead) => l.request_kind === "sale";
/** Property types offered when selling — movable assets are valuation-only. */
export const SALE_TYPES = TYPES.map((t) => t.k);

export const DEADLINES = ["Standard", "Urgent", "Termen specific"];
export const DOCS = ["Da", "Parțial", "Nu știu ce documente sunt necesare"];
export const CUSTOMERS = ["Persoană fizică", "Companie"];
export const CITIES = ["Timișoara", "Dumbrăvița", "Giroc", "Chișoda", "Moșnița Nouă", "Ghiroda", "Sânandrei", "Săcălaz", "Remetea Mare", "Lugoj", "Jimbolia", "Buziaș", "Făget", "Deta", "Sânnicolau Mare", "Arad", "Reșița", "Caransebeș", "Deva", "Hunedoara", "Oradea", "Cluj-Napoca", "București", "Sibiu", "Brașov", "Craiova", "Iași", "Constanța"];

export type Lead = {
  request_kind?: "sale"; // undefined = valuation request
  asking_price?: string; // sale only, EUR
  property_type?: string;
  property_description?: string;
  city?: string;
  address?: string;
  surface_area?: string;
  land_area?: string;
  rooms?: string;
  details_done?: boolean;
  valuation_purpose?: string;
  deadline?: string;
  deadline_date?: string;
  documents_status?: string;
  customer_type?: string;
  name?: string;
  phone?: string;
  email?: string;
  notes?: string;
};

// Fields the AI may fill from free text.
export const LEAD_TEXT_FIELDS = ["property_type", "property_description", "city", "address", "surface_area", "land_area", "rooms", "asking_price", "valuation_purpose", "deadline", "documents_status", "customer_type", "name", "phone", "email", "notes"] as const;
export const LEAD_ENUMS: Partial<Record<(typeof LEAD_TEXT_FIELDS)[number], readonly string[]>> = {
  property_type: ASSET_TYPES.map((t) => t.k),
  valuation_purpose: PURPOSES,
  documents_status: DOCS,
  customer_type: CUSTOMERS,
};

export type Step = "type" | "describe" | "city" | "details" | "purpose" | "deadline" | "date" | "documents" | "customer" | "contact" | "summary" | "done" | "wait";

export const GROUPS: Record<string, number> = { type: 1, describe: 1, city: 2, details: 3, purpose: 4, deadline: 4, date: 4, documents: 5, customer: 6, contact: 6, summary: 6, done: 6 };
export const GROUP_NAMES = ["Proprietate", "Localizare", "Detalii", "Scop și termen", "Documente", "Contact"];
// Selling skips "Scop și termen".
const SALE_GROUPS: Record<string, number> = { type: 1, describe: 1, city: 2, details: 3, documents: 4, customer: 5, contact: 5, summary: 5, done: 5 };
const SALE_GROUP_NAMES = ["Proprietate", "Localizare", "Detalii", "Documente", "Contact"];
export const groupOf = (step: Step, l: Lead) => (isSale(l) ? SALE_GROUPS : GROUPS)[step];
export const groupNames = (l: Lead) => (isSale(l) ? SALE_GROUP_NAMES : GROUP_NAMES);

export const DOC_HELP =
  "De regulă sunt necesare:\n• extras de carte funciară (recent)\n• actul de proprietate\n• documentația cadastrală / releveul\n• autorizația de construire, dacă e cazul\n\nLista exactă depinde de proprietate și de scop — specialistul ți-o confirmă în ofertă. Le poți trimite și ulterior.";

export const SALE_GREETING = "Bună! 👋\n\nVrei să vinzi o proprietate? Te ajutăm cu evaluarea, prezentarea și găsirea cumpărătorului — cu documentele verificate și un preț argumentat.\n\nCe proprietate vrei să vinzi?";

export const GREETING = "Bună! 👋\n\nTe pot ajuta să afli ce presupune evaluarea proprietății sau a bunurilor tale și să soliciți o ofertă.\n\nCe dorești să evaluezi?";

export const typeObj = (k?: string) => ASSET_TYPES.find((t) => t.k === k) || ASSET_TYPES[5];

export function nextStep(l: Lead): Step {
  if (!l.property_type) return "type";
  if (NEEDS_DESCRIPTION.includes(l.property_type) && !l.property_description) return "describe";
  if (!l.city) return "city";
  if (l.property_type !== MOBILE && !l.details_done && !l.surface_area && !l.land_area) return "details";
  if (!l.valuation_purpose) return "purpose";
  if (!isSale(l) && !l.deadline) return "deadline";
  if (!l.documents_status) return "documents";
  if (!l.customer_type) return "customer";
  if (!l.name || !(l.phone || l.email)) return "contact";
  return "summary";
}

export function question(step: Step, l: Lead): string {
  const t = typeObj(l.property_type);
  const mobile = l.property_type === MOBILE;
  if (isSale(l)) {
    const sq: Partial<Record<Step, string>> = {
      type: "Ce proprietate vrei să vinzi?",
      describe: "Ce proprietate vrei să vinzi? Descrie-o pe scurt — de exemplu clădire de birouri, pensiune sau teren cu construcții.",
      city: "Perfect. În ce localitate se află proprietatea pe care vrei să o vinzi?",
      details: `Câteva detalii despre ${l.property_type === "Altă proprietate" ? "proprietate" : t.k.toLowerCase()} ne ajută să pregătim estimarea prețului și planul de vânzare.`,
      documents: "Ai documentele proprietății disponibile (extras de carte funciară, act de proprietate, cadastru)?",
      customer: "Proprietatea este deținută de o persoană fizică sau de o companie?",
      contact: "Aproape gata. Ca un consultant VALUEFY să te contacteze pentru evaluare și planul de vânzare, am nevoie de datele tale de contact. Le folosim doar pentru această solicitare.",
      summary: "Mulțumesc! Verifică te rog datele de mai jos înainte de trimitere.",
    };
    return sq[step] || "";
  }
  const q: Partial<Record<Step, string>> = {
    type: "Ce dorești să evaluezi?",
    describe: mobile
      ? "Ce bunuri mobile dorești să evaluezi? Descrie-le pe scurt — de exemplu utilaje de producție, echipamente, autovehicule sau mijloace fixe."
      : "Ce proprietate dorești să evaluezi? Descrie-o pe scurt — de exemplu clădire de birouri, pensiune, stație de carburant sau teren cu construcții.",
    city: mobile
      ? `Perfect. Te ajut să obții o ofertă pentru evaluarea ${t.g}. În ce localitate se află bunurile?`
      : `Perfect. Te ajut să obții o ofertă pentru evaluarea ${t.g}. În ce localitate se află proprietatea?`,
    details: `Câteva detalii despre ${l.property_type === "Altă proprietate" ? "proprietate" : t.k.toLowerCase()} ne ajută să estimăm corect oferta.`,
    purpose: "Pentru ce ai nevoie de evaluare?",
    deadline: "Când ai nevoie de raport?",
    date: "Alege data până la care ai nevoie de raport.",
    documents: mobile ? "Ai documentele bunurilor disponibile (facturi, fișe tehnice, evidența mijloacelor fixe)?" : "Ai documentele proprietății disponibile?",
    customer: "Solicitarea este pentru o persoană fizică sau pentru o companie?",
    contact: "Aproape gata. Ca un specialist VALUEFY să îți trimită oferta cu costul, termenul și lista de documente, am nevoie de datele tale de contact. Le folosim doar pentru această solicitare.",
    summary: "Mulțumesc! Verifică te rog datele de mai jos înainte de trimitere.",
  };
  return q[step] || "";
}

// Internal prioritisation — never shown to visitors.
export function priority(l: Lead): "URGENT" | "PRIORITY" | "NORMAL" {
  if (/urgent/i.test(l.deadline || "")) return "URGENT";
  if (l.deadline_date) {
    const days = (new Date(l.deadline_date).getTime() - Date.now()) / 864e5;
    if (days < 7) return "URGENT";
  }
  let s = 0;
  if (["Spațiu comercial", "Hală / industrial"].includes(l.property_type || "")) s++;
  if (["Credit bancar", "Expertiză / litigiu", "Raportare financiară"].includes(l.valuation_purpose || "")) s++;
  if (l.customer_type === "Companie") s++;
  if (l.documents_status === "Da") s++;
  return s >= 2 ? "PRIORITY" : "NORMAL";
}

export function fallbackSummary(l: Lead): string {
  const t = typeObj(l.property_type);
  if (isSale(l)) {
    const size = l.surface_area ? ` de ${l.surface_area} m²` : l.land_area ? ` de ${l.land_area} m² teren` : "";
    const price = l.asking_price ? ` Preț dorit: ${l.asking_price} €.` : "";
    return `Client (${(l.customer_type || "").toLowerCase()}) vrea să vândă ${t.k.toLowerCase()}${l.property_description ? ` (${l.property_description})` : ""}${size} din ${l.city} prin VALUEFY.${price} Documente: ${(l.documents_status || "").toLowerCase()}.`;
  }
  const what = l.property_description ? ` (${l.property_description})` : "";
  const size = l.surface_area ? ` de ${l.surface_area} m²` : l.land_area ? ` de ${l.land_area} m² teren` : "";
  return `Client (${(l.customer_type || "").toLowerCase()}) solicită evaluarea ${t.g}${what}${size} din ${l.city} pentru ${(l.valuation_purpose || "").toLowerCase()}. Documente: ${(l.documents_status || "").toLowerCase()}. Termen: ${(l.deadline_date ? new Date(l.deadline_date).toLocaleDateString("ro-RO") : l.deadline || "").toLowerCase()}.`;
}

const num = (v?: string) => {
  if (!v) return null;
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : v;
};

// CRM-ready record (brief §16).
export function buildRecord(l: Lead, opts: { id: string; summary: string; documents: string[] }) {
  return {
    lead_id: opts.id,
    created_at: new Date().toISOString(),
    source: isSale(l) ? "WEBSITE_AI_SALE" : "WEBSITE_AI",
    request_type: isSale(l) ? "SALE" : "VALUATION",
    property_type: l.property_type || null,
    property_description: l.property_description || null,
    city: l.city || null,
    address: l.address || null,
    surface_area: num(l.surface_area),
    land_area: num(l.land_area),
    rooms: num(l.rooms),
    asking_price: num(l.asking_price),
    valuation_purpose: l.valuation_purpose || null,
    deadline: l.deadline_date || l.deadline || null,
    customer_type: l.customer_type || null,
    documents_status: l.documents_status || null,
    documents: opts.documents,
    name: l.name || null,
    phone: l.phone || null,
    email: l.email || null,
    notes: l.notes || null,
    conversation_summary: opts.summary,
    lead_status: "NEW",
    priority: priority(l),
  };
}
export type LeadRecord = ReturnType<typeof buildRecord>;
