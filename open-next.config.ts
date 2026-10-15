import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No incremental cache: the site doesn't use ISR or revalidation.
export default defineCloudflareConfig();
