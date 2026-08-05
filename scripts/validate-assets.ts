import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { menuCategories, menuItems } from "../src/data/menu.ts";
import { assertValidMenu } from "../src/utils/menuValidation.ts";

const projectRoot = join(fileURLToPath(new URL("..", import.meta.url)));
const publicRoot = join(projectRoot, "public");

assertValidMenu(menuItems, menuCategories);

const requiredPublicAssets = [
  ...menuItems.map((item) => item.image),
  "/images/menu/fallback.svg",
  "/images/menu/image-manifest.json",
  "/images/menu/photo-sources.json",
  "/images/brand/logo-256.webp",
  "/images/brand/logo-512.webp",
  "/images/brand/logo-256.avif",
  "/images/brand/logo-512.avif",
  ...menuCategories.map((category) => `/icons/categories/${category.icon}.svg`),
  "/icons/OpenMoji-LICENSE.txt",
  "/images/cafe/interior-hero-640.webp",
  "/images/cafe/interior-hero-960.webp",
  "/images/cafe/interior-hero-1280.webp",
  "/images/cafe/interior-hero-640.avif",
  "/images/cafe/interior-hero-960.avif",
  "/images/cafe/interior-hero-1280.avif",
  "/images/cafe/interior-counter-640.webp",
  "/images/cafe/interior-counter-960.webp",
  "/images/cafe/interior-counter-640.avif",
  "/images/cafe/interior-counter-960.avif",
  "/fonts/estedad-variable.woff2",
  "/fonts/vazirmatn-variable.woff2",
  "/fonts/OFL-Estedad.txt",
  "/fonts/OFL-Vazirmatn.txt",
  "/favicon.png",
  "/apple-touch-icon.png",
  "/icon-192.png",
  "/icon-512.png",
  "/robots.txt",
];

const missingAssets = requiredPublicAssets.filter(
  (asset) => !existsSync(join(publicRoot, asset.replace(/^\//, ""))),
);

if (missingAssets.length > 0) {
  throw new Error(
    `Missing required local assets:\n${missingAssets.join("\n")}`,
  );
}

console.log(
  `Validated ${menuItems.length} menu items, unique IDs, price sources, and local assets.`,
);
