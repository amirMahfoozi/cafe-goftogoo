import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const site = process.env.SITE_URL ?? "https://example.com";
const configuredBase = process.env.BASE_PATH ?? "/";
const base =
  configuredBase === "/"
    ? "/"
    : `/${configuredBase.replace(/^\/+|\/+$/g, "")}/`;

export default defineConfig({
  site,
  base,
  output: "static",
  integrations: [sitemap()],
  build: {
    assets: "assets",
  },
  vite: {
    build: {
      cssMinify: "lightningcss",
    },
  },
});
