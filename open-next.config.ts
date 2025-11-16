import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Turso client için external dependencies
  external: [
    "@libsql/isomorphic-ws",
    "@libsql/client/web",
  ],
});

