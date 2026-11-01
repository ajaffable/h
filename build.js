// ==========================================================
// Hotel website — build the finished website into the _site folder
//
//   node build.js
//
// Creates a real page for the home page, every category, state, city and
// hotel (so Google can find and read each one), plus sitemap.xml and
// robots.txt. GitHub runs this automatically every time you push a change,
// so normally you never need to run it yourself.
// Needs only Node.js, no other installs.
// ==========================================================

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const OUT = "_site";
const COPY = ["css", "js", "data", "images", "favicon.svg"];   // copied as they are

// ---- Load the data and the page templates, exactly as the browser does ----
const context = vm.createContext({ console, URLSearchParams });
for (const file of ["data/hotels.js", "js/render.js"]) {
  vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: file });
}
const site = vm.runInContext(`({
  SITE, on, allHotels, allPaths, resolveRoute, renderPage, pageMeta,
  headTags, navHTML, footerHTML, absUrl, esc,
  REDIRECTS: typeof REDIRECTS === "undefined" ? {} : REDIRECTS
})`, context);

if (/example\.com/.test(site.SITE.url)) {
  console.warn("⚠  SITE.url in data/hotels.js is still example.com. Set it to your domain so Google gets the right links.\n");
}

// ---- Fill the template (index.html) for one page ----
const template = fs.readFileSync("index.html", "utf8");
const fill = (meta, content) => template
  .replace(/<!--META-->[\s\S]*?<!--\/META-->/, site.headTags(meta))
  .replace("<!--LOGO-->", site.esc(site.SITE.name))
  .replace("<!--NAV-->", site.navHTML())
  .replace("<!--APP-->", content)
  .replace("<!--FOOTER-->", site.footerHTML())
  .replace('href="https://wa.me/"', `href="https://wa.me/${site.SITE.whatsapp}"${site.on("whatsappButton") ? "" : " hidden"}`);

function write(file, text) {
  const target = path.join(OUT, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
}

// ---- Start fresh and copy the static files ----
fs.rmSync(OUT, { recursive: true, force: true });
for (const item of COPY) {
  if (fs.existsSync(item)) fs.cpSync(item, path.join(OUT, item), { recursive: true });
}
write(".nojekyll", "");   // tells GitHub Pages to serve the files as they are

// ---- One page per address ----
const pages = [];          // addresses that go in the sitemap
let redirects = 0;

// A tiny page that forwards to another address (Google treats it as a permanent move)
function writeRedirect(file, to) {
  write(file,
    `<!doctype html><meta charset="utf-8"><title>Redirecting…</title><link rel="canonical" href="${site.absUrl(to)}">` +
    `<meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${to}"><a href="${to}">Continue</a>`);
  redirects++;
}

function buildPage(urlPath) {
  const route = site.resolveRoute(urlPath, "");
  // A level with only one choice (e.g. a state with one city) forwards to that choice
  if (route.page === "redirect") return writeRedirect(path.join(urlPath, "index.html"), route.to);
  write(path.join(urlPath, "index.html"), fill(site.pageMeta(route), site.renderPage(route)));
  pages.push(urlPath);
}

site.allPaths().forEach(buildPage);

// Old addresses from a previous website (REDIRECTS in data/hotels.js)
for (const [from, to] of Object.entries(site.REDIRECTS)) {
  const file = from.endsWith(".html") ? from : path.join(from, "index.html");
  if (fs.existsSync(path.join(OUT, file))) continue;   // never replace a real page
  writeRedirect(file, to);
}

// ---- "Page not found" (GitHub Pages shows 404.html for unknown addresses) ----
write("404.html", fill(site.pageMeta({ page: "notfound" }), site.renderPage({ page: "notfound" })));

// ---- sitemap.xml and robots.txt, so Google finds every page ----
const today = new Date().toISOString().slice(0, 10);
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url><loc>${site.absUrl(p)}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`);
write("robots.txt", `User-agent: *
Allow: /

Sitemap: ${site.absUrl("/sitemap.xml")}
`);

console.log(`✓ Built ${pages.length} pages (${site.allHotels.length} hotels) and ${redirects} shortcut redirects into ${OUT}/`);
