// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  output: "server",
  adapter: vercel(),
  site: "https://devint.cl",
  compressHTML: true,
  build: {
    inlineStylesheets: "auto",
  },
});
