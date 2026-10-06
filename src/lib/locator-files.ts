// Server-only: the cadastral search page and its data live in the worker's static assets under /_localizare/,
// which only the worker can read (wrangler.jsonc: run_worker_first), so they are served after the password check.
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function locatorAsset(path: string, req: Request) {
  const { env } = await getCloudflareContext({ async: true });
  const assets = (env as { ASSETS?: { fetch: (r: Request) => Promise<Response> } }).ASSETS;
  if (!assets) return null;
  const res = await assets.fetch(new Request(new URL(`/_localizare/${path}`, req.url), { headers: { "Accept-Encoding": req.headers.get("accept-encoding") ?? "" } }));
  return res.ok ? res : null;
}
