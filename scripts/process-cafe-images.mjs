import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = join(projectRoot, "src/assets/cafe");
const outputRoot = join(projectRoot, "public/images/cafe");

await mkdir(outputRoot, { recursive: true });

const jobs = [
  {
    source: join(sourceRoot, "interior-hero-original.jpg"),
    prefix: "interior-hero",
    position: "centre",
    sizes: [
      { width: 640, height: 280 },
      { width: 960, height: 420 },
      { width: 1280, height: 560 },
    ],
  },
  {
    source: join(sourceRoot, "interior-counter-original.jpg"),
    prefix: "interior-counter",
    position: "centre",
    sizes: [
      { width: 640, height: 360 },
      { width: 960, height: 540 },
    ],
  },
];

for (const job of jobs) {
  for (const size of job.sizes) {
    const pipeline = sharp(job.source)
      .rotate()
      .resize(size.width, size.height, {
        fit: "cover",
        position: job.position,
        withoutEnlargement: true,
      });

    await Promise.all([
      pipeline
        .clone()
        .webp({ quality: 82, effort: 5, smartSubsample: true })
        .toFile(join(outputRoot, `${job.prefix}-${size.width}.webp`)),
      pipeline
        .clone()
        .avif({ quality: 52, effort: 5, chromaSubsampling: "4:2:0" })
        .toFile(join(outputRoot, `${job.prefix}-${size.width}.avif`)),
    ]);
  }
}

console.log("Optimized café photographs to responsive WebP and AVIF variants.");
