// /localizare moved to UVALO: old links and phones with the page saved go to the account request page of app.uvalo.ro.
export const dynamic = "force-dynamic";

const TARGET = "https://app.uvalo.ro/solicita-cont";

export function GET() {
  return new Response(null, {
    status: 302,
    headers: { Location: TARGET, "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}
