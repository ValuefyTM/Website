// Property listings (properties VALUEFY sells on behalf of clients).
// DEMO DATA for the preview — replace with real listings (later: from the D1 database / CRM).
import { unsplash } from "./icons";

export type Listing = {
  slug: string;
  title: string;
  type: "Apartament" | "Casă" | "Teren" | "Spațiu comercial" | "Hală / industrial";
  city: string;
  zone: string;
  price: number; // EUR
  surface?: number; // usable m²
  land?: number; // land m²
  rooms?: number;
  baths?: number;
  floor?: string;
  year?: number;
  status?: "Nou" | "Rezervat" | "Preț redus";
  features: string[];
  description: string[];
  photos: string[];
};

const p = (id: string, w = 1200) => unsplash(id, w);

export const LISTINGS: Listing[] = [
  {
    slug: "apartament-3-camere-complex-studentesc-timisoara",
    title: "Apartament 3 camere, renovat, zona Complex Studențesc",
    type: "Apartament",
    city: "Timișoara",
    zone: "Complex Studențesc",
    price: 142000,
    surface: 72,
    rooms: 3,
    baths: 2,
    floor: "3 din 4",
    year: 1985,
    status: "Nou",
    features: ["Renovat complet", "Centrală proprie", "2 balcoane", "Loc de parcare", "Aproape de parc"],
    description: [
      "Apartament luminos, renovat complet, cu living, două dormitoare și două băi, într-un bloc cu fațadă reabilitată.",
      "Zonă liniștită, cu acces rapid la centru, universități, magazine și transport în comun.",
    ],
    photos: [p("photo-1545324418-cc1a3fa10c00"), p("photo-1560448204-e02f11c3d0e2"), p("photo-1554224155-6726b3ff858f")],
  },
  {
    slug: "casa-individuala-dumbravita",
    title: "Casă individuală P+1, teren 500 m², Dumbrăvița",
    type: "Casă",
    city: "Dumbrăvița",
    zone: "Zona Lidl",
    price: 289000,
    surface: 165,
    land: 500,
    rooms: 5,
    baths: 3,
    year: 2019,
    features: ["Încălzire în pardoseală", "Pompă de căldură", "Garaj", "Grădină amenajată", "Terasă acoperită"],
    description: [
      "Casă modernă, construită în 2019, cu parter deschis (living, bucătărie, dining) și patru dormitoare la etaj.",
      "Curte amenajată, garaj și sisteme eficiente energetic. Acces rapid spre Timișoara.",
    ],
    photos: [p("photo-1600596542815-ffad4c1539a9"), p("photo-1564013799919-ab600027ffc6"), p("photo-1512917774080-9991f1c4c750")],
  },
  {
    slug: "teren-intravilan-giroc",
    title: "Teren intravilan 1.200 m², deschidere 24 m, Giroc",
    type: "Teren",
    city: "Giroc",
    zone: "Zona rezidențială nouă",
    price: 96000,
    land: 1200,
    status: "Preț redus",
    features: ["Intravilan", "Utilități la limită", "Deschidere 24 m", "Acces din asfalt"],
    description: [
      "Teren plan, potrivit pentru o casă sau un duplex, într-o zonă rezidențială în dezvoltare.",
      "Utilitățile sunt la limita proprietății. Certificatul de urbanism poate fi pus la dispoziție la cerere.",
    ],
    photos: [p("photo-1500382017468-9049fed747ef")],
  },
  {
    slug: "spatiu-comercial-centru-timisoara",
    title: "Spațiu comercial stradal 110 m², ultracentral",
    type: "Spațiu comercial",
    city: "Timișoara",
    zone: "Centru",
    price: 235000,
    surface: 110,
    year: 1930,
    features: ["Vitrină stradală", "Trafic pietonal ridicat", "Grup sanitar", "Potrivit retail sau birou"],
    description: [
      "Spațiu comercial la parterul unei clădiri istorice, cu vitrină spre o stradă pietonală.",
      "Potrivit pentru retail, showroom sau birou cu front de stradă.",
    ],
    photos: [p("photo-1441986300917-64674bd600d8"), p("photo-1497366216548-37526070297c")],
  },
  {
    slug: "hala-logistica-ghiroda",
    title: "Hală logistică 1.800 m² cu birouri, Ghiroda",
    type: "Hală / industrial",
    city: "Ghiroda",
    zone: "Parc industrial",
    price: 1150000,
    surface: 1800,
    land: 4500,
    year: 2016,
    status: "Rezervat",
    features: ["Înălțime utilă 10 m", "2 rampe de încărcare", "Birouri 200 m²", "Acces TIR", "Platformă betonată"],
    description: [
      "Hală logistică cu birouri, rampe de încărcare și platformă betonată, într-un parc industrial cu acces rapid la centură.",
      "Potrivită pentru depozitare, distribuție sau producție ușoară.",
    ],
    photos: [p("photo-1586528116311-ad8dd3c8310d")],
  },
  {
    slug: "apartament-2-camere-cluj-napoca",
    title: "Apartament 2 camere, bloc nou, Cluj-Napoca",
    type: "Apartament",
    city: "Cluj-Napoca",
    zone: "Bună Ziua",
    price: 158000,
    surface: 54,
    rooms: 2,
    baths: 1,
    floor: "2 din 6",
    year: 2022,
    features: ["Bloc nou", "Parcare subterană", "Terasă 12 m²", "Lift"],
    description: [
      "Apartament în bloc nou, cu living și bucătărie deschisă, dormitor și terasă generoasă.",
      "Parcare subterană inclusă. Zonă rezidențială cu magazine și școli în apropiere.",
    ],
    photos: [p("photo-1486406146926-c627a92ad1ab"), p("photo-1560448204-e02f11c3d0e2")],
  },
];

export const findListing = (slug: string) => LISTINGS.find((l) => l.slug === slug);

export const formatEur = (n: number) => new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 0 }).format(n) + " €";

export const pricePerSqm = (l: Listing) => {
  const area = l.surface ?? l.land;
  return area ? Math.round(l.price / area) : undefined;
};
