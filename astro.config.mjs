// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    platformProxy: { enabled: true },
    imageService: "cloudflare",
  }),
  vite: { plugins: [tailwindcss()] },
  output: "server",
  integrations: [react()],
});
