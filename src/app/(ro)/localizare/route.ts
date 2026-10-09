// /localizare moved to UVALO: old links and phones with the page saved go to the start page of app.uvalo.ro.
export const dynamic = "force-dynamic";

const TARGET = "https://app.uvalo.ro/";

export function GET() {
  return new Response(null, {
    status: 301,
    headers: { Location: TARGET, "Cache-Control": "public, max-age=3600", "X-Robots-Tag": "noindex, nofollow" },
  });
}
