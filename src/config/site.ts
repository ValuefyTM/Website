// Company contact details — editable "CMS" fields. Override via environment variables.
export const site = {
  name: "VALUEFY",
  url: "https://valuefy.ro",
  phone: process.env.NEXT_PUBLIC_PHONE || "+40 766 225 936",
  email: process.env.NEXT_PUBLIC_EMAIL || "contact@valuefy.ro",
  // ANEVAR authorization number. Hidden when empty — never invent one.
  anevarNo: process.env.NEXT_PUBLIC_ANEVAR_NO || "",
  // Legal entity (public trade register data) — shown on the legal pages.
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME || "VALUEFY S.R.L.",
  cui: process.env.NEXT_PUBLIC_CUI || "38250411",
  vatNo: process.env.NEXT_PUBLIC_VAT_NO || "RO38250411",
  regCom: process.env.NEXT_PUBLIC_REG_COM || "J35/3816/2017",
  address: process.env.NEXT_PUBLIC_ADDRESS || "Str. Bega nr. 25/4, sat Giroc, comuna Giroc, județul Timiș, cod 307220, România",
  portalUrl: process.env.NEXT_PUBLIC_PORTAL_URL || "/client",
};

export const phoneHref = (phone: string) => "tel:" + phone.replace(/\s/g, "");
