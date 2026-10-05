// Display labels for values that are stored in Romanian (database, emails, CRM).
// The stored value never changes with the language — only what visitors see does.
import type { Lang } from "./lang";

const EN: Record<string, string> = {
  // Asset / property types
  Apartament: "Apartment",
  "Casă": "House",
  Teren: "Land",
  "Spațiu comercial": "Commercial space",
  "Hală / industrial": "Warehouse / industrial",
  "Altă proprietate": "Other property",
  "Bunuri mobile": "Movable assets",
  // Valuation purposes
  "Credit bancar": "Bank loan",
  "Vânzare / cumpărare": "Sale / purchase",
  Impozitare: "Taxation",
  "Raportare financiară": "Financial reporting",
  "Succesiune / partaj": "Inheritance / division",
  "Expertiză / litigiu": "Expert report / litigation",
  "Garanție eșalonare ANAF": "Collateral for ANAF instalment plan",
  "Alt scop": "Other purpose",
  "Vânzare prin VALUEFY": "Sale through VALUEFY",
  // Deadlines
  Standard: "Standard",
  Urgent: "Urgent",
  "Termen specific": "Specific date",
  // Documents
  Da: "Yes",
  "Parțial": "Partly",
  "Nu știu ce documente sunt necesare": "I don't know which documents are needed",
  // Customer type
  "Persoană fizică": "Individual",
  Companie: "Company",
  // Listing labels
  Nou: "New",
  Rezervat: "Reserved",
  "Preț redus": "Price reduced",
};

/** Visitor-facing label for a stored Romanian value. Unknown values are returned unchanged. */
export const label = (value: string | undefined | null, lang: Lang): string => {
  if (!value) return "";
  return lang === "en" ? EN[value] ?? value : value;
};
