import { site } from "@/config/site";
import { CompanyDetails, LegalLayout, LegalTable, legalMetadata, type LegalSection } from "@/components/LegalLayout";
import { setLang } from "@/i18n/server";
import { localize, type Lang } from "@/i18n/lang";

// Shared by /politica-cookies and /en/cookie-policy — see page.tsx in both route trees.

const PATH = "/politica-cookies";

const META = {
  ro: {
    title: "Politica cookies | VALUEFY",
    h1: "Politica cookies",
    description:
      "Ce cookie-uri și ce stocare locală folosește site-ul VALUEFY: doar elemente strict necesare, fără cookie-uri de publicitate sau de analiză.",
  },
  en: {
    title: "Cookie policy | VALUEFY",
    h1: "Cookie policy",
    description:
      "Which cookies and local storage the VALUEFY website uses: strictly necessary items only, with no advertising or analytics cookies.",
  },
};

function sectionsRo(lang: Lang): LegalSection[] {
  return [
    {
      id: "pe-scurt",
      title: "Pe scurt",
      body: (
        <>
          <p>
            Site-ul valuefy.ro <strong>nu folosește cookie-uri de publicitate sau de analiză</strong> (statistici de trafic) și nu te urmărește pe alte site-uri. Folosim doar câteva elemente strict necesare pentru funcționarea și securitatea site-ului.
          </p>
          <CompanyDetails lang={lang} />
        </>
      ),
    },
    {
      id: "ce-sunt",
      title: "Ce sunt cookie-urile",
      body: (
        <p>
          Cookie-urile sunt fișiere mici pe care un site le salvează în browserul tău. Asemănătoare sunt și elementele de stocare locală (de exemplu <code>sessionStorage</code>), care păstrează informații în browser, fără să fie trimise automat către server.
        </p>
      ),
    },
    {
      id: "ce-folosim",
      title: "Ce folosim",
      body: (
        <>
          <LegalTable
            head={["Nume", "Tip și furnizor", "Pentru ce", "Durată"]}
            rows={[
              [<code key="a">vf_admin</code>, "Cookie strict necesar, VALUEFY (httpOnly)", "Păstrează sesiunea de autentificare în zona de administrare. Este setat doar pentru echipa VALUEFY, nu pentru vizitatori.", "7 zile"],
              [<code key="b">vf_ai_status</code>, "sessionStorage, VALUEFY", "Reține dacă asistentul de pe site este disponibil, ca să nu verificăm la fiecare pagină. Nu conține date personale.", "5 minute, doar în fila curentă"],
              [<><code>__cf_bm</code> și cookie-uri similare de securitate</>,"Cookie strict necesar, Cloudflare", "Protecția site-ului împotriva roboților și a atacurilor.", "Aproximativ 30 de minute"],
            ]}
          />
          <p>Cloudflare, furnizorul nostru de găzduire, poate seta și alte cookie-uri tehnice de securitate atunci când detectează trafic suspect. Acestea nu sunt folosite pentru publicitate sau pentru a-ți crea un profil.</p>
        </>
      ),
    },
    {
      id: "acord",
      title: "De ce nu îți cerem acordul",
      body: (
        <p>
          Legea (Directiva ePrivacy, transpusă prin Legea nr. 506/2004) nu cere acordul pentru cookie-urile și stocarea strict necesare funcționării unui serviciu pe care l-ai solicitat. Pentru că folosim doar astfel de elemente, nu afișăm un banner de acord. Dacă vom adăuga vreodată instrumente de analiză sau alte cookie-uri care nu sunt strict necesare, vom actualiza această politică și îți vom cere acordul înainte de a le activa.
        </p>
      ),
    },
    {
      id: "linkuri-externe",
      title: "Linkuri către alte site-uri",
      body: (
        <p>
          Pe site există linkuri către servicii externe, de exemplu WhatsApp, Facebook sau LinkedIn (pentru a distribui un anunț). Aceste servicii pot seta propriile cookie-uri doar dacă urmezi linkul și ajungi pe site-ul lor, conform politicilor lor. Noi nu încărcăm scripturi sau butoane de la aceste rețele pe paginile noastre. Unele fotografii ilustrative pot fi încărcate direct de pe serverele Unsplash (images.unsplash.com); în acest caz, browserul tău trimite către Unsplash datele tehnice obișnuite ale unei cereri, cum ar fi adresa IP.
        </p>
      ),
    },
    {
      id: "control",
      title: "Cum poți controla cookie-urile",
      body: (
        <p>
          Poți șterge sau bloca cookie-urile din setările browserului. Dacă blochezi cookie-urile de securitate Cloudflare, este posibil ca unele pagini sau formulare să nu funcționeze corect. Datele din <code>sessionStorage</code> se șterg automat când închizi fila.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Contact și alte informații",
      body: (
        <p>
          Pentru întrebări ne poți scrie la <a href={`mailto:${site.email}`}>{site.email}</a>. Despre modul în care folosim datele personale găsești detalii în <a href={localize(lang, "/politica-de-confidentialitate")}>Politica de confidențialitate</a>.
        </p>
      ),
    },
  ];
}

function sectionsEn(lang: Lang): LegalSection[] {
  return [
    {
      id: "pe-scurt",
      title: "In short",
      body: (
        <>
          <p>
            The valuefy.ro website <strong>does not use advertising or analytics cookies</strong> (traffic statistics) and does not track you on other websites. We only use a few items that are strictly necessary for the website to work and stay secure.
          </p>
          <CompanyDetails lang={lang} />
        </>
      ),
    },
    {
      id: "ce-sunt",
      title: "What cookies are",
      body: (
        <p>
          Cookies are small files that a website saves in your browser. Local storage (for example <code>sessionStorage</code>) is similar: it keeps information in your browser, without sending it to the server automatically.
        </p>
      ),
    },
    {
      id: "ce-folosim",
      title: "What we use",
      body: (
        <>
          <LegalTable
            head={["Name", "Type and provider", "Purpose", "Duration"]}
            rows={[
              [<code key="a">vf_admin</code>, "Strictly necessary cookie, VALUEFY (httpOnly)", "Keeps the sign-in session for the admin area. It is only set for the VALUEFY team, not for visitors.", "7 days"],
              [<code key="b">vf_ai_status</code>, "sessionStorage, VALUEFY", "Remembers whether the website assistant is available, so we don't check on every page. It contains no personal data.", "5 minutes, current tab only"],
              [<><code>__cf_bm</code> and similar security cookies</>, "Strictly necessary cookie, Cloudflare", "Protects the website against bots and attacks.", "About 30 minutes"],
            ]}
          />
          <p>Cloudflare, our hosting provider, may also set other technical security cookies when it detects suspicious traffic. They are not used for advertising or to build a profile of you.</p>
        </>
      ),
    },
    {
      id: "acord",
      title: "Why we don't ask for your consent",
      body: (
        <p>
          The law (the ePrivacy Directive, implemented in Romania by Law no. 506/2004) does not require consent for cookies and storage that are strictly necessary to provide a service you have asked for. Because we only use such items, we do not show a consent banner. If we ever add analytics tools or other cookies that are not strictly necessary, we will update this policy and ask for your consent before turning them on.
        </p>
      ),
    },
    {
      id: "linkuri-externe",
      title: "Links to other websites",
      body: (
        <p>
          The website contains links to external services, for example WhatsApp, Facebook or LinkedIn (to share a listing). These services may set their own cookies only if you follow the link and land on their website, under their own policies. We do not load scripts or buttons from these networks on our pages. Some illustrative photos may be loaded directly from Unsplash&apos;s servers (images.unsplash.com); in that case your browser sends Unsplash the usual technical data of a request, such as your IP address.
        </p>
      ),
    },
    {
      id: "control",
      title: "How you can control cookies",
      body: (
        <p>
          You can delete or block cookies in your browser settings. If you block Cloudflare&apos;s security cookies, some pages or forms may not work properly. Data in <code>sessionStorage</code> is deleted automatically when you close the tab.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Contact and further information",
      body: (
        <p>
          If you have any questions, write to us at <a href={`mailto:${site.email}`}>{site.email}</a>. You can find details of how we use personal data in our <a href={localize(lang, "/politica-de-confidentialitate")}>Privacy policy</a>.
        </p>
      ),
    },
  ];
}

export function cookiesMetadata(lang: Lang) {
  const m = META[lang];
  return legalMetadata(lang, PATH, m.title, m.description);
}

export function CookiesView({ lang }: { lang: Lang }) {
  setLang(lang);
  const lead =
    lang === "en"
      ? "This policy explains which cookies and similar technologies the valuefy.ro website uses, and why."
      : "Această politică explică ce cookie-uri și tehnologii similare folosește site-ul valuefy.ro și de ce.";
  return (
    <LegalLayout
      lang={lang}
      roPath={PATH}
      title={META[lang].h1}
      lead={lead}
      sections={lang === "en" ? sectionsEn(lang) : sectionsRo(lang)}
    />
  );
}
