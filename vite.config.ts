import { defineConfig } from "vite";

export default defineConfig({
  server: { port: 8080, host: true },
  // Serve everything in /public as-is; .jsx files are loaded via in-browser Babel.
  publicDir: "public",
});
