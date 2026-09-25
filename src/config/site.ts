// Company contact details — editable "CMS" fields. Override via environment variables.
export const site = {
  name: "VALUEFY",
  url: "https://valuefy.ro",
  phone: process.env.NEXT_PUBLIC_PHONE || "+40 766 225 936",
  email: process.env.NEXT_PUBLIC_EMAIL || "contact@valuefy.ro",
  // ANEVAR authorization number. Hidden when empty — never invent one.
  anevarNo: process.env.NEXT_PUBLIC_ANEVAR_NO || "",
  portalUrl: process.env.NEXT_PUBLIC_PORTAL_URL || "/client",
};

export const phoneHref = (phone: string) => "tel:" + phone.replace(/\s/g, "");
