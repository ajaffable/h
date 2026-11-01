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
const CARD_IMG = { sizes: "(max-width: 860px) 45vw, 270px", ar: "4:5" };

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

function hotelCard(node) {
  const h = node.data;
  const price = shownPrice(h);
  const rating = shownRating(h);
  return `
    <a class="card" href="${href(node)}">
      <div class="arch card__img">${pic(h.image, h.name, CARD_IMG)}${badgeFor(h)}</div>
      <p class="card__meta">${typeTag(node.category)}${esc(h.city)}</p>
      <h3>${esc(h.name)}</h3>
      ${h.tagline ? `<p class="card__text">${esc(h.tagline)}</p>` : ""}
      ${price || rating ? `
      <div class="card__foot card__foot--row">
        <span>${price ? `from <strong>${inr(price)}</strong>` : ""}</span>
        ${rating ? `<span class="rating" aria-label="Rated ${rating} out of 5">★ ${rating}</span>` : ""}
      </div>` : ""}
    </a>`;
}

// A card for a state or a city
function placeCard(node) {
  const hotels = hotelsIn(node);
  const target = settle(node);
  const sub = node.type === "state" && node.children.length > 1
    ? `${plural(hotels.length, "hotel")} · ${node.children.map(c => esc(c.name)).join(", ")}`
    : target.type === "hotel" ? esc(target.name) : plural(hotels.length, "hotel");
  return `
    <a class="card" href="${href(node)}">
      <div class="arch card__img">${pic(hotels[0].data.image, node.name, CARD_IMG)}</div>
      <h3>${esc(node.name)}</h3>
      <p class="card__text">${sub}</p>
      <div class="card__foot"><span></span><span class="card__go">Explore →</span></div>
    </a>`;
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
          ${more}
        </div>
        <div class="cards cards--row">${nodes.map(hotelCard).join("")}</div>
      </div>
    </section>`;
}

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

function footerHTML() {
  return `
  <div class="wrap footer__grid">
    <div>
      <a href="/" class="logo">${esc(SITE.name)}</a>
      <p>${esc(SITE.intro)}</p>
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
         <a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a><br>
         <a href="${esc(SITE.instagram)}">Instagram</a> · <a href="${esc(SITE.facebook)}">Facebook</a></p>
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

  return `
    <section class="hero">
      <div class="wrap hero__grid">
        <div>
          <p class="label">${esc(SITE.tagline)}</p>
          <h1>${esc(SITE.headline || "Stays across India,")} <em>${esc(SITE.headlineEm || "chosen with care.")}</em></h1>
          <p class="lead">${esc(SITE.intro)}</p>
          ${on("search") ? searchBox() : `<div class="hero__actions"><a class="btn" href="#" data-scroll="types">Explore our hotels</a></div>`}
          ${on("popularCities") && (on("search") || on("destinations")) ? `
          <p class="quick">
            <span>Popular:</span>
            ${topCities(5).map(c => `<a href="${cityHref(c)}">${esc(c)}</a>`).join("")}
          </p>` : ""}
          ${statsRow()}
        </div>
        <div class="arch hero__img">${pic(SITE.heroImage, "", { widths: [480, 720, 960], sizes: "(max-width: 860px) 90vw, 480px", ar: "1:1", eager: true })}</div>
      </div>
    </section>

    ${shelf("Welcome back", "Recently <em>viewed</em>", recent)}

    ${on("homeDestinations") && destinations.length > 1 ? `
    <section class="section section--compact">
      <div class="wrap">
        <div class="section__row">
          <div><p class="label">Destinations</p><h2>Where <em>to next?</em></h2></div>
          ${on("destinations") && destinations.length > 8 ? `<a class="link" href="/destinations/">All ${destinations.length} destinations →</a>` : ""}
        </div>
        <div class="cards cards--row">${destinations.slice(0, 8).map(destinationCard).join("")}</div>
      </div>
    </section>` : ""}

    ${shelf("Guest favourites", "Popular <em>hotels</em>", popular,
      on("search") ? `<a class="link" href="${searchHref()}">See all ${allHotels.length} hotels →</a>` : "")}

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
                <div class="arch type__img">${pic(c.data.image, c.name, { sizes: "(max-width: 860px) 35vw, 200px", widths: [240, 400], ar: "4:5" })}</div>
                <div>
                  <h3>${esc(c.name)}</h3>
                  <p class="card__text">${esc(c.data.tagline || "")}</p>
                  <p class="card__meta">${plural(hotels.length, "hotel")} · ${plural(cities, "city", "cities")}</p>
                  <span class="card__go">Explore →</span>
                </div>
              </a>`;
          }).join("")}
        </div>
      </div>
    </section>` : ""}

    ${shelf("Just opened", "Newly <em>added</em>", latest)}

    ${on("whyBookWithUs") && SITE.perks?.length ? `
    <section class="section section--dark section--compact">
      <div class="wrap">
        <div class="section__row"><div><p class="label">Why book with us</p><h2>Book direct, <em>stay better</em></h2></div></div>
        <ul class="perks-grid">
          ${SITE.perks.map(p => `<li><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`).join("")}
        </ul>
      </div>
    </section>` : ""}

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
  return `
    <a class="card" href="${cityHref(d.name)}">
      <div class="arch card__img">${pic(d.hotels[0].data.image, d.name, CARD_IMG)}</div>
      <p class="card__meta">${esc(d.state)}</p>
      <h3>${esc(d.name)}</h3>
      <p class="card__text">${d.hotels.length === 1 ? esc(d.hotels[0].name) : plural(d.hotels.length, "hotel")}</p>
      <div class="card__foot card__foot--row">
        <span>${[...new Set(d.hotels.map(n => n.category))].map(c => typeTag(c)).join("")}</span>
        <span class="card__go">See →</span>
      </div>
    </a>`;
}

// All destinations, ordered by state
function destinationsPage() {
  const states = new Set(destinations.map(d => d.state));
  const byState = [...destinations].sort((a, b) => a.state.localeCompare(b.state) || a.name.localeCompare(b.name));
  return `
    ${simpleCrumbs([], "Destinations")}
    <section class="section section--top">
      <div class="wrap">
        <div class="section__head">
          <p class="label">Destinations</p>
          <h1 class="h2">Where <em>we are</em></h1>
          <p class="muted">${plural(allHotels.length, "hotel")} in ${plural(destinations.length, "destination")} across ${plural(states.size, "state")}.</p>
        </div>
        <div class="cards">${byState.map(destinationCard).join("")}</div>
      </div>
    </section>`;
}

// One city: all its hotels, whatever their type
function destinationPage(d) {
  const others = destinations.filter(x => x !== d && x.state === d.state);
  return `
    ${simpleCrumbs([["Destinations", "/destinations/"]], d.name)}
    <section class="section section--top">
      <div class="wrap">
        <div class="section__head">
          <p class="label">${esc(d.state)}</p>
          <h1 class="h2">Hotels in <em>${esc(d.name)}</em></h1>
          <p class="muted">${plural(d.hotels.length, "hotel")} in ${esc(d.name)}, ${esc(d.state)}.</p>
        </div>
        <div class="cards">${[...d.hotels].sort(SORTERS.popular).map(hotelCard).join("")}</div>
        ${others.length ? `
        <p class="quick quick--spaced"><span>Also in ${esc(d.state)}:</span>${others.map(x => `<a href="${destHref(x)}">${esc(x.name)}</a>`).join("")}</p>` : ""}
      </div>
    </section>`;
}

// Every hotel that has an offer
function offersPage() {
  const hotels = hotelsWithOffers();
  return `
    ${simpleCrumbs([], "Offers")}
    <section class="section section--top">
      <div class="wrap">
        <div class="section__head">
          <p class="label">Offers</p>
          <h1 class="h2">Current <em>offers</em></h1>
          <p class="muted">Book direct to get these offers. Ask us on WhatsApp for details.</p>
        </div>
        <div class="cards">${hotels.map(hotelCard).join("")}</div>
      </div>
    </section>`;
}

// Search & browse all hotels. The results are filled in here too, so the
// pre-built page already lists every hotel for Google.
function hotelsPage(params) {
  const q = params.get("q") || "";
  const type = params.get("type") || "";
  const results = findHotels(q, type).sort(SORTERS[params.get("sort")] || SORTERS.popular);
  return `
    ${simpleCrumbs([], "Find a hotel")}
    <section class="section section--top">
      <div class="wrap">
        <h1 class="h2">Find <em>a hotel</em></h1>
        ${searchBox(q, !q)}
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

// Category, state or city: a grid of whatever is one level down
function listPage(node) {
  const hotels = hotelsIn(node);
  const title = node.type === "category" ? esc(node.name) : `Hotels in <em>${esc(node.name)}</em>`;
  const intro = node.type === "category" ? esc(node.data.description || "")
    : node.type === "state" ? `${plural(hotels.length, "hotel")} across ${plural(node.children.length, "city", "cities")} in ${esc(node.name)}.`
    : `${plural(hotels.length, "hotel")} in ${esc(node.name)}.`;
  const cards = node.type === "city" ? node.children.map(hotelCard) : node.children.map(placeCard);

  return `
    ${crumbs(node)}
    <section class="section section--top">
      <div class="wrap">
        <div class="section__head">
          <p class="label">${esc(categoryOf(node).name)}</p>
          <h1 class="h2">${title}</h1>
          <p class="muted">${intro}</p>
        </div>
        <div class="cards">${cards.join("")}</div>
      </div>
    </section>`;
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

  return `
    ${crumbs(node)}

    <section class="hero hero--hotel">
      <div class="wrap hero__grid">
        <div>
          <p class="label">${typeTag(node.category, true)}${on("destinations")
            ? `<a href="/destinations/${slug(h.city)}/">${esc(h.city)}</a>` : esc(h.city)}, ${esc(h.state)}</p>
          <h1>${esc(h.name)}</h1>
          ${h.tagline ? `<p class="tagline">${esc(h.tagline)}</p>` : ""}
          ${h.offer && on("offers") ? `<p class="offer">✦ ${esc(h.offer)}</p>` : ""}
          ${h.description ? `<p class="lead">${esc(h.description)}</p>` : ""}
          <div class="hero__actions">
            ${enquire}
            <a href="tel:${esc(phone.replace(/\s/g, ""))}" class="link">Call ${esc(phone)}</a>
          </div>
          <p class="hero__live label">
            ${price ? `<span>From ${inr(price)} / night</span>` : ""}
            ${rating ? `<span>★ ${rating} guest rating</span>` : ""}
            ${live ? `<span><span id="localTime">--:--</span> local time<span id="weather"></span></span>` : ""}
          </p>
        </div>
        <div class="arch hero__img">${pic(h.image, h.name, { widths: [480, 720, 960], sizes: "(max-width: 860px) 90vw, 480px", ar: "1:1", eager: true })}</div>
      </div>
      ${h.highlights?.length ? `<ul class="wrap highlights">${h.highlights.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
    </section>

    ${Object.keys(glance).length || about ? `
    <section class="section section--compact">
      <div class="wrap${about ? " about" : ""}">
        ${about ? `<div><p class="label">About the hotel</p><div class="about__text">${about}</div></div>` : ""}
        <div>
          ${about ? `<p class="label">At a glance</p>` : `<div class="section__head"><p class="label">At a glance</p><h2>Good <em>to know</em></h2></div>`}
          <dl class="glance">
            ${Object.entries(glance).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}
          </dl>
          ${h.address ? `<a class="link" href="https://maps.google.com/?q=${encodeURIComponent(h.name + ", " + h.address)}" target="_blank" rel="noopener">Get directions ↗</a>` : ""}
        </div>
      </div>
    </section>` : ""}

    ${rooms.length ? `
    <section class="section section--tint section--compact">
      <div class="wrap">
        <div class="section__head"><p class="label">Rooms &amp; Suites</p><h2>Where <em>you'll sleep</em></h2></div>
        <div class="cards">
          ${rooms.map(r => {
            const price = r.price && on("prices") ? `from <strong>${inr(r.price)}</strong>` : "";
            const reserve = on("bookingForm") ? `<a href="#" class="card__go" data-scroll="reserve" data-room="${esc(r.name)}">Reserve →</a>` : "";
            return `
            <article class="card">
              <div class="arch card__img">${pic(r.image || h.image, r.name, CARD_IMG)}</div>
              <h3>${esc(r.name)}</h3>
              ${r.specs ? `<p class="card__text">${esc(r.specs)}</p>` : ""}
              ${price || reserve ? `<div class="card__foot"><span>${price}</span>${reserve}</div>` : ""}
            </article>`;
          }).join("")}
        </div>
      </div>
    </section>` : ""}

    ${on("hotelSections") && h.sections?.length ? `
    <section class="section section--compact">
      <div class="wrap">
        <div class="section__head"><p class="label">At the hotel</p><h2>Dine, celebrate <em>&amp; unwind</em></h2></div>
        <div class="features">
          ${h.sections.map(s => `
            <article class="feature">
              ${s.image ? `<div class="feature__img">${pic(s.image, s.title, { sizes: "(max-width: 860px) 90vw, 560px", widths: [480, 720, 1080], ar: "3:2" })}</div>` : ""}
              <div>
                <h3>${esc(s.title)}</h3>
                ${s.text ? `<p>${esc(s.text)}</p>` : ""}
              </div>
            </article>`).join("")}
        </div>
      </div>
    </section>` : ""}

    ${on("gallery") && h.gallery?.length > 1 ? `
    <section class="section section--tint section--compact" id="gallery">
      <div class="wrap">
        <div class="section__row"><div><p class="label">Gallery</p><h2>A look <em>around</em></h2></div>
          <span class="muted">${plural(h.gallery.length, "photo")}</span></div>
        <div class="gallery">
          ${h.gallery.map((g, i) => `
            <button type="button" class="gallery__item" data-full="${esc(isResizable(g) ? sized(g, 2000) : asset(g))}" aria-label="Open photo ${i + 1} of ${h.gallery.length}">
              ${pic(g, `${h.name}, photo ${i + 1}`, { sizes: "(max-width: 860px) 45vw, 280px", widths: [320, 480, 640], ar: "1:1" })}
            </button>`).join("")}
        </div>
      </div>
    </section>` : ""}

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
