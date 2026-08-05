import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import sharp from "sharp";

const input = new URL(
  "../src/assets/brand/cafe-goftogoo-logo-original.png",
  import.meta.url,
);
const outputDirectory = new URL("../public/images/brand/", import.meta.url);

await mkdir(dirname(new URL("logo-512.webp", outputDirectory).pathname), {
  recursive: true,
});

for (const width of [256, 512]) {
  const pipeline = sharp(input.pathname)
    .rotate()
    .resize(width, width, { fit: "cover", position: "center" });

  await pipeline
    .clone()
    .webp({ quality: 86, effort: 5 })
    .toFile(new URL(`logo-${width}.webp`, outputDirectory).pathname);
  await pipeline
    .clone()
    .avif({ quality: 64, effort: 5 })
    .toFile(new URL(`logo-${width}.avif`, outputDirectory).pathname);
}

for (const [name, width] of [
  ["favicon.png", 64],
  ["apple-touch-icon.png", 180],
  ["icon-192.png", 192],
  ["icon-512.png", 512],
]) {
  await sharp(input.pathname)
    .rotate()
    .resize(width, width, { fit: "cover", position: "center" })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(new URL(`../public/${name}`, import.meta.url).pathname);
}

process.stdout.write("Optimized brand logo assets.\n");
