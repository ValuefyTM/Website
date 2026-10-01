import { site, phoneHref } from "@/config/site";
import { CompanyDetails, LegalLayout, legalMetadata, type LegalSection } from "@/components/LegalLayout";
import { setLang } from "@/i18n/server";
import { localize, type Lang } from "@/i18n/lang";

// Shared by /termeni-si-conditii and /en/terms — see page.tsx in both route trees.

const PATH = "/termeni-si-conditii";
const SAL = "https://anpc.ro/ce-este-sal/";
const SOL = "https://ec.europa.eu/consumers/odr";

const META = {
  ro: {
    title: "Termeni și condiții | VALUEFY",
    h1: "Termeni și condiții",
    description:
      "Condițiile de utilizare a site-ului VALUEFY: solicitări și oferte de evaluare, rapoarte de evaluare, Portalul Imobiliar, proprietate intelectuală, răspundere și reclamații.",
  },
  en: {
    title: "Terms and conditions | VALUEFY",
    h1: "Terms and conditions",
    description:
      "Terms of use of the VALUEFY website: valuation requests and quotes, valuation reports, the Real Estate Portal, intellectual property, liability and complaints.",
  },
};

function sectionsRo(lang: Lang): LegalSection[] {
  const mail = <a href={`mailto:${site.email}`}>{site.email}</a>;
  return [
    {
      id: "despre",
      title: "Despre noi și acești termeni",
      body: (
        <>
          <p>
            Site-ul valuefy.ro este administrat de {site.legalName}, firmă de evaluare autorizată ANEVAR, cu birouri în Timișoara și Cluj-Napoca și o rețea de evaluatori colaboratori autorizați ANEVAR în toată țara.
          </p>
          <CompanyDetails lang={lang} />
          <p>Folosind site-ul, accepți acești termeni. Dacă nu ești de acord cu ei, te rugăm să nu folosești site-ul.</p>
        </>
      ),
    },
    {
      id: "utilizare",
      title: "Folosirea site-ului",
      body: (
        <>
          <p>Poți folosi site-ul pentru a te informa despre serviciile noastre, pentru a cere o ofertă de evaluare și pentru a vedea proprietățile din Portalul Imobiliar. Te rugăm:</p>
          <ul>
            <li>să ne dai informații corecte și să trimiți doar documente pe care ai dreptul să le folosești;</li>
            <li>să nu trimiți date despre alte persoane fără să ai acest drept;</li>
            <li>să nu folosești site-ul sau asistentul pentru spam, pentru a încerca să ocolești măsurile de securitate sau pentru a colecta automat conținut.</li>
          </ul>
        </>
      ),
    },
    {
      id: "informatii",
      title: "Informațiile de pe site",
      body: (
        <p>
          Textele de pe site, inclusiv răspunsurile asistentului, au caracter general și informativ. <strong>Ele nu reprezintă o evaluare și nici o opinie asupra valorii unei proprietăți.</strong> O valoare poate fi exprimată doar printr-un raport de evaluare întocmit după inspecție și analiza documentelor. Informațiile despre legislație (de exemplu despre impozitare) sunt orientative; pentru situația ta concretă îți recomandăm să consulți și un specialist (contabil, avocat, notar).
        </p>
      ),
    },
    {
      id: "oferte",
      title: "Solicitări, oferte și contract",
      body: (
        <ul>
          <li>Solicitarea trimisă prin site nu te obligă la nimic și nu înseamnă încheierea unui contract.</li>
          <li>După solicitare îți trimitem o ofertă, în care stabilim costul, termenul și documentele necesare.</li>
          <li>Oferta devine obligatorie pentru ambele părți doar după semnarea contractului de evaluare.</li>
          <li>Termenul curge de la data la care avem toate documentele și am putut face inspecția, dacă în contract nu se prevede altfel.</li>
        </ul>
      ),
    },
    {
      id: "rapoarte",
      title: "Rapoartele de evaluare",
      body: (
        <>
          <p>
            Rapoartele sunt întocmite de evaluatori autorizați ANEVAR, conform Standardelor de Evaluare a bunurilor (SEV) în vigoare. Fiecare raport are un <strong>scop declarat</strong> (de exemplu garantarea unui credit, impozitare, raportare financiară) și unul sau mai mulți <strong>destinatari</strong>.
          </p>
          <p>
            Raportul poate fi folosit doar în scopul și de destinatarii indicați în el. Folosirea în alt scop sau de alte persoane se face pe riscul celui care îl folosește, iar VALUEFY nu răspunde pentru o astfel de utilizare. Valoarea din raport este valabilă la data evaluării și în condițiile descrise în raport.
          </p>
        </>
      ),
    },
    {
      id: "portal-imobiliar",
      title: "Portalul Imobiliar",
      body: (
        <>
          <ul>
            <li>Prezentăm proprietăți de vânzare în numele clienților noștri. Informațiile din anunțuri sunt furnizate de proprietari și verificate de VALUEFY, dar au caracter descriptiv și <strong>nu reprezintă o ofertă contractuală</strong>.</li>
            <li>Prețurile și disponibilitatea proprietăților se pot schimba fără o notificare prealabilă. Condițiile finale se stabilesc direct între părți, la încheierea tranzacției.</li>
            <li><strong>„Comision 0%”</strong> înseamnă că, în calitate de cumpărător, nu plătești comision de intermediere către VALUEFY. Alte costuri ale tranzacției (de exemplu notariale, de carte funciară sau taxe) nu sunt incluse.</li>
            <li>Rapoartele de evaluare ale proprietăților listate se trimit doar după verificarea cererii. Raportul primit este confidențial: îl poți folosi doar pentru a analiza proprietatea respectivă și nu ai voie să îl distribui mai departe.</li>
          </ul>
        </>
      ),
    },
    {
      id: "proprietate-intelectuala",
      title: "Proprietate intelectuală",
      body: (
        <p>
          Conținutul site-ului (texte, logo-ul și numele VALUEFY, grafică, fotografii proprii, structura paginilor) aparține VALUEFY sau este folosit cu licență. Nu îl poți copia, modifica sau folosi în scop comercial fără acordul nostru scris. Poți distribui linkuri către pagini, inclusiv către anunțurile din Portalul Imobiliar.
        </p>
      ),
    },
    {
      id: "raspundere",
      title: "Limitarea răspunderii",
      body: (
        <>
          <p>
            Ne străduim ca site-ul să funcționeze corect și ca informațiile să fie la zi, dar nu putem garanta că site-ul va fi disponibil fără întreruperi sau că nu vor exista erori. În limitele permise de lege, VALUEFY nu răspunde pentru pierderi rezultate din folosirea informațiilor generale de pe site sau din imposibilitatea de a-l accesa.
          </p>
          <p>
            Răspunderea pentru serviciile de evaluare este cea stabilită în contractul de evaluare și de lege. Nimic din acești termeni nu limitează drepturile pe care le ai ca consumator conform legii.
          </p>
          <p>Nu răspundem pentru conținutul site-urilor externe către care există linkuri pe site.</p>
        </>
      ),
    },
    {
      id: "reclamatii",
      title: "Reclamații și soluționarea litigiilor",
      body: (
        <>
          <p>Dacă nu ești mulțumit de serviciile noastre, scrie-ne la {mail}. Analizăm fiecare reclamație și îți răspundem în cel mai scurt timp.</p>
          <p>
            Dacă ești consumator, te poți adresa și Autorității Naționale pentru Protecția Consumatorilor (ANPC) — inclusiv prin procedura de soluționare alternativă a litigiilor (<a href={SAL} rel="noopener">SAL</a>) — sau poți folosi platforma europeană de soluționare online a litigiilor (<a href={SOL} rel="noopener">SOL</a>).
          </p>
        </>
      ),
    },
    {
      id: "lege",
      title: "Legea aplicabilă și instanțe",
      body: (
        <p>
          Acești termeni sunt guvernați de legea română. Litigiile care nu se pot rezolva pe cale amiabilă sunt soluționate de instanțele competente de la sediul VALUEFY. Dacă ești consumator, te poți adresa și instanțelor prevăzute de lege pentru consumatori, inclusiv celor de la domiciliul tău.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Modificări și contact",
      body: (
        <p>
          Putem actualiza acești termeni; versiunea curentă este întotdeauna pe această pagină. Pentru întrebări ne poți scrie la {mail} sau ne poți suna la <a href={phoneHref(site.phone)}>{site.phone}</a>. Despre datele personale găsești detalii în <a href={localize(lang, "/politica-de-confidentialitate")}>Politica de confidențialitate</a>.
        </p>
      ),
    },
  ];
}

function sectionsEn(lang: Lang): LegalSection[] {
  const mail = <a href={`mailto:${site.email}`}>{site.email}</a>;
  return [
    {
      id: "despre",
      title: "About us and these terms",
      body: (
        <>
          <p>
            The valuefy.ro website is run by {site.legalName}, an ANEVAR-authorised valuation firm with offices in Timișoara and Cluj-Napoca and a network of partner ANEVAR-authorised valuers across Romania.
          </p>
          <CompanyDetails lang={lang} />
          <p>By using the website, you accept these terms. If you do not agree with them, please do not use the website.</p>
        </>
      ),
    },
    {
      id: "utilizare",
      title: "Using the website",
      body: (
        <>
          <p>You can use the website to find out about our services, to request a valuation quote and to browse the properties on the Real Estate Portal. Please:</p>
          <ul>
            <li>give us accurate information and only send documents you are entitled to use;</li>
            <li>do not send data about other people unless you are entitled to;</li>
            <li>do not use the website or the assistant for spam, to try to get around security measures or to scrape content automatically.</li>
          </ul>
        </>
      ),
    },
    {
      id: "informatii",
      title: "Information on the website",
      body: (
        <p>
          The content of the website, including the assistant&apos;s replies, is general and for information only. <strong>It is not a valuation, nor an opinion on the value of any property.</strong> A value can only be given in a valuation report prepared after an inspection and a review of the documents. Information about legislation (for example on taxation) is for guidance only; for your specific situation we recommend you also consult a professional (accountant, lawyer, notary).
        </p>
      ),
    },
    {
      id: "oferte",
      title: "Requests, quotes and contract",
      body: (
        <ul>
          <li>A request sent through the website does not commit you to anything and does not create a contract.</li>
          <li>After your request we send you a quote setting out the cost, the timeframe and the documents needed.</li>
          <li>The quote becomes binding on both parties only once the valuation contract is signed.</li>
          <li>Unless the contract says otherwise, the timeframe starts once we have all the documents and have been able to carry out the inspection.</li>
        </ul>
      ),
    },
    {
      id: "rapoarte",
      title: "Valuation reports",
      body: (
        <>
          <p>
            Reports are prepared by ANEVAR-authorised valuers in line with the Valuation Standards (SEV) in force. Each report has a <strong>stated purpose</strong> (for example secured lending, taxation, financial reporting) and one or more <strong>intended recipients</strong>.
          </p>
          <p>
            A report may only be used for the purpose and by the recipients stated in it. Any other use, or use by anyone else, is at the user&apos;s own risk, and VALUEFY accepts no liability for it. The value in the report applies at the valuation date and under the conditions described in the report.
          </p>
        </>
      ),
    },
    {
      id: "portal-imobiliar",
      title: "Real Estate Portal",
      body: (
        <ul>
          <li>We list properties for sale on behalf of our clients. The information in the listings is provided by the owners and checked by VALUEFY, but it is descriptive and <strong>is not a contractual offer</strong>.</li>
          <li>Prices and availability may change without prior notice. The final terms are agreed directly between the parties when the transaction is concluded.</li>
          <li><strong>&ldquo;0% commission&rdquo;</strong> means that, as the buyer, you pay no brokerage commission to VALUEFY. Other transaction costs (for example notary fees, land registry fees or taxes) are not included.</li>
          <li>Valuation reports for listed properties are sent only after the request has been verified. The report you receive is confidential: you may only use it to assess that property and you may not pass it on to anyone else.</li>
        </ul>
      ),
    },
    {
      id: "proprietate-intelectuala",
      title: "Intellectual property",
      body: (
        <p>
          The content of the website (text, the VALUEFY name and logo, graphics, our own photos, the structure of the pages) belongs to VALUEFY or is used under licence. You may not copy, modify or use it commercially without our written permission. You are welcome to share links to our pages, including to listings on the Real Estate Portal.
        </p>
      ),
    },
    {
      id: "raspundere",
      title: "Limitation of liability",
      body: (
        <>
          <p>
            We do our best to keep the website working properly and the information up to date, but we cannot guarantee that the website will always be available or error-free. To the extent permitted by law, VALUEFY is not liable for losses arising from the use of the general information on the website or from being unable to access it.
          </p>
          <p>
            Liability for valuation services is as set out in the valuation contract and by law. Nothing in these terms limits your statutory rights as a consumer.
          </p>
          <p>We are not responsible for the content of external websites linked from our website.</p>
        </>
      ),
    },
    {
      id: "reclamatii",
      title: "Complaints and dispute resolution",
      body: (
        <>
          <p>If you are not happy with our services, write to us at {mail}. We look into every complaint and will reply as soon as possible.</p>
          <p>
            If you are a consumer, you can also contact the Romanian National Authority for Consumer Protection (ANPC) — including through its alternative dispute resolution procedure (<a href={SAL} rel="noopener">SAL</a>) — or use the European Online Dispute Resolution platform (<a href={SOL} rel="noopener">SOL</a>).
          </p>
        </>
      ),
    },
    {
      id: "lege",
      title: "Governing law and courts",
      body: (
        <p>
          These terms are governed by Romanian law. Disputes that cannot be settled amicably will be resolved by the competent courts for VALUEFY&apos;s registered office. If you are a consumer, you may also bring proceedings in the courts provided for consumers by law, including those where you live.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Changes and contact",
      body: (
        <p>
          We may update these terms; the current version is always on this page. If you have any questions, email us at {mail} or call us on <a href={phoneHref(site.phone)}>{site.phone}</a>. You can find details about personal data in our <a href={localize(lang, "/politica-de-confidentialitate")}>Privacy policy</a>.
        </p>
      ),
    },
  ];
}

export function termsMetadata(lang: Lang) {
  const m = META[lang];
  return legalMetadata(lang, PATH, m.title, m.description);
}

export function TermsView({ lang }: { lang: Lang }) {
  setLang(lang);
  const lead =
    lang === "en"
      ? "These terms explain how you can use the valuefy.ro website and how our requests, quotes, valuation reports and the Real Estate Portal work."
      : "Acești termeni explică cum poți folosi site-ul valuefy.ro și cum funcționează solicitările, ofertele, rapoartele de evaluare și Portalul Imobiliar.";
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
