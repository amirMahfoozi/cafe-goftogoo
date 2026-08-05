import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import sharp from "sharp";

const projectRoot = new URL("../", import.meta.url);
const outputRoot = new URL("../public/", import.meta.url);

const photoSources = [
  ["espresso-single", "images/menu/coffee/espresso-single.webp", 29255517],
  ["espresso-double", "images/menu/coffee/espresso-double.webp", 38415014],
  ["americano", "images/menu/coffee/americano.webp", 28921766],
  ["latte", "images/menu/coffee/latte.webp", 32938771],
  ["cappuccino", "images/menu/coffee/cappuccino.webp", 30777670],
  ["mocha", "images/menu/coffee/mocha.webp", 6006668],
  ["caramel-macchiato", "images/menu/coffee/caramel-macchiato.webp", 17557497],
  ["hot-chocolate", "images/menu/coffee/hot-chocolate.webp", 36010235],
  ["masala", "images/menu/coffee/masala.webp", 32711258],
  ["karak", "images/menu/coffee/karak.webp", 20282353],
  ["pistachio-latte", "images/menu/coffee/pistachio-latte.webp", 30313264],
  ["affogato", "images/menu/coffee/affogato.webp", 9442600],
  ["greek-coffee", "images/menu/coffee/greek-coffee.webp", 34217414],
  ["turkish-coffee", "images/menu/coffee/turkish-coffee.webp", 11292688],
  ["french-coffee", "images/menu/coffee/french-coffee.webp", 2748538],
  ["hot-nutella", "images/menu/coffee/hot-nutella.webp", 18863076],
  ["matcha", "images/menu/coffee/matcha.webp", 17719788],
  ["scrambled-eggs", "images/menu/breakfast/scrambled-eggs.webp", 32695309],
  ["iced-latte", "images/menu/cold/iced-latte.webp", 34264494],
  ["iced-mocha", "images/menu/cold/iced-mocha.webp", 31320841],
  [
    "iced-caramel-macchiato",
    "images/menu/cold/iced-caramel-macchiato.webp",
    34969154,
  ],
  ["iced-coffee", "images/menu/cold/iced-coffee.webp", 38519286],
  ["iced-americano", "images/menu/cold/iced-americano.webp", 35755395],
  ["nutella-shake", "images/menu/cold/nutella-shake.webp", 1562465],
  ["super-berry-shake", "images/menu/cold/super-berry-shake.webp", 8805100],
  ["peanut-bar-shake", "images/menu/cold/peanut-bar-shake.webp", 12974366],
  ["lotus-shake", "images/menu/cold/lotus-shake.webp", 17034200],
  ["crunch-shake", "images/menu/cold/crunch-shake.webp", 16825489],
  ["extra-syrup-shot", "images/menu/cold/extra-syrup-shot.webp", 8468608],
  ["brewed-tea", "images/menu/tea/brewed-tea.webp", 30509105],
  ["hibiscus-tea", "images/menu/tea/hibiscus-tea.webp", 220704],
  ["green-tea", "images/menu/tea/green-tea.webp", 463445],
  [
    "sunset-apple-infusion",
    "images/menu/tea/sunset-apple-infusion.webp",
    30103700,
  ],
  [
    "golden-calm-infusion",
    "images/menu/tea/golden-calm-infusion.webp",
    29387141,
  ],
  [
    "ginger-apple-infusion",
    "images/menu/tea/ginger-apple-infusion.webp",
    16134585,
  ],
  [
    "energy-boost-infusion",
    "images/menu/tea/energy-boost-infusion.webp",
    10776408,
  ],
  ["lemonade", "images/menu/mocktail/lemonade.webp", 16066872],
  ["mojito", "images/menu/mocktail/mojito.webp", 8375044],
  ["passion-mojito", "images/menu/mocktail/passion-mojito.webp", 8375038],
  ["red-mojito", "images/menu/mocktail/red-mojito.webp", 12419173],
  ["blue-hawaii", "images/menu/mocktail/blue-hawaii.webp", 12419204],
  ["apple-martini", "images/menu/mocktail/apple-martini.webp", 8228301],
  ["cuba-libre", "images/menu/mocktail/cuba-libre.webp", 13293872],
  ["cherry-smoothie", "images/menu/mocktail/cherry-smoothie.webp", 4214381],
  ["mango-smoothie", "images/menu/mocktail/mango-smoothie.webp", 2113915],
  ["waffle", "images/menu/dessert/waffle.webp", 14705142],
  ["signature-cookie", "images/menu/dessert/signature-cookie.webp", 31116124],
  [
    "signature-ice-cream",
    "images/menu/dessert/signature-ice-cream.webp",
    16015237,
  ],
  ["chicken-panini", "images/menu/food/chicken-panini.webp", 5337811],
  ["bacon-panini", "images/menu/food/bacon-panini.webp", 15951903],
  ["golden-fries", "images/menu/food/golden-fries.webp", 33583358],
  ["baked-fries", "images/menu/food/baked-fries.webp", 29285462],
  ["extra-dip", "images/menu/food/extra-dip.webp", 18354019],
  [
    "crispy-chicken-caesar",
    "images/menu/food/crispy-chicken-caesar.webp",
    28841108,
  ],
].map(([itemId, localPath, pexelsId]) => ({
  itemId,
  localPath,
  pexelsId,
  sourcePage: `https://www.pexels.com/photo/${pexelsId}/`,
  license: "https://www.pexels.com/license/",
}));

async function downloadPhoto(source) {
  const url = `https://images.pexels.com/photos/${source.pexelsId}/pexels-photo-${source.pexelsId}.jpeg?auto=compress&cs=tinysrgb&w=1600`;
  const response = await fetch(url, {
    headers: { "User-Agent": "Cafe-Goftogoo-asset-builder/1.0" },
  });

  if (!response.ok) {
    throw new Error(
      `${source.itemId}: ${response.status} ${response.statusText}`,
    );
  }

  const outputFile = join(outputRoot.pathname, source.localPath);
  await mkdir(dirname(outputFile), { recursive: true });
  const input = Buffer.from(await response.arrayBuffer());

  await sharp(input)
    .rotate()
    .resize(1200, 900, {
      fit: "cover",
      position: sharp.strategy.attention,
      withoutEnlargement: false,
    })
    .webp({ quality: 80, effort: 5, smartSubsample: true })
    .toFile(outputFile);

  return source.itemId;
}

const queue = [...photoSources];
const failures = [];

async function worker() {
  while (queue.length > 0) {
    const source = queue.shift();
    if (!source) return;

    try {
      const itemId = await downloadPhoto(source);
      process.stdout.write(`Downloaded ${itemId}\n`);
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }
  }
}

await Promise.all(Array.from({ length: 6 }, () => worker()));

await writeFile(
  new URL("../public/images/menu/photo-sources.json", import.meta.url),
  `${JSON.stringify(photoSources, null, 2)}\n`,
  "utf8",
);

await writeFile(
  new URL("../public/images/menu/image-manifest.json", import.meta.url),
  `${JSON.stringify(
    {
      generatedAt: "2026-08-05",
      note: "Optimized local product photographs. Source pages and licenses are recorded in photo-sources.json.",
      items: photoSources.map((source) => ({
        id: source.itemId,
        expectedPath: `/${source.localPath}`,
        status: "photo",
      })),
    },
    null,
    2,
  )}\n`,
  "utf8",
);

if (failures.length > 0) {
  throw new Error(`Photo downloads failed:\n${failures.join("\n")}`);
}

process.stdout.write(
  `Saved ${photoSources.length} optimized local WebP product photos and manifests.\n`,
);
