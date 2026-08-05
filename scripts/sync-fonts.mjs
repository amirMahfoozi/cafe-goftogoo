import { copyFile, mkdir, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const destination = join(projectRoot, "public/fonts");

async function findFontFile(packageName, familyName) {
  const packageRoot = join(projectRoot, "node_modules", packageName);
  const exact = join(packageRoot, "files", `${familyName}-wght-normal.woff2`);

  if (existsSync(exact)) return exact;

  const files = await readdir(join(packageRoot, "files"));
  const candidate = files.find(
    (file) =>
      file.endsWith("-wght-normal.woff2") &&
      !file.includes("latin") &&
      !file.includes("cyrillic"),
  );

  if (!candidate)
    throw new Error(`Could not find a variable font file for ${familyName}.`);
  return join(packageRoot, "files", candidate);
}

async function findLicense(packageName) {
  const packageRoot = join(projectRoot, "node_modules", packageName);
  for (const name of ["LICENSE", "LICENSE.md", "OFL.txt"]) {
    const candidate = join(packageRoot, name);
    if (existsSync(candidate)) return candidate;
  }
  throw new Error(`Could not find a font license in ${packageName}.`);
}

await mkdir(destination, { recursive: true });

for (const font of [
  {
    packageName: "@fontsource-variable/estedad",
    familyName: "estedad",
    outputName: "estedad-variable.woff2",
    licenseName: "OFL-Estedad.txt",
  },
  {
    packageName: "@fontsource-variable/vazirmatn",
    familyName: "vazirmatn",
    outputName: "vazirmatn-variable.woff2",
    licenseName: "OFL-Vazirmatn.txt",
  },
]) {
  await copyFile(
    await findFontFile(font.packageName, font.familyName),
    join(destination, font.outputName),
  );
  await copyFile(
    await findLicense(font.packageName),
    join(destination, font.licenseName),
  );
}

console.log("Copied self-hosted Estedad and Vazirmatn fonts with licenses.");
