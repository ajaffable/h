// ==========================================================
// Hotel website — page templates
// Turns data/hotels.js into HTML. Used in two places:
//   • the browser (js/main.js) draws pages as visitors click around
//   • build.js pre-builds every page as a real file so Google can read it
// You shouldn't need to edit this file.
//
// Page addresses:
//   /                               home
//   /search/?q=rishikesh&type=resorts search & browse all hotels
//   /destinations/                  every city, grouped by state
//   /destinations/rishikesh/        all hotels in one city, any type
//   /offers/                        every hotel with an offer
//   /resorts/                       category  → its states
//   /resorts/uttarakhand/           state     → its cities
//   /resorts/uttarakhand/rishikesh/ city     → its hotels
//   /hotel/the-emerald/             hotel page
// ==========================================================

// Is a feature switched on in data/hotels.js? (Anything not listed counts as on.)
const on = key => typeof FEATURES === "undefined" || FEATURES[key] !== false;

// ---------- Small helpers ----------
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const slug = s => String(s).toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const norm = s => String(s ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const inr = n => "₹" + Number(n).toLocaleString("en-IN");
const plural = (n, one, many = one + "s") => `${n} ${n === 1 ? one : many}`;
const stars = n => "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));
const whatsappLink = (number = SITE.whatsapp) => `https://wa.me/${number}`;

// ---------- Images ----------
// Photos in images/hotels/ and images/site/ come in three sizes (name-480.webp, name-960.webp,
// name.webp) and the browser picks the smallest one that looks sharp.
// Photos on image services that can resize (Cloudinary-style links, Unsplash)
// are fetched at the right size too. Any other file is used as it is.
const LOCAL_SIZED = /^\/?images\/(hotels|site)\/.+\.webp$/;
const CLOUDINARY = /^(https:\/\/[^/]+\/(?:[^/]+\/)?image\/upload\/)([^,]+)$/;   // a photo with no size set yet
const isUnsplash = url => /images\.unsplash\.com/.test(url) && !url.includes("?");
const isResizable = url => isUnsplash(url) || CLOUDINARY.test(url);
function sized(url, w, ar) {
  const c = url.match(CLOUDINARY);
  if (c) return `${c[1]}w_${w},${ar ? `ar_${ar},c_fill,g_auto` : "c_limit"},q_70,f_auto/${c[2]}`;
  return `${url}?w=${w}&q=55&auto=format&fit=crop${ar ? "&ar=" + ar : ""}`;
}
const asset = url => /^(https?:)?\/\//.test(url) || url.startsWith("/") ? url : "/" + url;   // works from any page depth

function pic(url, alt, { sizes = "100vw", widths = [320, 480, 720], ar = "", eager = false } = {}) {
  const load = eager ? 'fetchpriority="high"' : 'loading="lazy"';
  if (LOCAL_SIZED.test(url)) {
    const src = asset(url), base = src.replace(/\.webp$/, "");
    const srcset = `${base}-480.webp 480w, ${base}-960.webp 960w, ${src} 1440w`;
    return `<img src="${esc(base)}-960.webp" srcset="${esc(srcset)}" sizes="${sizes}" alt="${esc(alt)}" ${load} decoding="async">`;
  }
  if (!isResizable(url)) return `<img src="${esc(asset(url))}" alt="${esc(alt)}" ${load} decoding="async">`;
  const srcset = widths.map(w => `${sized(url, w, ar)} ${w}w`).join(", ");
  return `<img src="${sized(url, widths[1], ar)}" srcset="${srcset}" sizes="${sizes}" alt="${esc(alt)}" ${load} decoding="async">`;
}
// Full-width photos: on phones a 960 px photo is already sharp, so pick that instead of 1440 px
const FULL = "(max-width: 600px) 320px, 100vw";
const CARD_IMG = { sizes: "(max-width: 600px) 160px, (max-width: 860px) 45vw, 270px", ar: "4:5" };

// ==========================================================
// 1. Build the tree: root → category → state → city → hotel
//    (hidden categories and hotels are left out entirely)
// ==========================================================
const root = { type: "root", name: "Home", children: [] };
const hotelsById = {};

CATEGORIES.filter(c => !c.hidden).forEach(c =>
  root.children.push({ type: "category", name: c.name, slug: c.id, data: c, parent: root, children: [] }));

function childOf(parent, type, name) {
  const s = slug(name);
  let node = parent.children.find(n => n.slug === s);
  if (!node) parent.children.push(node = { type, name, slug: s, parent, children: [] });
  return node;
}

HOTELS.filter(h => !h.hidden).forEach(h => {
  const category = root.children.find(c => c.slug === h.category);
  if (!category) {
    if (!CATEGORIES.some(c => c.id === h.category)) console.warn(`Hotel "${h.name}" has an unknown category "${h.category}". Check data/hotels.js.`);
    return;   // unknown, or its category is hidden
  }
  const city = childOf(childOf(category, "state", h.state), "city", h.city);
  h.id = h.id || slug(h.name);
  const node = {
    type: "hotel", name: h.name, slug: h.id, data: h, parent: city, children: [],
    category,
    searchText: norm([h.name, h.city, h.state, category.name, h.tagline, ...(h.highlights || [])].join(" "))
  };
  city.children.push(node);
  hotelsById[h.id] = node;
});

// A category with no visible hotels is not shown
root.children = root.children.filter(c => c.children.length);

const allHotels = Object.values(hotelsById);
const allReviews = REVIEWS.filter(r => !r.hotel || hotelsById[r.hotel]);

// Skip levels that have only one choice (1 city in a state, 1 hotel in a city…)
const settle = node => {
  while (node.type !== "hotel" && node.type !== "root" && node.children.length === 1) node = node.children[0];
  return node;
};
const hotelsIn = node => node.type === "hotel" ? [node] : node.children.flatMap(hotelsIn);
const ancestors = node => {
  const list = [];
  for (let n = node.parent; n && n.type !== "root"; n = n.parent) list.unshift(n);
  return list;
};
const categoryOf = node => ancestors(node)[0] || node;
const allNodes = (node = root) => [node, ...node.children.flatMap(n => allNodes(n))];

function href(node) {
  node = settle(node);
  if (node.type === "root") return "/";
  if (node.type === "hotel") return `/hotel/${node.slug}/`;
  return "/" + [...ancestors(node), node].map(n => n.slug).join("/") + "/";
}
const searchHref = (q = "", type = "") => "/search/" + (q || type ? "?" + new URLSearchParams({ ...(q && { q }), ...(type && { type }) }) : "");

const lowestPrice = h => h.rooms?.length ? Math.min(...h.rooms.map(r => r.price)) : h.priceFrom;
const shownPrice = h => on("prices") ? lowestPrice(h) : null;
const shownRating = h => on("ratings") ? h.rating : null;
const isNew = h => h.addedOn && Date.now() - new Date(h.addedOn) < 90 * 864e5;
const newest = (a, b) => (b.data.addedOn || "").localeCompare(a.data.addedOn || "");

const SORTERS = {
  popular: (a, b) => (b.data.popular ? 1 : 0) - (a.data.popular ? 1 : 0) || (b.data.rating || 0) - (a.data.rating || 0),
  price: (a, b) => (lowestPrice(a.data) || Infinity) - (lowestPrice(b.data) || Infinity),
  rating: (a, b) => (b.data.rating || 0) - (a.data.rating || 0),
  new: newest
};

function findHotels(query, type = "") {
  const words = norm(query).split(/\s+/).filter(Boolean);
  return allHotels.filter(n => (!type || n.category.slug === type) && words.every(w => n.searchText.includes(w)));
}

// Destinations: every city, with all its hotels whatever their type
const destinations = [];
allHotels.forEach(n => {
  const key = slug(n.data.city);
  let d = destinations.find(x => x.slug === key);
  if (!d) destinations.push(d = { slug: key, name: n.data.city, state: n.data.state, hotels: [] });
  d.hotels.push(n);
});
destinations.sort((a, b) => b.hotels.length - a.hotels.length || a.name.localeCompare(b.name));
const destHref = d => `/destinations/${d.slug}/`;

// Cities, most hotels first (for the "Popular" city buttons)
const topCities = limit => destinations.slice(0, limit).map(d => d.name);

// Where a city name links to: its destination page, or search results
const cityHref = name => on("destinations") ? `/destinations/${slug(name)}/` : searchHref(name);

const hotelsWithOffers = () => on("offers") ? allHotels.filter(n => n.data.offer) : [];
const showOffersPage = () => on("offersPage") && hotelsWithOffers().length > 0;

// Recently viewed hotels, remembered in this browser only
const RECENT_KEY = "recently-viewed-hotels";
function getRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; } catch { return []; }
}

// ==========================================================
// 2. Reusable pieces of HTML
// ==========================================================
function crumbs(node) {
  if (!on("breadcrumbs")) return "";
  const items = [`<a href="/">Home</a>`];
  ancestors(node).forEach(a => {
    items.push(settle(a) === node ? `<span>${esc(a.name)}</span>` : `<a href="${href(a)}">${esc(a.name)}</a>`);
  });
  items.push(`<span aria-current="page">${esc(node.name)}</span>`);
  return `<nav class="crumbs wrap" aria-label="Breadcrumb">${items.join('<i aria-hidden="true">/</i>')}</nav>`;
}

// Breadcrumbs for pages outside the category tree, e.g. Home / Destinations / Rishikesh
function simpleCrumbs(trail, current) {
  if (!on("breadcrumbs")) return "";
  const items = [`<a href="/">Home</a>`, ...trail.map(([name, link]) => `<a href="${link}">${esc(name)}</a>`), `<span aria-current="page">${esc(current)}</span>`];
  return `<nav class="crumbs wrap" aria-label="Breadcrumb">${items.join('<i aria-hidden="true">/</i>')}</nav>`;
}

// Small coloured tag that shows a hotel's type, e.g. "● Heritage"
function typeTag(category, asLink = false) {
  if (!on("typeTags")) return "";
  const c = category.data;
  const attrs = `class="tag" style="--tag: ${esc(c.color || "#6b6258")}"`;
  const text = esc(c.short || c.name);
  return asLink ? `<a ${attrs} href="${href(category)}">${text}</a>` : `<span ${attrs}>${text}</span>`;
}

function badgeFor(h) {
  if (h.offer && on("offers")) return `<span class="badge badge--offer">${esc(h.offer)}</span>`;
  if (!on("badges")) return "";
  if (isNew(h)) return `<span class="badge">New</span>`;
  if (h.popular) return `<span class="badge">Popular</span>`;
  return "";
}

// Small line icons (inline SVG, no icon library needed)
const ICON = {
  pin: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
  check: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  left: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>`,
  right: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3h2.6l1.4 4.3-2 1.5a12 12 0 0 0 6.6 6.6l1.5-2 4.3 1.4v2.6A2.6 2.6 0 0 1 18.4 20 15.4 15.4 0 0 1 4 5.6 2.6 2.6 0 0 1 6.6 3z"/></svg>`,
  photos: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
  mountain: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20l6.5-11 4 6.5L16 12l5 8z"/><circle cx="17" cy="6" r="2"/></svg>`,
  chat: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  map: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/></svg>`
};
const icon = name => `<span class="icon">${ICON[name]}</span>`;

function hotelCard(node) {
  const h = node.data;
  const price = shownPrice(h);
  const rating = shownRating(h);
  return `
    <a class="card" href="${href(node)}" data-cat="${esc(node.category.slug)}" data-state="${esc(slug(h.state))}">
      <div class="card__img">${pic(h.image, h.name, CARD_IMG)}${badgeFor(h)}<span class="card__type">${typeTag(node.category)}</span></div>
      <div class="card__body">
        <p class="card__meta">${icon("pin")}<span>${esc(h.city)}, ${esc(h.state)}</span></p>
        <h3>${esc(h.name)}</h3>
        ${h.tagline ? `<p class="card__text">${esc(h.tagline)}</p>` : ""}
        <div class="card__foot">
          <span>${price ? `from <strong>${inr(price)}</strong>` : rating ? `<span class="rating">★ ${rating}</span>` : "View hotel"}</span>
          <span class="card__go">${icon("arrow")}</span>
        </div>
      </div>
    </a>`;
}

// A photo card with the name over the picture (states, cities, destinations)
function photoCard(link, image, title, sub, extra = "") {
  return `
    <a class="pcard" href="${link}">
      ${pic(image, title, { sizes: "(max-width: 600px) 160px, (max-width: 860px) 70vw, 300px", widths: [320, 480, 720], ar: "4:5" })}
      <div class="pcard__body">
        <h3>${esc(title)}</h3>
        <p>${sub}</p>
        ${extra}
      </div>
    </a>`;
}

// A card for a state or a city
function placeCard(node) {
  const hotels = hotelsIn(node);
  const target = settle(node);
  const sub = node.type === "state" && node.children.length > 1
    ? `${plural(hotels.length, "hotel")} · ${node.children.map(c => esc(c.name)).join(", ")}`
    : target.type === "hotel" ? esc(target.name) : plural(hotels.length, "hotel");
  return photoCard(href(node), hotels[0].data.image, node.name, sub);
}

function reviewCard(r, hidden = false) {
  const hotel = r.hotel && hotelsById[r.hotel];
  return `
    <figure class="quote"${hidden ? " hidden" : ""}>
      ${on("ratings") ? `<div class="stars" aria-label="${r.rating || 5} out of 5">${stars(r.rating || 5)}</div>` : ""}
      <blockquote>“${esc(r.text)}”</blockquote>
      <figcaption>${esc(r.name)}${r.from ? `, ${esc(r.from)}` : ""}
        ${hotel ? `<a href="${href(hotel)}">Stayed at ${esc(hotel.name)}</a>` : ""}</figcaption>
    </figure>`;
}

// A titled row of cards, with an optional "see all" link
function shelf(label, title, nodes, more = "") {
  if (!nodes.length) return "";
  return `
    <section class="section section--compact">
      <div class="wrap">
        <div class="section__row">
          <div><p class="label">${label}</p><h2>${title}</h2></div>
          ${more}${nodes.length > 4 ? scrollButtons() : ""}
        </div>
        <div class="cards cards--row">${nodes.map(hotelCard).join("")}</div>
      </div>
    </section>`;
}

// ‹ › buttons that scroll the row of cards next to them
const scrollButtons = () => `
  <div class="scroll-btns">
    <button type="button" data-scroll-row="-1" aria-label="Scroll left">${ICON.left}</button>
    <button type="button" data-scroll-row="1" aria-label="Scroll right">${ICON.right}</button>
  </div>`;

function searchBox(value = "", autofocus = false) {
  return `
    <form class="search" role="search" action="/search/" data-search>
      <label class="sr-only" for="q">Search hotels</label>
      <input id="q" name="q" type="search" value="${esc(value)}" placeholder="Search a city, state or hotel name…" autocomplete="off" maxlength="60" ${autofocus ? "autofocus" : ""}>
      <button class="btn" type="submit">Search</button>
      <ul class="suggest" hidden></ul>
    </form>`;
}

// Header links and footer (the same on every page)
function navHTML() {
  return `
  <a href="/">Home</a>
  ${on("destinations") ? `<a href="/destinations/">Destinations</a>` : ""}
  ${showOffersPage() ? `<a href="/offers/">Offers</a>` : ""}
  ${on("search") ? `<a href="${searchHref()}">Find a hotel</a>` : ""}
  <a href="#" data-scroll="contact">Contact</a>
  <a href="${whatsappLink()}" class="btn btn--small" target="_blank" rel="noopener">${on("bookingForm") ? "Book on WhatsApp" : "WhatsApp us"}</a>`;
}

// Social media logos for the footer (shown only when SITE.instagram / SITE.facebook are set)
const SOCIAL = {
  instagram: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4V8z"/></svg>`
};

function footerHTML() {
  const social = [["instagram", SITE.instagram], ["facebook", SITE.facebook]].filter(([, url]) => url && url !== "#");
  return `
  <div class="cta-band">
    ${pic(SITE.ctaImage || SITE.heroImage, "", { sizes: FULL, widths: [960, 1440] })}
    <div class="wrap cta">
      <p class="label label--light">Plan your trip</p>
      <h2>Need help choosing <em>a stay?</em></h2>
      <p>Tell us your dates and where you'd like to go. We'll suggest the right hotel and share the best direct rate.</p>
      <div class="cta__actions">
        <a class="btn btn--light" href="${whatsappLink()}" target="_blank" rel="noopener">WhatsApp us</a>
        <a class="btn btn--outline-light" href="tel:${esc(SITE.phone.replace(/\s/g, ""))}">${icon("phone")} ${esc(SITE.phone)}</a>
      </div>
    </div>
  </div>
  <div class="wrap footer__grid">
    <div>
      <a href="/" class="logo">${esc(SITE.name)}</a>
      <p>${esc(SITE.intro)}</p>
      ${social.length ? `<p class="social">${social.map(([name, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener" aria-label="${name}">${SOCIAL[name]}</a>`).join("")}</p>` : ""}
    </div>
    <div>
      <p class="label">Explore</p>
      <p>${[
        on("search") ? `<a href="${searchHref()}">All hotels</a>` : "",
        on("destinations") ? `<a href="/destinations/">Destinations</a>` : "",
        showOffersPage() ? `<a href="/offers/">Offers</a>` : "",
        ...root.children.map(c => `<a href="${href(c)}">${esc(c.name)}</a>`)
      ].filter(Boolean).join("<br>")}</p>
    </div>
    ${on("search") || on("destinations") ? `
    <div>
      <p class="label">Popular cities</p>
      <p>${topCities(4).map(c => `<a href="${cityHref(c)}">${esc(c)}</a>`).join("<br>")}</p>
    </div>` : ""}
    <div>
      <p class="label">Contact</p>
      <p>${SITE.address ? `${esc(SITE.address)}<br>` : ""}
         ${[SITE.phone, SITE.phone2].filter(Boolean).map(p => `<a href="tel:${esc(p.replace(/\s/g, ""))}">${esc(p)}</a>`).join("<br>")}<br>
         <a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></p>
    </div>
  </div>
  <div class="wrap footer__bottom">
    <span>© ${new Date().getFullYear()} ${esc(BRAND())}</span>
    <a href="#" data-scroll="app">Back to top ↑</a>
  </div>`;
}

// ==========================================================
// 3. Pages
// ==========================================================
function homePage() {
  const recent = on("recentlyViewed") ? getRecent().map(id => hotelsById[id]).filter(Boolean) : [];
  const popular = on("popularHotels") ? allHotels.filter(n => n.data.popular).slice(0, 4) : [];
  const latest = on("newlyAdded") ? [...allHotels].filter(n => n.data.addedOn).sort(newest).slice(0, 4) : [];
  const reviews = on("siteReviews") ? allReviews : [];
  const avg = reviews.length ? (reviews.reduce((s, r) => s + (r.rating || 5), 0) / reviews.length).toFixed(1) : null;

  // Photos for the hero slideshow: SITE.heroImages, or the main photo plus a few hotels
  const slides = [...new Set(SITE.heroImages || [SITE.heroImage, ...[...allHotels].sort(SORTERS.popular)
    .filter(n => n.category === root.children[0]).map(n => n.data.image)])].filter(Boolean).slice(0, 4);
  const states = [...new Set(allHotels.map(n => n.data.state))].sort();
  const STAYS_SHOWN = 8;

  return `
    <section class="hero hero--home">
      <div class="hero__slides" aria-hidden="true">
        ${slides.map((img, i) => `<div class="hero__slide${i ? "" : " is-active"}">${i ? pic(img, "", { sizes: FULL, widths: [960, 1440] }).replace(/ (src|srcset)=/g, " data-$1=") : pic(img, "", { sizes: FULL, widths: [960, 1440], eager: true })}</div>`).join("")}
      </div>
      <div class="wrap hero__content">
        <p class="label label--light">${esc(SITE.tagline)}</p>
        <h1>${esc(SITE.headline || "Stays across India,")} <em>${esc(SITE.headlineEm || "chosen with care.")}</em></h1>
        <p class="lead">${esc(SITE.intro)}</p>
        ${on("search") ? searchBox() : `<div class="hero__actions"><a class="btn" href="#" data-scroll="stays">Explore our hotels</a></div>`}
        ${on("popularCities") && (on("search") || on("destinations")) ? `
        <p class="quick">
          <span>Popular:</span>
          ${topCities(5).map(c => `<a href="${cityHref(c)}">${esc(c)}</a>`).join("")}
        </p>` : ""}
        ${statsRow()}
      </div>
      ${slides.length > 1 ? `<div class="hero__dots">${slides.map((_, i) => `<button type="button" data-slide="${i}" aria-label="Photo ${i + 1}"${i ? "" : ' aria-current="true"'}></button>`).join("")}</div>` : ""}
    </section>

    ${shelf("Welcome back", "Recently <em>viewed</em>", recent)}

    ${on("homeDestinations") && destinations.length > 1 ? `
    <section class="section section--compact section--sand">
      <div class="wrap">
        <div class="section__row">
          <div><p class="label">Destinations</p><h2>Where <em>to next?</em></h2></div>
          ${on("destinations") ? `<a class="link" href="/destinations/">All ${destinations.length} destinations ${icon("arrow")}</a>` : ""}
          ${destinations.length > 4 ? scrollButtons() : ""}
        </div>
        <div class="cards--row pcards">${destinations.map(destinationCard).join("")}</div>
      </div>
    </section>` : ""}

    ${on("homeStays") ? `
    <section class="section section--compact section--tint" id="stays">
      <div class="wrap">
        <div class="section__row">
          <div><p class="label">Our stays</p><h2>Find your <em>perfect stay</em></h2></div>
        </div>
        <div class="chips chips--filter" role="group" aria-label="Filter hotels">
          <button type="button" class="chip" data-filter="" aria-pressed="true">All <span>${allHotels.length}</span></button>
          ${root.children.map(c => `<button type="button" class="chip" data-filter="cat:${c.slug}" aria-pressed="false">${esc(c.name)} <span>${hotelsIn(c).length}</span></button>`).join("")}
          ${states.length > 1 ? `<i class="chips__sep" aria-hidden="true"></i>` + states.map(s => `<button type="button" class="chip" data-filter="state:${slug(s)}" aria-pressed="false">${esc(s)} <span>${allHotels.filter(n => n.data.state === s).length}</span></button>`).join("") : ""}
        </div>
        <div class="cards stays" id="stayGrid" data-shown="${STAYS_SHOWN}">
          ${[...allHotels].sort(SORTERS.popular).map((n, i) => hotelCard(n).replace('<a class="card"', `<a class="card${i >= STAYS_SHOWN ? " is-extra" : ""}"`)).join("")}
        </div>
        ${allHotels.length > STAYS_SHOWN ? `<div class="center"><button type="button" class="btn btn--ghost" id="showAllStays">Show all ${allHotels.length} stays</button></div>` : ""}
      </div>
    </section>` : ""}

    ${on("whyBookWithUs") && SITE.perks?.length ? `
    <section class="section perks-band">
      ${pic(SITE.perksImage || slides[1] || SITE.heroImage, "", { sizes: FULL, widths: [960, 1440] })}
      <div class="wrap">
        <div class="section__row"><div><p class="label label--light">Why stay with us</p><h2>Comfort, views <em>&amp; real hospitality</em></h2></div></div>
        <ul class="perks-grid">
          ${SITE.perks.map(p => `<li>${p.icon && ICON[p.icon] ? `<span class="perk__icon">${ICON[p.icon]}</span>` : ""}<h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`).join("")}
        </ul>
      </div>
    </section>` : ""}

    ${shelf("Guest favourites", "Popular <em>hotels</em>", popular,
      on("search") ? `<a class="link" href="${searchHref()}">See all ${allHotels.length} hotels ${icon("arrow")}</a>` : "")}

    ${on("browseByType") || !on("search") ? `
    <section class="section section--compact" id="types">
      <div class="wrap">
        <div class="section__row"><div><p class="label">Browse by type</p><h2>What kind of <em>stay?</em></h2></div></div>
        <div class="types">
          ${root.children.map(c => {
            const hotels = hotelsIn(c);
            const cities = new Set(hotels.map(n => n.data.city)).size;
            return `
              <a class="type" href="${href(c)}">
                ${pic(c.data.image, c.name, { sizes: "(max-width: 600px) 320px, (max-width: 860px) 92vw, 580px", widths: [480, 960], ar: "16:10" })}
                <div class="type__body">
                  <h3>${esc(c.name)}</h3>
                  <p>${esc(c.data.tagline || "")}</p>
                  <span class="type__go">${plural(hotels.length, "hotel")} · ${plural(cities, "city", "cities")} ${icon("arrow")}</span>
                </div>
              </a>`;
          }).join("")}
        </div>
      </div>
    </section>` : ""}

    ${shelf("Just opened", "Newly <em>added</em>", latest)}


    ${reviews.length ? `
    <section class="section section--compact" id="reviews">
      <div class="wrap">
        <div class="section__row">
          <div><p class="label">Guest reviews</p><h2>Loved by <em>our guests</em></h2></div>
          ${on("ratings") ? `<p class="score"><strong>${avg}</strong><span class="stars">${stars(avg)}</span><span>from ${plural(reviews.length, "review")}</span></p>` : ""}
        </div>
        <div class="quotes" id="reviewList">
          ${reviews.map((r, i) => reviewCard(r, i >= 3)).join("")}
        </div>
        ${reviews.length > 3 ? `<button class="btn btn--ghost" id="moreReviews">Show all ${reviews.length} reviews</button>` : ""}
      </div>
    </section>` : ""}

    ${on("faq") && FAQS.length ? `
    <section class="section section--tint section--compact">
      <div class="wrap faq">
        <div><p class="label">Questions</p><h2>Good <em>to know</em></h2>
          <p class="muted">Can't find an answer? <a class="link" href="${whatsappLink()}" target="_blank" rel="noopener">Ask us on WhatsApp</a></p></div>
        <div>${FAQS.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</div>
      </div>
    </section>` : ""}`;
}

// Trust numbers: counted from your data, plus any extras in SITE.stats
function statsRow() {
  if (!on("stats")) return "";
  const states = new Set(allHotels.map(n => n.data.state)).size;
  const items = [
    [allHotels.length, allHotels.length === 1 ? "hotel" : "hotels"],
    [destinations.length, destinations.length === 1 ? "destination" : "destinations"],
    [states, states === 1 ? "state" : "states"],
    ...(SITE.stats || []).map(s => [s.value, s.label])
  ];
  return `<ul class="stats">${items.map(([v, l]) => `<li><strong>${esc(v)}</strong>${esc(l)}</li>`).join("")}</ul>`;
}

// A card for one city (used on the home page and the Destinations page)
function destinationCard(d) {
  return photoCard(cityHref(d.name), d.hotels[0].data.image, d.name,
    `${esc(d.state)} · ${d.hotels.length === 1 ? "1 stay" : `${d.hotels.length} stays`}`);
}

// Photo banner at the top of inner pages (destinations, categories, cities, search, offers)
function pageBanner({ image, crumbsHTML = "", label = "", title, sub = "", stats = [], extra = "" }) {
  return `
    <section class="page-banner">
      ${image ? pic(image, "", { sizes: FULL, widths: [960, 1440], eager: true }) : ""}
      <div class="wrap page-banner__inner">
        ${crumbsHTML.replace('class="crumbs wrap"', 'class="crumbs"')}
        ${label ? `<p class="label label--light">${label}</p>` : ""}
        <h1>${title}</h1>
        ${sub ? `<p class="lead">${sub}</p>` : ""}
        ${extra}
        ${stats.length ? `<ul class="stats">${stats.map(([v, l]) => `<li><strong>${esc(v)}</strong>${esc(l)}</li>`).join("")}</ul>` : ""}
      </div>
    </section>`;
}

// Counts like "12 hotels · 8 cities" for a group of hotels
function countStats(hotels) {
  const cities = new Set(hotels.map(n => n.data.city)).size;
  const states = new Set(hotels.map(n => n.data.state)).size;
  const types = root.children.map(c => [hotels.filter(n => n.category === c).length, c.name.toLowerCase()]).filter(([n]) => n);
  return [
    [hotels.length, hotels.length === 1 ? "stay" : "stays"],
    ...(types.length > 1 ? types : []),
    ...(cities > 1 ? [[cities, "cities"]] : []),
    ...(states > 1 ? [[states, "states"]] : [])
  ];
}

// A tinted section with a sideways row of destination cards
function destinationsRow(list, label, title) {
  if (!list.length || !on("destinations")) return "";
  return `
    <section class="section section--compact section--tint">
      <div class="wrap">
        <div class="section__row">
          <div><p class="label">${label}</p><h2>${title}</h2></div>
          <a class="link" href="/destinations/">All destinations ${icon("arrow")}</a>
          ${list.length > 4 ? scrollButtons() : ""}
        </div>
        <div class="cards--row pcards">${list.map(destinationCard).join("")}</div>
      </div>
    </section>`;
}

// Other destinations, closest first (same state, then the rest)
const otherDestinations = (state, except = []) =>
  [...destinations.filter(d => d.state === state), ...destinations.filter(d => d.state !== state)].filter(d => !except.includes(d.name));

// All destinations, grouped by state
function destinationsPage() {
  const states = [...new Set(destinations.map(d => d.state))].sort();
  return `
    ${pageBanner({
      image: SITE.heroImage,
      crumbsHTML: simpleCrumbs([], "Destinations"),
      label: "Destinations",
      title: "Where <em>we are</em>",
      sub: `From riverside Rishikesh to the hills of Manali, find a stay in ${plural(destinations.length, "destination")}.`,
      stats: countStats(allHotels)
    })}
    <section class="section section--compact">
      <div class="wrap">
        ${states.map(s => `
          <div class="group">
            <div class="section__row"><div><p class="label">${plural(destinations.filter(d => d.state === s).length, "destination")}</p><h2>${esc(s)}</h2></div></div>
            <div class="pcards pcards--grid${destinations.filter(d => d.state === s).length <= 3 ? " pcards--few" : ""}">${destinations.filter(d => d.state === s).map(destinationCard).join("")}</div>
          </div>`).join("")}
      </div>
    </section>`;
}

// One city: all its hotels, whatever their type
function destinationPage(d) {
  return `
    ${pageBanner({
      image: d.hotels[0].data.image,
      crumbsHTML: simpleCrumbs([["Destinations", "/destinations/"]], d.name),
      label: esc(d.state),
      title: `Stays in <em>${esc(d.name)}</em>`,
      sub: `Handpicked ${d.hotels.length === 1 ? "stay" : "hotels and resorts"} in ${esc(d.name)}, ${esc(d.state)}.`,
      stats: countStats(d.hotels)
    })}
    <section class="section section--compact">
      <div class="wrap">
        <div class="section__row"><div><p class="label">${plural(d.hotels.length, "stay")}</p><h2>Where to stay in <em>${esc(d.name)}</em></h2></div></div>
        <div class="cards">${[...d.hotels].sort(SORTERS.popular).map(hotelCard).join("")}</div>
      </div>
    </section>
    ${destinationsRow(otherDestinations(d.state, [d.name]), "Keep exploring", "More places <em>to visit</em>")}`;
}

// Every hotel that has an offer
function offersPage() {
  const hotels = hotelsWithOffers();
  return `
    ${pageBanner({
      image: hotels[0]?.data.image || SITE.heroImage,
      crumbsHTML: simpleCrumbs([], "Offers"),
      label: "Offers",
      title: "Current <em>offers</em>",
      sub: "Book direct to get these offers. Ask us on WhatsApp for details."
    })}
    <section class="section section--compact">
      <div class="wrap"><div class="cards">${hotels.map(hotelCard).join("")}</div></div>
    </section>
    ${destinationsRow(destinations, "Destinations", "Where <em>to next?</em>")}`;
}

// Search & browse all hotels. The results are filled in here too, so the
// pre-built page already lists every hotel for Google.
function hotelsPage(params) {
  const q = params.get("q") || "";
  const type = params.get("type") || "";
  const results = findHotels(q, type).sort(SORTERS[params.get("sort")] || SORTERS.popular);
  return `
    ${pageBanner({
      image: SITE.heroImage,
      crumbsHTML: simpleCrumbs([], "Find a hotel"),
      label: "All stays",
      title: "Find <em>a hotel</em>",
      sub: "Search by city, state or hotel name.",
      extra: searchBox(q, false)
    })}
    <section class="section section--compact">
      <div class="wrap">
        <div class="filters">
          <div class="chips" role="group" aria-label="Hotel type">
            <button class="chip" data-type="">All</button>
            ${root.children.map(c => `<button class="chip" data-type="${c.slug}">${esc(c.name)}</button>`).join("")}
          </div>
          <label class="sort">Sort by
            <select id="sort">
              <option value="popular">Popular</option>
              ${on("prices") ? `<option value="price">Price: low to high</option>` : ""}
              ${on("ratings") ? `<option value="rating">Guest rating</option>` : ""}
              <option value="new">Newest</option>
            </select>
          </label>
        </div>
        <p class="muted" id="resultCount" aria-live="polite"></p>
        <div class="cards" id="results">${results.map(hotelCard).join("")}</div>
      </div>
    </section>`;
}

// Category, state or city: what's one level down, plus all their hotels
function listPage(node) {
  const hotels = [...hotelsIn(node)].sort(SORTERS.popular);
  const where = node.type === "category" ? "" : ` in <em>${esc(node.name)}</em>`;
  const sub = node.type === "category" ? esc(node.data.description || node.data.tagline || "")
    : `${categoryOf(node).name} across ${esc(node.name)}${node.type === "state" ? `: ${node.children.map(c => esc(c.name)).join(", ")}` : ""}.`;
  const childLabel = node.type === "category" ? "By state" : "By city";

  return `
    ${pageBanner({
      image: node.type === "category" ? node.data.image : hotels[0].data.image,
      crumbsHTML: crumbs(node),
      label: esc(categoryOf(node).name),
      title: node.type === "category" ? esc(node.name) : `${esc(categoryOf(node).name)}${where}`,
      sub,
      stats: countStats(hotels)
    })}
    ${node.type !== "city" && node.children.length > 1 ? `
    <section class="section section--compact">
      <div class="wrap">
        <div class="section__row"><div><p class="label">${childLabel}</p><h2>Choose <em>${node.type === "category" ? "a state" : "a city"}</em></h2></div></div>
        <div class="pcards pcards--grid${node.children.length <= 3 ? " pcards--few" : ""}">${node.children.map(placeCard).join("")}</div>
      </div>
    </section>` : ""}
    <section class="section section--compact${node.type !== "city" && node.children.length > 1 ? " section--tint" : ""}">
      <div class="wrap">
        <div class="section__row"><div><p class="label">${plural(hotels.length, "stay")}</p><h2>All ${esc(categoryOf(node).name.toLowerCase())}${where}</h2></div></div>
        <div class="cards">${hotels.map(hotelCard).join("")}</div>
      </div>
    </section>
    ${node.type === "city" ? destinationsRow(otherDestinations(hotels[0].data.state, [hotels[0].data.city]), "Keep exploring", "More places <em>to visit</em>") : ""}`;
}

function hotelPage(node) {
  const h = node.data;
  const price = shownPrice(h);
  const rating = shownRating(h);
  const phone = h.phone || SITE.phone;
  const reviews = on("hotelReviews") ? allReviews.filter(r => r.hotel === h.id) : [];
  const nearby = hotelsIn(node.parent).filter(n => n !== node);
  const more = !on("nearbyHotels") ? [] : nearby.length ? nearby : hotelsIn(node.parent.parent).filter(n => n !== node);
  const moreTitle = nearby.length ? `More in <em>${esc(h.city)}</em>` : `More in <em>${esc(h.state)}</em>`;
  const glance = {
    ...(h.details || {}),
    ...(h.address ? { "Address": h.address } : {}),
    ...(h.phone ? { "Phone": h.phone } : {}),
    ...(h.email ? { "Email": h.email } : {})
  };
  // Longer "about" text: paragraphs split on sentence groups of about 3
  // (the opening lines are already shown at the top of the page, so they're skipped here)
  const aboutText = (h.about || "").startsWith(h.description || "\0") ? h.about.slice(h.description.length).trim() : h.about || "";
  const about = on("aboutText") && aboutText
    ? (aboutText.match(/[^.!?]+[.!?]+(\s|$)/g) || [aboutText]).reduce((paras, s, i) => {
        if (i % 3 === 0) paras.push("");
        paras[paras.length - 1] += s;
        return paras;
      }, []).map(p => `<p>${esc(p.trim())}</p>`).join("")
    : "";
  const rooms = on("rooms") ? h.rooms || [] : [];
  const live = on("liveWeather") && h.location;
  const enquire = on("bookingForm")
    ? `<a href="#" class="btn" data-scroll="reserve">Check availability</a>`
    : `<a href="${whatsappLink(h.whatsapp)}" class="btn" target="_blank" rel="noopener">Enquire on WhatsApp</a>`;

  // All photos of the hotel: the main photo first, then the gallery
  const photos = [...new Set([h.image, ...(on("gallery") ? h.gallery || [] : [])])];
  const MOSAIC = 5;
  const glanceList = Object.entries(glance).filter(([k]) => k !== "Phone" && k !== "Email");

  return `
    ${crumbs(node)}

    <section class="wrap hotel-head">
      <p class="card__meta">${typeTag(node.category, true)}${icon("pin")}<span>${on("destinations")
        ? `<a href="/destinations/${slug(h.city)}/">${esc(h.city)}</a>` : esc(h.city)}, ${esc(h.state)}</span></p>
      <h1>${esc(h.name)}</h1>
      ${h.tagline ? `<p class="tagline">${esc(h.tagline)}</p>` : ""}
    </section>

    <section class="wrap mosaic mosaic--${Math.min(photos.length, MOSAIC)}">
      ${photos.map((g, i) => `
        <button type="button" class="gallery__item${i >= MOSAIC ? " is-more" : ""}" data-full="${esc(isResizable(g) ? sized(g, 2000) : asset(g))}" aria-label="Open photo ${i + 1} of ${photos.length}">
          ${pic(g, `${h.name}, photo ${i + 1}`, i === 0
            ? { sizes: "(max-width: 600px) 320px, (max-width: 860px) 100vw, 700px", widths: [480, 960, 1440], eager: true }
            : { sizes: "(max-width: 860px) 50vw, 300px", widths: [320, 480, 720], ar: "4:3" })}
        </button>`).join("")}
      ${photos.length > 1 ? `<button type="button" class="mosaic__all" data-open-gallery>${icon("photos")} Show all ${photos.length} photos</button>` : ""}
    </section>

    <div class="wrap hotel-layout">
      <div class="hotel-main">
        ${h.offer && on("offers") ? `<p class="offer">✦ ${esc(h.offer)}</p>` : ""}
        ${h.description ? `<p class="lead">${esc(h.description)}</p>` : ""}

        ${h.highlights?.length ? `
        <div class="block">
          <h2 class="h3">What this place offers</h2>
          <ul class="amenities">${h.highlights.map(x => `<li>${icon("check")}${esc(x)}</li>`).join("")}</ul>
        </div>` : ""}

        ${about ? `<div class="block"><h2 class="h3">About the hotel</h2><div class="about__text">${about}</div></div>` : ""}

        ${rooms.length ? `
        <div class="block">
          <h2 class="h3">Rooms &amp; suites</h2>
          <div class="cards cards--rooms">
            ${rooms.map(r => {
              const price = r.price && on("prices") ? `from <strong>${inr(r.price)}</strong>` : "";
              const reserve = on("bookingForm") ? `<a href="#" class="card__go card__go--text" data-scroll="reserve" data-room="${esc(r.name)}">Reserve</a>` : "";
              return `
              <article class="card card--static">
                <div class="card__img">${pic(r.image || h.image, r.name, { sizes: "(max-width: 860px) 92vw, 360px", widths: [320, 480, 720], ar: "4:3" })}</div>
                <div class="card__body">
                  <h3>${esc(r.name)}</h3>
                  ${r.specs ? `<p class="card__text card__text--full">${esc(r.specs)}</p>` : ""}
                  ${price || reserve ? `<div class="card__foot"><span>${price}</span>${reserve}</div>` : ""}
                </div>
              </article>`;
            }).join("")}
          </div>
        </div>` : ""}

        ${on("hotelSections") && h.sections?.length ? `
        <div class="block">
          <h2 class="h3">Dine, celebrate &amp; unwind</h2>
          <div class="features">
            ${h.sections.map(s => `
              <article class="feature">
                ${s.image ? `<div class="feature__img">${pic(s.image, s.title, { sizes: "(max-width: 860px) 92vw, 340px", widths: [480, 720], ar: "3:2" })}</div>` : ""}
                <div>
                  <h3>${esc(s.title)}</h3>
                  ${s.text ? `<p>${esc(s.text)}</p>` : ""}
                </div>
              </article>`).join("")}
          </div>
        </div>` : ""}
      </div>

      <aside class="hotel-side">
        <div class="side-card">
          ${price ? `<p class="side-card__price">from <strong>${inr(price)}</strong> <span>/ night</span></p>` : `<p class="side-card__title">Plan your stay</p>`}
          ${rating ? `<p class="rating">★ ${rating} guest rating</p>` : ""}
          ${live ? `<p class="side-card__live"><span id="localTime">--:--</span> local time<span id="weather"></span></p>` : ""}
          ${enquire.replace('class="btn"', 'class="btn btn--block"')}
          <a href="tel:${esc(phone.replace(/\s/g, ""))}" class="btn btn--ghost btn--block">${icon("phone")} Call ${esc(phone)}</a>
          ${glanceList.length ? `
          <dl class="glance">
            ${glanceList.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}
          </dl>` : ""}
          ${h.address ? `<a class="link" href="https://maps.google.com/?q=${encodeURIComponent(h.name + ", " + h.address)}" target="_blank" rel="noopener">${icon("map")} Get directions</a>` : ""}
        </div>
      </aside>
    </div>

    ${on("experiences") && h.experiences?.length ? `
    <section class="section section--dark section--compact">
      <div class="wrap">
        <div class="section__head"><p class="label">Experiences</p><h2>A day here, <em>unhurried</em></h2></div>
        <ol class="day">
          ${h.experiences.map(x => `
            <li>
              ${x.image ? pic(x.image, x.title, { sizes: "(max-width: 1000px) 45vw, 360px", widths: [360, 540], ar: "3:2" }) : ""}
              ${x.time ? `<time>${esc(x.time)}</time>` : ""}<h3>${esc(x.title)}</h3>
              ${x.text ? `<p>${esc(x.text)}</p>` : ""}
            </li>`).join("")}
        </ol>
      </div>
    </section>` : ""}

    ${reviews.length ? `
    <section class="section section--compact">
      <div class="wrap">
        <div class="section__head"><p class="label">Guest reviews</p><h2>What <em>guests say</em></h2></div>
        <div class="quotes">${reviews.map(r => reviewCard(r)).join("")}</div>
      </div>
    </section>` : ""}

    ${on("bookingForm") ? reserveSection(h, rooms) : ""}

    ${more.length ? shelf("Nearby", moreTitle, more.slice(0, 4)) : ""}`;
}

// Suggestions for the country-code box (any code can still be typed)
const COUNTRY_CODES = [
  ["91", "India"], ["1", "USA / Canada"], ["44", "United Kingdom"], ["971", "UAE"], ["966", "Saudi Arabia"],
  ["974", "Qatar"], ["965", "Kuwait"], ["968", "Oman"], ["973", "Bahrain"], ["977", "Nepal"], ["94", "Sri Lanka"],
  ["880", "Bangladesh"], ["975", "Bhutan"], ["960", "Maldives"], ["65", "Singapore"], ["60", "Malaysia"],
  ["66", "Thailand"], ["61", "Australia"], ["64", "New Zealand"], ["49", "Germany"], ["33", "France"],
  ["39", "Italy"], ["34", "Spain"], ["31", "Netherlands"], ["41", "Switzerland"], ["7", "Russia"],
  ["81", "Japan"], ["82", "South Korea"], ["86", "China"], ["27", "South Africa"]
];

// The booking "letter". The room choice only appears if the hotel lists rooms.
function reserveSection(h, rooms) {
  return `
    <section class="section section--tint" id="reserve">
      <div class="wrap reserve">
        <div>
          <p class="label">Reserve</p>
          <h2>Write to us. <em>We'll do the rest.</em></h2>
          <ul class="perks">${(SITE.perks || []).map(p => `<li>${esc(p.title)}</li>`).join("")}</ul>
        </div>

        <form class="letter" id="reserveForm" novalidate>
          <p class="sentence">
            Hello ${esc(h.name)}, I'd like to stay from
            <button type="button" class="blank blank--date is-empty" data-open="in" aria-haspopup="dialog" aria-controls="cal">
              <span class="sr-only">Check-in date:</span><span data-show="checkin">pick a date</span></button>
            until
            <button type="button" class="blank blank--date is-empty" data-open="out" aria-haspopup="dialog" aria-controls="cal">
              <span class="sr-only">Check-out date:</span><span data-show="checkout">pick a date</span></button>,
            <input type="hidden" name="checkin"><input type="hidden" name="checkout">
            with
            <label class="blank"><span class="sr-only">Guests</span><select name="guests">
              <option>just me</option><option selected>two of us</option><option>three of us</option><option>a family of four</option>
            </select></label>${rooms.length ? `
            in the
            <label class="blank"><span class="sr-only">Room</span><select name="room">
              ${rooms.map(r => `<option data-price="${r.price || ""}">${esc(r.name)}</option>`).join("")}
            </select></label>` : ""}.
            My name is
            <label class="blank"><span class="sr-only">Your name</span><input type="text" name="name" placeholder="your name" autocomplete="name" maxlength="40"></label>
            and my mobile number is
            <span class="blank blank--phone" role="group" aria-label="Mobile number with country code"><span class="prefix" aria-hidden="true">+</span><input class="cc" name="cc" value="91" maxlength="4" inputmode="numeric" list="ccList" autocomplete="tel-country-code" aria-label="Country code"><input type="tel" name="phone" placeholder="9876543210" autocomplete="tel-national" inputmode="numeric" aria-label="Mobile number"></span>.
          </p>
          <datalist id="ccList">${COUNTRY_CODES.map(([code, country]) => `<option value="${code}">${country}</option>`).join("")}</datalist>

          <div class="cal" id="cal" role="dialog" aria-label="Choose your dates" hidden>
            <div class="cal__head">
              <button type="button" class="cal__nav" data-step="-1" aria-label="Previous month">‹</button>
              <p class="cal__hint" id="calHint" aria-live="polite"></p>
              <button type="button" class="cal__nav" data-step="1" aria-label="Next month">›</button>
            </div>
            <div class="cal__months" id="calMonths"></div>
            <div class="cal__foot">
              <span id="calNights"></span>
              <button type="button" class="cal__clear" id="calClear">Clear</button>
              <button type="button" class="btn btn--small" id="calDone">Done</button>
            </div>
          </div>

          ${on("priceEstimate") && on("prices") ? `<p class="estimate" id="estimate" aria-live="polite"></p>` : ""}
          <p class="form-error" id="formError" role="alert"></p>
          <button type="submit" class="btn">Send request on WhatsApp</button>
        </form>
      </div>
    </section>`;
}

function notFoundPage() {
  return `
    <section class="section section--top">
      <div class="wrap">
        <h1 class="h2">We couldn't find <em>that page.</em></h1>
        <p class="muted">The hotel may have moved. <a class="link" href="${on("search") ? searchHref() : "/"}">See all hotels →</a></p>
      </div>
    </section>`;
}

// ==========================================================
// 4. Which page is this address?
// ==========================================================
function resolveRoute(pathname, search = "") {
  const parts = pathname.split("/").filter(Boolean);
  const params = new URLSearchParams(search);
  // Old addresses from a previous website (REDIRECTS in data/hotels.js)
  if (typeof REDIRECTS !== "undefined" && REDIRECTS[pathname]) return { page: "redirect", to: REDIRECTS[pathname] };
  if (!parts.length) return { page: "home", node: root };
  if (parts.length === 1 && parts[0] === "search") return on("search") ? { page: "search", params } : { page: "notfound" };
  if (parts[0] === "offers" && parts.length === 1) return showOffersPage() ? { page: "offers" } : { page: "notfound" };
  if (parts[0] === "destinations" && on("destinations")) {
    if (parts.length === 1) return { page: "destinations" };
    const d = parts.length === 2 && destinations.find(x => x.slug === parts[1]);
    return d ? { page: "destination", destination: d } : { page: "notfound" };
  }
  if (parts[0] === "hotel") {
    const node = parts.length === 2 && hotelsById[parts[1]];
    return node ? { page: "hotel", node } : { page: "notfound" };
  }
  let node = root;
  for (const p of parts) {
    node = node.children.find(n => n.slug === p);
    if (!node) return { page: "notfound" };
  }
  // A level with only one choice: send the visitor straight to that choice
  if (settle(node) !== node) return { page: "redirect", to: href(node) };
  return { page: "list", node };
}

// Every page address on the site (build.js makes one file per address)
function allPaths() {
  const treePath = node => "/" + [...ancestors(node), node].map(n => n.slug).join("/") + "/";
  return [
    "/",
    ...allNodes().filter(n => n.type !== "root").map(n => n.type === "hotel" ? href(n) : treePath(n)),
    ...(on("search") ? ["/search/"] : []),
    ...(on("destinations") ? ["/destinations/", ...destinations.map(destHref)] : []),
    ...(showOffersPage() ? ["/offers/"] : [])
  ];
}

function renderPage(route) {
  switch (route.page) {
    case "home": return homePage();
    case "search": return hotelsPage(route.params);
    case "destinations": return destinationsPage();
    case "destination": return destinationPage(route.destination);
    case "offers": return offersPage();
    case "list": return listPage(route.node);
    case "hotel": return hotelPage(route.node);
    default: return notFoundPage();
  }
}

// ==========================================================
// 5. Search engine details for each page: title, description and
//    structured data (schema.org) that Google uses for rich results
// ==========================================================
const absUrl = path => SITE.url.replace(/\/$/, "") + path;
const absImg = url => isResizable(url) ? sized(url, 1200, "1.91:1") : /^https?:/.test(url) ? url : absUrl(asset(url));
const clip = (s, n = 155) => s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…";
const BRAND = () => SITE.brand || `${SITE.name} ${SITE.tagline}`;   // full brand name for titles

function breadcrumbData(node) {
  const trail = [root, ...ancestors(node), node];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((n, i) => ({ "@type": "ListItem", position: i + 1, name: n.name, item: absUrl(href(n)) }))
  };
}

function hotelData(node) {
  const h = node.data;
  const price = lowestPrice(h);
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: h.name,
    description: h.description || h.tagline,
    url: absUrl(href(node)),
    image: [absImg(h.image)],
    telephone: h.phone || SITE.phone,
    email: h.email || SITE.email,
    address: { "@type": "PostalAddress", streetAddress: h.address, addressLocality: h.city, addressRegion: h.state, addressCountry: h.country || "IN" },
    geo: h.location ? { "@type": "GeoCoordinates", latitude: h.location.lat, longitude: h.location.lon } : undefined,
    priceRange: price ? `From ${inr(price)} per night` : undefined,
    amenityFeature: h.highlights?.map(x => ({ "@type": "LocationFeatureSpecification", name: x, value: true })),
    brand: { "@type": "Brand", name: SITE.name }
  };
}

function pageMeta(route) {
  const cities = new Set(allHotels.map(n => n.data.city));
  switch (route.page) {
    case "home":
      return {
        title: `${BRAND()} | ${SITE.tagline} in ${destinations.slice(0, 3).map(d => d.name).join(", ")} & more`,
        description: clip(`${SITE.intro} ${plural(allHotels.length, "hotel")} in ${plural(cities.size, "city", "cities")}. Book direct for the best rate.`),
        path: "/",
        image: SITE.heroImage,
        data: [
          { "@context": "https://schema.org", "@type": "WebSite", name: BRAND(), alternateName: SITE.name, url: absUrl("/") },
          { "@context": "https://schema.org", "@type": "Organization", name: BRAND(), url: absUrl("/"), telephone: SITE.phone, email: SITE.email }
        ]
      };
    case "search":
      return {
        title: `Find a hotel | ${BRAND()}`,
        description: clip(`Search all ${plural(allHotels.length, "hotel")} by ${SITE.name} in ${[...cities].join(", ")}.`),
        path: "/search/",
        image: SITE.heroImage
      };
    case "destinations":
      return {
        title: `Destinations | ${BRAND()}`,
        description: clip(`Hotels by ${SITE.name} in ${destinations.map(d => d.name).join(", ")}.`),
        path: "/destinations/",
        image: SITE.heroImage
      };
    case "destination": {
      const d = route.destination;
      return {
        title: `Hotels in ${d.name}, ${d.state} | ${BRAND()}`,
        description: clip(`${plural(d.hotels.length, "hotel")} in ${d.name}: ${d.hotels.map(n => n.name).join(", ")}. Book direct with ${SITE.name}.`),
        path: destHref(d),
        image: d.hotels[0].data.image,
        data: [{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [["Home", "/"], ["Destinations", "/destinations/"], [d.name, destHref(d)]]
            .map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: absUrl(path) }))
        }]
      };
    }
    case "offers":
      return {
        title: `Offers | ${BRAND()}`,
        description: clip(`Current offers at ${hotelsWithOffers().map(n => n.name).join(", ")}. Book direct with ${SITE.name}.`),
        path: "/offers/",
        image: hotelsWithOffers()[0]?.data.image || SITE.heroImage
      };
    case "list": {
      const node = route.node;
      const hotels = hotelsIn(node);
      const where = node.type === "city" ? `${node.name}, ${node.parent.name}` : node.name;
      return {
        title: node.type === "category" ? `${node.name} | ${BRAND()}` : `Hotels in ${where} | ${BRAND()}`,
        description: clip(node.type === "category" && node.data.description
          ? `${node.data.description} ${hotels.map(n => n.name).join(", ")}.`
          : `${plural(hotels.length, "hotel")} in ${where}: ${hotels.map(n => n.name).join(", ")}. Book direct with ${SITE.name}.`),
        path: href(node),
        image: hotels[0].data.image,
        data: [breadcrumbData(node)]
      };
    }
    case "hotel": {
      const h = route.node.data;
      return {
        title: `${h.name}, ${h.city} | ${BRAND()}`,
        description: clip([h.tagline, h.description].filter(Boolean).join(". ")),
        path: href(route.node),
        image: h.image,
        data: [hotelData(route.node), breadcrumbData(route.node)]
      };
    }
    default:
      return { title: `Page not found | ${BRAND()}`, description: SITE.intro, noindex: true };
  }
}

// The <head> tags for a page
function headTags(meta) {
  const url = meta.path && absUrl(meta.path);
  return [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}">`,
    url ? `<link rel="canonical" href="${esc(url)}">` : "",
    meta.noindex ? `<meta name="robots" content="noindex">` : "",
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${esc(BRAND())}">`,
    `<meta property="og:title" content="${esc(meta.title)}">`,
    `<meta property="og:description" content="${esc(meta.description)}">`,
    url ? `<meta property="og:url" content="${esc(url)}">` : "",
    meta.image ? `<meta property="og:image" content="${esc(absImg(meta.image))}">` : "",
    `<meta name="twitter:card" content="summary_large_image">`,
    ...(meta.data || []).map(d => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, "\\u003c")}</script>`)
  ].filter(Boolean).join("\n  ");
}
