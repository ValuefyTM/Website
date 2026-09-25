// Line icons as data-URI SVGs (24×24, 1.5 stroke), matching the design.
export const svg = (d: string, stroke = "#17173A") =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`,
  );

export const ICONS = {
  apt: svg('<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h1.5M13.5 7H15M9 11h1.5M13.5 11H15M9 15h1.5M13.5 15H15M11 21v-3h2v3"/>'),
  house: svg('<path d="M3 11l9-7 9 7"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-5h4v5"/>'),
  land: svg('<path d="M3 18l5-6 4 4 3-3 6 5"/><path d="M3 21h18"/><circle cx="17" cy="7" r="2"/>'),
  shop: svg('<path d="M4 9h16l-1.5-5h-13z"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/>'),
  ind: svg('<path d="M3 21V11l5 3v-3l5 3v-3l5 3V5h3v16z"/><path d="M7 18h2M12 18h2"/>'),
  other: svg('<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/>'),
  badge: svg('<circle cx="12" cy="9" r="5"/><path d="M9 13.5L8 21l4-2 4 2-1-7.5"/>', "#C98A10"),
  std: svg('<path d="M6 3h9l3 3v15H6z"/><path d="M9 10h6M9 14h6M9 18h3"/>', "#C98A10"),
  eye: svg('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', "#C98A10"),
  lock: svg('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>', "#C98A10"),
};

export const unsplash = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;
