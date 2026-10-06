import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// The site is fully prerendered (no ISR/revalidation), so pages are served from Workers static assets —
// no R2/KV bucket needed.
const config = defineCloudflareConfig({
	incrementalCache: staticAssetsIncrementalCache,
	enableCacheInterception: true,
});

// The only paths sent to the worker first (wrangler.jsonc run_worker_first) are /_localizare/*: the cadastral data,
// which must NOT be served as plain static files. The default resolver would serve them from ASSETS; this one never
// does, so they 404 and are only read by /api/localizare/data after the password check.
config.middleware = {
	...config.middleware!,
	assetResolver: () => ({ name: "no-direct-assets", maybeGetAssetResult: async () => undefined }),
};

export default config;
