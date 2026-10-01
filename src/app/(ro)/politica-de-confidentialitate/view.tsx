import { site } from "@/config/site";
import { CompanyDetails, LegalLayout, LegalTable, legalMetadata, type LegalSection } from "@/components/LegalLayout";
import { setLang } from "@/i18n/server";
import { localize, type Lang } from "@/i18n/lang";

// Shared by /politica-de-confidentialitate and /en/privacy-policy — see page.tsx in both route trees.

const PATH = "/politica-de-confidentialitate";

const META = {
  ro: {
    title: "Politica de confidențialitate | VALUEFY",
    h1: "Politica de confidențialitate",
    description:
      "Cum folosește VALUEFY datele personale primite prin site: solicitări de evaluare, asistentul online, Portalul Imobiliar, furnizori, durata păstrării și drepturile tale conform GDPR.",
  },
  en: {
    title: "Privacy policy | VALUEFY",
    h1: "Privacy policy",
    description:
      "How VALUEFY uses the personal data received through its website: valuation requests, the online assistant, the Real Estate Portal, service providers, retention periods and your rights under the GDPR.",
  },
};

const ANSPDCP = "https://www.dataprotection.ro";

function sectionsRo(lang: Lang): LegalSection[] {
  const mail = <a href={`mailto:${site.email}`}>{site.email}</a>;
  return [
    {
      id: "cine-suntem",
      title: "Cine suntem",
      body: (
        <>
          <p>
            Operatorul datelor tale personale este {site.legalName}, firmă de evaluare autorizată ANEVAR. Avem birouri în Timișoara și Cluj-Napoca și lucrăm cu o rețea de evaluatori colaboratori autorizați ANEVAR în toată țara.
          </p>
          <CompanyDetails lang={lang} />
          <p>Pentru orice întrebare despre datele tale ne poți scrie la {mail}.</p>
        </>
      ),
    },
    {
      id: "ce-date",
      title: "Ce date colectăm",
      body: (
        <>
          <p>Colectăm doar datele pe care ni le dai tu, prin site sau direct, și câteva date tehnice necesare funcționării site-ului.</p>
          <h3>Solicitări de evaluare sau de vânzare (asistentul de pe site)</h3>
          <ul>
            <li>despre proprietate: tipul, descrierea, localitatea, adresa, suprafețele, numărul de camere, iar pentru vânzare prețul cerut;</li>
            <li>despre lucrare: scopul evaluării, termenul dorit, ce documente ai disponibile;</li>
            <li>despre tine: tipul de client (persoană fizică sau companie), numele, telefonul și emailul;</li>
            <li>documentele pe care alegi să le încarci (de exemplu extras de carte funciară, acte de proprietate, planuri), cu o limită totală de 4 MB;</li>
            <li>mesajele pe care le scrii în asistent.</li>
          </ul>
          <h3>Portalul Imobiliar</h3>
          <ul>
            <li>cererile de vizionare: nume, telefon, opțional email, mesaj și proprietatea care te interesează;</li>
            <li>cererile pentru raportul de evaluare al unei proprietăți: nume, email, telefon, motivul cererii, mesaj și acceptarea condițiilor de confidențialitate a raportului.</li>
          </ul>
          <h3>Când ne contactezi direct</h3>
          <p>Dacă ne scrii pe email sau ne suni, folosim datele din mesaj sau din convorbire pentru a-ți răspunde.</p>
          <h3>Date tehnice</h3>
          <p>
            Ca orice site, serverele care îl găzduiesc primesc automat date tehnice precum adresa IP, tipul de browser și paginile accesate. Le folosim doar pentru funcționarea și securitatea site-ului. Unele fotografii ilustrative se încarcă de pe serverele Unsplash, care primesc astfel aceleași date tehnice. Despre cookie-uri găsești detalii în <a href={localize(lang, "/politica-cookies")}>Politica cookies</a>.
          </p>
          <h3>Portalul client</h3>
          <p>Portalul client nu este încă activ, deci nu creăm și nu gestionăm conturi de utilizator. Când îl vom lansa, vom actualiza această politică.</p>
          <p>Te rugăm să nu ne trimiți date care nu sunt necesare pentru solicitare, în special date sensibile (de exemplu despre sănătate) sau copii ale actelor de identitate, dacă nu ți le cerem explicit.</p>
        </>
      ),
    },
    {
      id: "scopuri",
      title: "De ce folosim datele și pe ce temei",
      body: (
        <LegalTable
          head={["Scop", "Temei legal (GDPR)"]}
          rows={[
            ["Să răspundem solicitării tale și să îți trimitem oferta (cost, termen, documente necesare)", "Demersuri înainte de încheierea unui contract, la cererea ta — art. 6 alin. (1) lit. (b)"],
            ["Să efectuăm evaluarea și să îți livrăm raportul, după semnarea contractului", "Executarea contractului — art. 6 alin. (1) lit. (b)"],
            ["Să organizăm vizionări și să îți transmitem rapoartele cerute în Portalul Imobiliar", "Demersuri la cererea ta — art. 6 alin. (1) lit. (b) — și acordul pe care îl dai în formular — art. 6 alin. (1) lit. (a)"],
            ["Evidența contabilă și fiscală, arhivarea dosarelor de evaluare conform standardelor profesionale ANEVAR", "Obligații legale — art. 6 alin. (1) lit. (c)"],
            ["Securitatea site-ului, prevenirea abuzurilor și a spamului, apărarea în caz de litigii", "Interesul nostru legitim — art. 6 alin. (1) lit. (f)"],
          ]}
        />
      ),
    },
    {
      id: "asistent",
      title: "Asistentul de pe site și inteligența artificială",
      body: (
        <>
          <p>
            Mesajele pe care le scrii în asistentul de pe site sunt procesate de un model de inteligență artificială (Claude, furnizat de Anthropic prin API) ca să înțeleagă ce proprietate ai și ce ai nevoie, să completeze câmpurile solicitării și să îți răspundă. Datele solicitării pot fi folosite și pentru un scurt rezumat intern al cererii.
          </p>
          <p>
            Anthropic acționează ca împuternicit al nostru: prelucrează datele doar pentru a ne furniza acest serviciu. Asistentul nu ia decizii în locul nostru — oferta și evaluarea sunt făcute de oameni din echipa VALUEFY. Dacă preferi să nu folosești asistentul, ne poți scrie direct la {mail}.
          </p>
        </>
      ),
    },
    {
      id: "destinatari",
      title: "Cui transmitem datele",
      body: (
        <>
          <p>Nu vindem și nu închiriem datele tale. Le transmitem doar cât este necesar:</p>
          <ul>
            <li><strong>Cloudflare</strong> — găzduirea site-ului, baza de date și rețeaua de distribuție (rețea globală);</li>
            <li><strong>Resend</strong> (SUA) — trimiterea emailurilor: notificarea către birou și confirmarea către tine;</li>
            <li><strong>Anthropic</strong> (SUA) — modelul de inteligență artificială din asistent;</li>
            <li><strong>evaluatorii colaboratori autorizați ANEVAR</strong>, atunci când lucrarea se face în zona lor, doar cu datele necesare lucrării;</li>
            <li>beneficiarul raportului indicat de tine (de exemplu banca), conform contractului;</li>
            <li>autorități publice sau instanțe, doar când legea ne obligă.</li>
          </ul>
          <p>Furnizorii de servicii (Cloudflare, Resend, Anthropic) acționează ca împuterniciți și prelucrează datele doar conform instrucțiunilor noastre.</p>
        </>
      ),
    },
    {
      id: "transferuri",
      title: "Transferuri în afara Spațiului Economic European",
      body: (
        <p>
          Unii furnizori (Anthropic, Resend, Cloudflare) pot prelucra date în Statele Unite sau în alte țări din afara SEE. În aceste cazuri, transferul se face cu garanții adecvate prevăzute de GDPR, cum ar fi Clauzele contractuale standard aprobate de Comisia Europeană sau, după caz, cadrul UE–SUA privind confidențialitatea datelor. Ne poți cere mai multe informații despre aceste garanții la {mail}.
        </p>
      ),
    },
    {
      id: "durata",
      title: "Cât timp păstrăm datele",
      body: (
        <ul>
          <li><strong>Solicitările care nu devin contracte</strong> (inclusiv cererile de vizionare și de raport): până la 2 ani de la ultima comunicare, apoi le ștergem.</li>
          <li><strong>Contractele, rapoartele de evaluare și dosarele de lucru</strong>: pe perioada prevăzută de standardele profesionale și de legislația aplicabilă.</li>
          <li><strong>Documentele contabile</strong> (de exemplu facturile): 10 ani, conform legislației contabile.</li>
          <li><strong>Datele tehnice</strong>: pe perioade scurte, stabilite de furnizorul de găzduire pentru securitate.</li>
        </ul>
      ),
    },
    {
      id: "drepturi",
      title: "Drepturile tale",
      body: (
        <>
          <p>Conform GDPR, ai dreptul:</p>
          <ul>
            <li>să afli ce date avem despre tine și să primești o copie (dreptul de acces);</li>
            <li>să ceri corectarea datelor greșite (rectificare);</li>
            <li>să ceri ștergerea datelor, când nu mai avem un motiv legal să le păstrăm;</li>
            <li>să ceri restricționarea prelucrării;</li>
            <li>să primești datele într-un format structurat, ca să le transmiți altcuiva (portabilitate);</li>
            <li>să te opui prelucrării bazate pe interesul nostru legitim;</li>
            <li>să îți retragi oricând acordul, fără să fie afectată prelucrarea făcută înainte de retragere.</li>
          </ul>
          <p>
            Pentru a-ți exercita drepturile, scrie-ne la {mail}. Îți răspundem în cel mult o lună. Putem să îți cerem informații suplimentare ca să confirmăm că cererea vine de la tine.
          </p>
          <p>
            Ai și dreptul să depui o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP), B-dul G-ral. Gheorghe Magheru 28-30, București, <a href={ANSPDCP} rel="noopener">www.dataprotection.ro</a>.
          </p>
        </>
      ),
    },
    {
      id: "ce-nu-facem",
      title: "Ce nu facem",
      body: (
        <ul>
          <li>Nu luăm decizii bazate exclusiv pe prelucrare automată care să producă efecte juridice asupra ta.</li>
          <li>Nu vindem datele tale.</li>
          <li>Nu îți trimitem emailuri de marketing. Primești doar mesaje legate de solicitarea ta.</li>
          <li>Nu folosim cookie-uri de publicitate sau de analiză pe site.</li>
        </ul>
      ),
    },
    {
      id: "securitate",
      title: "Securitate",
      body: (
        <p>
          Folosim conexiuni criptate (HTTPS), acces restricționat la datele solicitărilor și furnizori cu măsuri de securitate recunoscute. Niciun sistem nu este însă complet sigur, așa că îți recomandăm să ne trimiți doar documentele necesare lucrării.
        </p>
      ),
    },
    {
      id: "modificari",
      title: "Modificări ale politicii",
      body: (
        <p>
          Putem actualiza această politică atunci când se schimbă serviciile noastre sau legislația. Versiunea curentă este întotdeauna pe această pagină, cu data ultimei actualizări.
        </p>
      ),
    },
  ];
}

function sectionsEn(lang: Lang): LegalSection[] {
  const mail = <a href={`mailto:${site.email}`}>{site.email}</a>;
  return [
    {
      id: "cine-suntem",
      title: "Who we are",
      body: (
        <>
          <p>
            The controller of your personal data is {site.legalName}, an ANEVAR-authorised valuation firm. We have offices in Timișoara and Cluj-Napoca and work with a network of partner ANEVAR-authorised valuers across Romania.
          </p>
          <CompanyDetails lang={lang} />
          <p>If you have any question about your data, write to us at {mail}.</p>
        </>
      ),
    },
    {
      id: "ce-date",
      title: "What data we collect",
      body: (
        <>
          <p>We only collect the data you give us, through the website or directly, plus some technical data needed for the website to work.</p>
          <h3>Valuation or sale requests (the assistant on our website)</h3>
          <ul>
            <li>about the property: type, description, town or city, address, areas, number of rooms and, for a sale, the asking price;</li>
            <li>about the job: the purpose of the valuation, the deadline you need, which documents you have;</li>
            <li>about you: customer type (individual or company), name, phone number and email;</li>
            <li>any documents you choose to upload (for example a land registry extract, title deeds, plans), up to 4 MB in total;</li>
            <li>the messages you type into the assistant.</li>
          </ul>
          <h3>Real Estate Portal</h3>
          <ul>
            <li>viewing requests: name, phone number, optionally email, your message and the property you are interested in;</li>
            <li>requests for a property&apos;s valuation report: name, email, phone number, the reason for the request, your message and your acceptance of the report&apos;s confidentiality terms.</li>
          </ul>
          <h3>When you contact us directly</h3>
          <p>If you email or call us, we use the data in your message or call to reply to you.</p>
          <h3>Technical data</h3>
          <p>
            As with any website, the servers hosting it automatically receive technical data such as your IP address, browser type and the pages you visit. We use it only to run and secure the website. Some illustrative photos are loaded from Unsplash&apos;s servers, which therefore receive the same technical data. You can find details about cookies in our <a href={localize(lang, "/politica-cookies")}>Cookie policy</a>.
          </p>
          <h3>Client portal</h3>
          <p>The client portal is not active yet, so we do not create or manage user accounts. We will update this policy when it launches.</p>
          <p>Please do not send us data that is not needed for your request, especially sensitive data (for example about health) or copies of identity documents, unless we specifically ask for them.</p>
        </>
      ),
    },
    {
      id: "scopuri",
      title: "Why we use your data and on what legal basis",
      body: (
        <LegalTable
          head={["Purpose", "Legal basis (GDPR)"]}
          rows={[
            ["To answer your request and send you a quote (cost, timeframe, documents needed)", "Steps taken at your request before entering into a contract — Art. 6(1)(b)"],
            ["To carry out the valuation and deliver your report, once the contract is signed", "Performance of a contract — Art. 6(1)(b)"],
            ["To arrange viewings and send you the reports requested on the Real Estate Portal", "Steps taken at your request — Art. 6(1)(b) — and the consent you give in the form — Art. 6(1)(a)"],
            ["Accounting and tax records, and archiving valuation files under ANEVAR professional standards", "Legal obligations — Art. 6(1)(c)"],
            ["Website security, preventing abuse and spam, defending legal claims", "Our legitimate interests — Art. 6(1)(f)"],
          ]}
        />
      ),
    },
    {
      id: "asistent",
      title: "The website assistant and artificial intelligence",
      body: (
        <>
          <p>
            The messages you type into the assistant on our website are processed by an artificial intelligence model (Claude, provided by Anthropic through its API) so that it can understand your property and what you need, fill in the fields of your request and reply to you. The request data may also be used for a short internal summary of the request.
          </p>
          <p>
            Anthropic acts as our processor: it processes the data only to provide this service to us. The assistant does not make decisions on our behalf — quotes and valuations are prepared by people in the VALUEFY team. If you prefer not to use the assistant, you can email us directly at {mail}.
          </p>
        </>
      ),
    },
    {
      id: "destinatari",
      title: "Who we share your data with",
      body: (
        <>
          <p>We do not sell or rent out your data. We share it only as far as necessary:</p>
          <ul>
            <li><strong>Cloudflare</strong> — website hosting, database and content delivery (global network);</li>
            <li><strong>Resend</strong> (USA) — sending emails: the notification to our office and the confirmation to you;</li>
            <li><strong>Anthropic</strong> (USA) — the artificial intelligence model behind the assistant;</li>
            <li><strong>partner ANEVAR-authorised valuers</strong>, when the job is carried out in their area, with only the data needed for the job;</li>
            <li>the recipient of the report you name (for example a bank), under the contract;</li>
            <li>public authorities or courts, only where the law requires us to.</li>
          </ul>
          <p>Our service providers (Cloudflare, Resend, Anthropic) act as processors and process the data only on our instructions.</p>
        </>
      ),
    },
    {
      id: "transferuri",
      title: "Transfers outside the European Economic Area",
      body: (
        <p>
          Some providers (Anthropic, Resend, Cloudflare) may process data in the United States or in other countries outside the EEA. In these cases the transfer relies on appropriate safeguards under the GDPR, such as the Standard Contractual Clauses approved by the European Commission or, where applicable, the EU–US Data Privacy Framework. You can ask us for more information about these safeguards at {mail}.
        </p>
      ),
    },
    {
      id: "durata",
      title: "How long we keep your data",
      body: (
        <ul>
          <li><strong>Requests that do not become contracts</strong> (including viewing and report requests): up to 2 years from our last contact, after which we delete them.</li>
          <li><strong>Contracts, valuation reports and working files</strong>: for the period required by professional standards and applicable law.</li>
          <li><strong>Accounting documents</strong> (for example invoices): 10 years, as required by accounting law.</li>
          <li><strong>Technical data</strong>: for short periods set by our hosting provider for security purposes.</li>
        </ul>
      ),
    },
    {
      id: "drepturi",
      title: "Your rights",
      body: (
        <>
          <p>Under the GDPR, you have the right:</p>
          <ul>
            <li>to know what data we hold about you and to receive a copy (right of access);</li>
            <li>to have inaccurate data corrected (rectification);</li>
            <li>to have your data erased when we no longer have a legal reason to keep it;</li>
            <li>to ask us to restrict processing;</li>
            <li>to receive your data in a structured format so you can pass it on to someone else (portability);</li>
            <li>to object to processing based on our legitimate interests;</li>
            <li>to withdraw your consent at any time, without affecting processing carried out before you withdrew it.</li>
          </ul>
          <p>
            To exercise your rights, email us at {mail}. We will reply within one month. We may ask you for additional information to confirm that the request comes from you.
          </p>
          <p>
            You also have the right to lodge a complaint with the Romanian data protection authority, ANSPDCP (Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal), B-dul G-ral. Gheorghe Magheru 28-30, Bucharest, <a href={ANSPDCP} rel="noopener">www.dataprotection.ro</a>.
          </p>
        </>
      ),
    },
    {
      id: "ce-nu-facem",
      title: "What we don't do",
      body: (
        <ul>
          <li>We do not make decisions based solely on automated processing that have legal effects on you.</li>
          <li>We do not sell your data.</li>
          <li>We do not send you marketing emails. You only receive messages about your request.</li>
          <li>We do not use advertising or analytics cookies on the website.</li>
        </ul>
      ),
    },
    {
      id: "securitate",
      title: "Security",
      body: (
        <p>
          We use encrypted connections (HTTPS), restricted access to request data and providers with recognised security measures. No system is completely secure, however, so we recommend you only send us the documents needed for the job.
        </p>
      ),
    },
    {
      id: "modificari",
      title: "Changes to this policy",
      body: (
        <p>
          We may update this policy when our services or the law change. The current version is always on this page, with the date of the last update.
        </p>
      ),
    },
  ];
}

export function privacyMetadata(lang: Lang) {
  const m = META[lang];
  return legalMetadata(lang, PATH, m.title, m.description);
}

export function PrivacyView({ lang }: { lang: Lang }) {
  setLang(lang);
  const lead =
    lang === "en"
      ? "This policy explains, in plain terms, what personal data we receive through valuefy.ro, why we use it, who we share it with and what rights you have."
      : "Această politică explică, pe scurt și clar, ce date personale primim prin valuefy.ro, de ce le folosim, cui le transmitem și ce drepturi ai.";
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
