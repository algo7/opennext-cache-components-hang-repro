import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  // Read-only cache served from the assets binding: needs no KV/R2/D1.
  incrementalCache: staticAssetsIncrementalCache,
});
