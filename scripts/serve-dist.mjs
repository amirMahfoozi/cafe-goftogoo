import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const distRoot = new URL("../dist/", import.meta.url).pathname;
const host = process.env.PREVIEW_HOST || "127.0.0.1";
const port = Number(process.env.PREVIEW_PORT || 4321);
const mimeTypes = new Map([
  [".avif", "image/avif"],
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webmanifest", "application/manifest+json"],
  [".webp", "image/webp"],
  [".woff2", "font/woff2"],
]);

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url || "/", `http://${host}:${port}`);
    const pathname = decodeURIComponent(requestUrl.pathname);
    const normalizedPath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
    let filePath = join(distRoot, normalizedPath);
    let fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      filePath = join(filePath, "index.html");
      fileStat = await stat(filePath);
    }

    if (!fileStat.isFile() || !filePath.startsWith(distRoot)) {
      throw new Error("Not found");
    }

    response.writeHead(200, {
      "Content-Type":
        mimeTypes.get(extname(filePath).toLowerCase()) ||
        "application/octet-stream",
      "Content-Length": fileStat.size,
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(port, host, () => {
  process.stdout.write(`Preview running at http://${host}:${port}/\n`);
});
