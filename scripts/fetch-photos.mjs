// Runs before `next build` (npm "prebuild"): copies the Unsplash photos used in the code into
// public/photos/u/ so the site serves them itself. Writes src/lib/local-photos.json with what it got;
// photos that couldn't be downloaded keep loading from Unsplash.
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const OUT = join(ROOT, "public/photos/u");
const MANIFEST = join(ROOT, "src/lib/local-photos.json");
const SIZES = [800, 1600]; // ≤ 900 px requests use the 800 version, larger ones the 1600 version

async function sources(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await sources(p)));
    else if (/\.(tsx?|mjs)$/.test(e.name)) out.push(p);
  }
  return out;
}

const ids = new Set();
for (const f of await sources(join(ROOT, "src"))) {
  for (const m of (await readFile(f, "utf8")).matchAll(/["'](photo-\d{10,}-[0-9a-f]{6,})["']/g)) ids.add(m[1]);
}

await mkdir(OUT, { recursive: true });
const ok = [];
await Promise.all(
  [...ids].map(async (id) => {
    let all = true;
    for (const w of SIZES) {
      const file = join(OUT, `${id}-${w}.jpg`);
      if (await stat(file).then((s) => s.size > 1000, () => false)) continue;
      try {
        const res = await fetch(`https://images.unsplash.com/${id}?fm=jpg&fit=crop&w=${w}&q=72`, { signal: AbortSignal.timeout(20000) });
        if (!res.ok) throw new Error(String(res.status));
        await writeFile(file, Buffer.from(await res.arrayBuffer()));
      } catch (e) {
        all = false;
        console.warn(`[photos] ${id} @${w}: ${e.message} — will load from Unsplash`);
      }
    }
    if (all) ok.push(id);
  }),
);
ok.sort();
await writeFile(MANIFEST, JSON.stringify(ok, null, 2) + "\n");
console.log(`[photos] ${ok.length}/${ids.size} photos served from the site`);
