import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createServer } from "vite";
import { metadataFor, publicPages } from "../src/utils/pageMetadata.js";

// Static brand pages include their actual content in the initial HTTP response.
// Interactive, account and catalog routes retain a separate empty app shell.
const output = new URL("../dist/", import.meta.url);
const template = await readFile(new URL("index.html", output), "utf8");
await writeFile(new URL("app.html", output), template);
const vite = await createServer({
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
});
const escape = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;");
try {
  const { render } = await vite.ssrLoadModule("/src/entry-server.jsx");
  for (const pathname of [
    "/",
    "/about",
    "/contact",
    "/care",
    "/shipping-returns",
  ]) {
    const meta = metadataFor(pathname);
    let html = template.replace(
      '<div id="root"></div>',
      `<div id="root">${render(pathname)}</div>`,
    );
    html = html
      .replace(/<title>[^<]*<\/title>/, `<title>${escape(meta.title)}</title>`)
      .replace(
        /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
        `<meta name="description" content="${escape(meta.description)}" />`,
      )
      .replace(
        /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
        `<meta property="og:title" content="${escape(meta.title)}" />`,
      )
      .replace(
        /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
        `<meta property="og:description" content="${escape(meta.description)}" />`,
      )
      .replace(
        "</head>",
        `<link rel="canonical" href="${meta.canonical}" /><meta property="og:url" content="${meta.canonical}" /></head>`,
      );
    const directory =
      pathname === "/" ? output : new URL(`.${pathname}/`, output);
    await mkdir(directory, { recursive: true });
    await writeFile(new URL("index.html", directory), html);
  }
  await writeFile(
    new URL("sitemap.xml", output),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(
      publicPages,
    )
      .map((path) => `<url><loc>${metadataFor(path).canonical}</loc></url>`)
      .join("")}</urlset>\n`,
  );
  console.log("Prerendered 5 brand pages and generated sitemap.xml.");
} finally {
  await vite.close();
}
