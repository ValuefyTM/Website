// /localizare moved to UVALO (app.uvalo.ro): old links and phones with the page saved go to the same page there.
export const dynamic = "force-dynamic";

const TARGET = "https://app.uvalo.ro/localizare";

export function GET(req: Request) {
  return new Response(null, {
    status: 301,
    headers: { Location: TARGET + new URL(req.url).search, "Cache-Control": "public, max-age=3600", "X-Robots-Tag": "noindex, nofollow" },
  });
}
