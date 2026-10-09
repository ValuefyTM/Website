/**
 * Service worker of the old /localizare (now on app.uvalo.ro). Phones that installed it get this version, which
 * deletes the saved copies, unregisters itself and reloads the open pages, so they follow the redirect to UVALO.
 */
const SW = `
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const ks = await caches.keys();
    await Promise.all(ks.filter((k) => k.startsWith("vf-loc-")).map((k) => caches.delete(k)));
    await self.registration.unregister();
    const cs = await self.clients.matchAll({ type: "window" });
    cs.forEach((c) => c.navigate(c.url));
  })());
});
`;

export function GET() {
  return new Response(SW, {
    headers: { "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "no-cache", "Service-Worker-Allowed": "/localizare" },
  });
}
