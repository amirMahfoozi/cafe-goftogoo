import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = join(projectRoot, "dist");
const html = await readFile(join(distRoot, "index.html"), "utf8");
const manifest = JSON.parse(
  await readFile(
    join(projectRoot, "public/images/menu/image-manifest.json"),
    "utf8",
  ),
);

const failures = [];
const requireMatch = (condition, message) => {
  if (!condition) failures.push(message);
};

requireMatch(
  html.includes('<html lang="fa" dir="rtl">'),
  "Root HTML must be Persian RTL.",
);
requireMatch(
  html.includes('aria-current="true"'),
  "Initial active category is missing.",
);
requireMatch(
  html.includes("۲۳۰"),
  "A confirmed menu price is not rendered with Persian digits.",
);
requireMatch(
  !html.includes("پیشنهاد کافه"),
  "The removed featured-section copy is still present.",
);
requireMatch(
  html.includes("تمام قیمت‌ها به هزار تومان است."),
  "The single price-unit note is missing.",
);
requireMatch(
  !html.includes("امروز تا"),
  "Forbidden live opening-status copy was found.",
);

const imageTags = html.match(/<img\b[^>]*>/g) ?? [];
const menuImageTags = imageTags.filter((tag) =>
  tag.includes("data-menu-image"),
);
requireMatch(
  menuImageTags.length === manifest.items.length,
  `Expected ${manifest.items.length} product images, found ${menuImageTags.length}.`,
);

for (const imageTag of imageTags) {
  const isDecorative =
    imageTag.includes('alt=""') && imageTag.includes('aria-hidden="true"');
  requireMatch(
    isDecorative || /\balt="[^"]+"/.test(imageTag),
    `Image is missing a descriptive alt: ${imageTag}`,
  );
  requireMatch(
    /\bwidth="\d+"/.test(imageTag),
    `Image is missing width: ${imageTag}`,
  );
  requireMatch(
    /\bheight="\d+"/.test(imageTag),
    `Image is missing height: ${imageTag}`,
  );
  requireMatch(
    !/\bsrc="https?:\/\//.test(imageTag),
    `Remote image hotlink detected: ${imageTag}`,
  );
}

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
requireMatch(
  duplicateIds.length === 0,
  `Duplicate DOM ids: ${[...new Set(duplicateIds)].join(", ")}`,
);

const hashTargets = [...html.matchAll(/\bhref="#([^"]+)"/g)].map(
  (match) => match[1],
);
for (const target of hashTargets) {
  requireMatch(
    ids.includes(target),
    `Hash link target does not exist: #${target}`,
  );
}

const assetNames = await readdir(join(distRoot, "assets"));
const cssNames = assetNames.filter((name) => name.endsWith(".css"));
const jsNames = assetNames.filter((name) => name.endsWith(".js"));
const css = (
  await Promise.all(
    cssNames.map((name) => readFile(join(distRoot, "assets", name), "utf8")),
  )
).join("\n");

requireMatch(
  !/(margin|padding|inset|border)-(left|right)\s*:/.test(css),
  "A physical left/right CSS property was found; use logical properties.",
);
requireMatch(
  css.includes("max-width:349px") || css.includes("width<=349px"),
  "The extremely narrow one-column breakpoint is missing.",
);

const jsBytes = (
  await Promise.all(jsNames.map((name) => stat(join(distRoot, "assets", name))))
).reduce((total, entry) => total + entry.size, 0);
const inlineClientScripts = [
  ...html.matchAll(
    /<script(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g,
  ),
].map((match) => match[1] ?? "");
const inlineJsBytes = inlineClientScripts
  .map((script) => Buffer.byteLength(script, "utf8"))
  .reduce((total, bytes) => total + bytes, 0);
const totalJsBytes = jsBytes + inlineJsBytes;
const clientJs = (
  await Promise.all(
    jsNames.map((name) => readFile(join(distRoot, "assets", name), "utf8")),
  )
)
  .concat(inlineClientScripts)
  .join("\n");

requireMatch(
  !clientJs.includes("scrollIntoView"),
  "Category navigation must not use scrollIntoView because it can move the page vertically while tracking the active chip.",
);
requireMatch(
  clientJs.includes("scrollBy") && clientJs.includes("scrollTo"),
  "Expected separate horizontal chip reveal and vertical section navigation behavior.",
);
requireMatch(
  totalJsBytes < 15_000,
  `Client JavaScript exceeds the 15 KB raw budget: ${totalJsBytes} bytes.`,
);

if (failures.length > 0) {
  throw new Error(`Production audit failed:\n${failures.join("\n")}`);
}

console.log(
  `Audited Persian RTL HTML, ${imageTags.length} images, ${ids.length} unique IDs, ${hashTargets.length} anchors, and ${totalJsBytes} bytes of client JavaScript.`,
);
