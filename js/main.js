// ==========================================================
// Hotel website — interactive parts of the site (no libraries)
// Pages are drawn by js/render.js; this file adds what happens when
// visitors click, type and book. You shouldn't need to edit this file.
// ==========================================================

const app = document.getElementById("app");
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function addRecent(id) {
  try { localStorage.setItem(RECENT_KEY, JSON.stringify([id, ...getRecent().filter(x => x !== id)].slice(0, 4))); } catch {}
}

// ==========================================================
// 1. Moving between pages without reloading
// ==========================================================
function navigate(to, { replace = false } = {}) {
  history[replace ? "replaceState" : "pushState"](null, "", to);
  route();
}

function route() {
  // Old-style links (#/hotel/…) from earlier versions still work
  if (location.hash.startsWith("#/")) return navigate(location.hash.slice(1), { replace: true });

  const r = resolveRoute(location.pathname, location.search);
  if (r.page === "redirect") return navigate(r.to + location.search, { replace: true });

  clearInterval(clockTimer);
  setMenu(false);
  if (viewer.open) viewer.close();
  // On the first visit the page already arrives fully built (build.js), so only
  // draw it again if it wasn't, or if it shows this visitor's "Recently viewed".
  const prebuilt = firstLoad && app.dataset.prebuilt === location.pathname;
  const needsRedraw = !prebuilt || (r.page === "home" && on("recentlyViewed") && getRecent().length);
  if (needsRedraw) app.innerHTML = renderPage(r);

  const meta = pageMeta(r);
  document.title = meta.title;
  $('meta[name="description"]')?.setAttribute("content", meta.description);

  const hotel = r.page === "hotel" ? r.node.data : null;
  $("#whatsapp").href = whatsappLink(hotel?.whatsapp);

  initSearchBoxes();
  if (r.page === "search") initHotelsPage(r.params);
  if (hotel) {
    addRecent(hotel.id);
    if (on("bookingForm")) initBooking(hotel);
    if (on("liveWeather") && hotel.location) initLive(hotel);
  }
  $("#moreReviews")?.addEventListener("click", e => {
    $$("#reviewList [hidden]").forEach(el => (el.hidden = false));
    e.currentTarget.remove();
  });
  document.body.classList.toggle("has-hero", r.page === "home");
  initPage();
  if (!firstLoad) window.scrollTo({ top: 0, behavior: "instant" });
  firstLoad = false;
  onScroll();
}
let firstLoad = true;

// ==========================================================
// 1b. Small interactive touches on each page
// ==========================================================
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
let slideTimer;

function initPage() {
  // Home: photo slideshow behind the heading
  clearInterval(slideTimer);
  const slides = $$(".hero__slide"), dots = $$(".hero__dots button");
  if (slides.length > 1) {
    let current = 0;
    // photos after the first one are loaded only when they're about to be shown
    const load = slide => {
      const img = slide && $("img[data-src]", slide);
      if (!img) return;
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      img.src = img.dataset.src;
      img.removeAttribute("data-src"); img.removeAttribute("data-srcset");
    };
    const show = i => {
      current = (i + slides.length) % slides.length;
      load(slides[current]);
      load(slides[(current + 1) % slides.length]);
      slides.forEach((s, j) => s.classList.toggle("is-active", j === current));
      dots.forEach((d, j) => d.setAttribute("aria-current", j === current));
    };
    dots.forEach((d, j) => d.addEventListener("click", () => { show(j); restart(); }));
    const restart = () => { clearInterval(slideTimer); if (!reduceMotion) slideTimer = setInterval(() => show(current + 1), 5500); };
    restart();
    // fetch the second photo once the page has finished loading, ready for the first change
    if (document.readyState === "complete") setTimeout(() => load(slides[1]), 1500);
    else addEventListener("load", () => setTimeout(() => load(slides[1]), 1500), { once: true });
  }

  // Home: filter the "Our stays" grid by type or state
  const grid = $("#stayGrid");
  if (grid) {
    const chips = $$(".chips--filter .chip");
    const showAll = $("#showAllStays");
    // On phones the cards scroll sideways, so every hotel is in the row (no "Show all" needed)
    const phone = matchMedia("(max-width: 860px)");
    let expanded = false, filter = "";
    const apply = () => {
      const [kind, value] = filter.split(":");
      const collapse = !filter && !expanded && !phone.matches;
      $$(".card", grid).forEach(card => {
        const match = !filter || card.dataset[kind] === value;
        card.hidden = !match || (collapse && card.classList.contains("is-extra"));
      });
      chips.forEach(c => c.setAttribute("aria-pressed", c.dataset.filter === filter));
      if (showAll) showAll.hidden = !collapse;
      grid.scrollTo({ left: 0 });
    };
    phone.addEventListener("change", apply);
    chips.forEach(c => c.addEventListener("click", () => { filter = c.dataset.filter; apply(); }));
    showAll?.addEventListener("click", () => { expanded = true; apply(); });
    apply();
  }

  // Gently fade cards in as they scroll into view
  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    }), { rootMargin: "0px 0px -40px 0px" });
    $$("#app .card, #app .pcard, #app .type, #app .feature, #app .block").filter(el => !el.closest(".cards--row")).forEach(el => {
      if (el.getBoundingClientRect().top > innerHeight) { el.classList.add("reveal"); io.observe(el); }
    });
  }
}

// Header turns solid once you scroll past the top of the page
function onScroll() { document.body.classList.toggle("is-scrolled", scrollY > 30); }
addEventListener("scroll", onScroll, { passive: true });

document.addEventListener("click", e => {
  // ‹ › buttons beside a row of cards
  const rowBtn = e.target.closest("[data-scroll-row]");
  if (rowBtn) {
    const row = rowBtn.closest("section").querySelector(".cards--row");
    row?.scrollBy({ left: +rowBtn.dataset.scrollRow * row.clientWidth * .8, behavior: "smooth" });
  }
  // "Show all photos" opens the photo viewer at the first photo
  if (e.target.closest("[data-open-gallery]")) $(".gallery__item")?.click();
});

document.addEventListener("click", e => {
  // Links that scroll within the page, e.g. "Check availability"
  const scrollLink = e.target.closest("[data-scroll]");
  if (scrollLink) {
    e.preventDefault();
    const target = scrollLink.dataset.scroll === "app" ? document.body : document.getElementById(scrollLink.dataset.scroll);
    target?.scrollIntoView({ behavior: "smooth" });
    return setMenu(false);
  }

  // Links to other pages of this site open instantly, without a reload
  const link = e.target.closest("a[href]");
  if (!link || link.target || e.ctrlKey || e.metaKey || e.shiftKey || e.button) return;
  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin || /\.\w+$/.test(url.pathname)) return;
  e.preventDefault();
  navigate(url.pathname + url.search);
});

addEventListener("popstate", route);

// ==========================================================
// 2. Search
// ==========================================================
// Live suggestions under any search box
function initSearchBoxes() {
  $$("[data-search]").forEach(form => {
    const input = form.elements.q;
    const list = $(".suggest", form);
    const onResultsPage = !!$("#results");

    const suggest = () => {
      const q = norm(input.value.trim());
      if (onResultsPage || q.length < 2) return (list.hidden = true);
      const places = [...new Set(allHotels.flatMap(n => [n.data.city, n.data.state]))].filter(p => norm(p).includes(q)).slice(0, 3);
      const hotels = findHotels(q).slice(0, 4);
      list.innerHTML = [
        ...places.map(p => `<li><a href="${searchHref(p)}"><span>📍</span>${esc(p)}<small>${plural(findHotels(p).length, "hotel")}</small></a></li>`),
        ...hotels.map(n => `<li><a href="${href(n)}"><span>🏨</span>${esc(n.name)}<small>${typeTag(n.category)}${esc(n.data.city)}</small></a></li>`)
      ].join("") || `<li class="suggest__empty">No matches. Try a city like ${esc(topCities(1)[0] || "")}</li>`;
      list.hidden = false;
    };

    input.addEventListener("input", suggest);
    input.addEventListener("focus", suggest);
    input.addEventListener("blur", () => setTimeout(() => (list.hidden = true), 150));
    form.addEventListener("submit", e => {
      e.preventDefault();
      if (onResultsPage) return input.blur();
      navigate(searchHref(input.value.trim()));
    });
  });
}

// "Find a hotel" page: filter, sort and show results
function initHotelsPage(params) {
  const input = $("#q");
  const sort = $("#sort");
  let type = params.get("type") || "";
  sort.value = SORTERS[params.get("sort")] && $(`option[value="${params.get("sort")}"]`, sort) ? params.get("sort") : "popular";

  const show = () => {
    const q = input.value.trim();
    const results = findHotels(q, type).sort(SORTERS[sort.value]);
    $$(".chip").forEach(c => c.setAttribute("aria-pressed", c.dataset.type === type));
    $("#resultCount").textContent = results.length ? `${plural(results.length, "hotel")}${q ? ` matching "${q}"` : ""}` : "";
    $("#results").innerHTML = results.length ? results.map(hotelCard).join("") : `
      <div class="empty">
        <p>No hotels match "${esc(q)}".</p>
        <p class="quick"><span>Try:</span>${topCities(5).map(c => `<a href="${searchHref(c)}">${esc(c)}</a>`).join("")}</p>
      </div>`;
    // Keep the address shareable without reloading the page
    const p = new URLSearchParams({ ...(q && { q }), ...(type && { type }), ...(sort.value !== "popular" && { sort: sort.value }) });
    history.replaceState(null, "", "/search/" + (p.toString() ? "?" + p : ""));
  };

  input.addEventListener("input", show);
  sort.addEventListener("change", show);
  $$(".chip").forEach(c => c.addEventListener("click", () => { type = c.dataset.type; show(); }));
  show();
}

// ==========================================================
// 3. Dates and the date picker
// ==========================================================
const MAX_NIGHTS = 30;          // longest stay that can be requested
const BOOK_AHEAD_DAYS = 365;    // how far ahead guests can book

const pad = n => String(n).padStart(2, "0");
const toISO = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromISO = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const addDays = (iso, n) => { const d = fromISO(iso); d.setDate(d.getDate() + n); return toISO(d); };
const nightsBetween = (a, b) => Math.round((fromISO(b) - fromISO(a)) / 864e5);
const fmtDay = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short" });
const fmtFull = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
const fmtMonth = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" });

// Styled like the site, instead of the browser's own. Guests pick check-in,
// then check-out, in one calendar. Past dates and stays longer than
// MAX_NIGHTS can't be chosen.
function initDatePicker(form, onChange) {
  const f = form.elements;
  const cal = $("#cal", form);
  const months = $("#calMonths", form);
  const now = new Date();
  const today = toISO(now);
  const lastDay = addDays(today, BOOK_AHEAD_DAYS);
  const firstMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  let view = firstMonth;        // first month on screen
  let picking = "in";           // which date the next click sets
  let opener = null;

  function setDates(checkin, checkout) {
    f.checkin.value = checkin;
    f.checkout.value = checkout;
    $$("[data-show]", form).forEach(el => {
      const value = f[el.dataset.show].value;
      el.textContent = value ? fmtDay.format(fromISO(value)) : "pick a date";
      el.closest(".blank").classList.toggle("is-empty", !value);
      if (value) el.closest(".blank").classList.remove("has-error");
    });
    onChange();
  }

  function render() {
    const checkin = f.checkin.value, checkout = f.checkout.value;
    const latest = picking === "out" && checkin ? addDays(checkin, MAX_NIGHTS) : lastDay;
    const count = matchMedia("(max-width: 600px)").matches ? 1 : 2;
    let html = "";

    for (let i = 0; i < count; i++) {
      const month = new Date(view.getFullYear(), view.getMonth() + i, 1);
      const blanks = (month.getDay() + 6) % 7;     // weeks start on Monday
      const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
      html += `<div class="cal__month"><p class="cal__title">${fmtMonth.format(month)}</p><div class="cal__grid">
        ${["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => `<span class="cal__wd">${d}</span>`).join("")}
        ${"<span></span>".repeat(blanks)}`;
      for (let d = 1; d <= days; d++) {
        const date = new Date(month.getFullYear(), month.getMonth(), d);
        const iso = toISO(date);
        const cls = [
          "cal__day",
          iso === today && "is-today",
          iso === checkin && "is-start",
          iso === checkout && "is-end",
          checkin && checkout && iso > checkin && iso < checkout && "in-range"
        ].filter(Boolean).join(" ");
        const disabled = iso < today || iso > latest;
        html += `<button type="button" class="${cls}" data-date="${iso}" aria-label="${fmtFull.format(date)}"${disabled ? " disabled" : ""}>${d}</button>`;
      }
      html += "</div></div>";
    }

    months.innerHTML = html;
    $('[data-step="-1"]', cal).disabled = view <= firstMonth;
    $('[data-step="1"]', cal).disabled = new Date(view.getFullYear(), view.getMonth() + count, 1) > fromISO(lastDay);
    $("#calHint", cal).textContent = picking === "in" ? "Select your check-in date" : `Now select check-out (up to ${MAX_NIGHTS} nights)`;
    $("#calNights", cal).textContent = checkin && checkout ? plural(nightsBetween(checkin, checkout), "night") : "";
  }

  function open(which, button) {
    opener = button;
    picking = which === "out" && f.checkin.value ? "out" : "in";
    const start = f.checkin.value ? fromISO(f.checkin.value) : now;
    view = new Date(start.getFullYear(), start.getMonth(), 1);
    cal.style.top = button.offsetTop + button.offsetHeight + 10 + "px";   // just below the date that was tapped
    cal.hidden = false;
    $$("[data-open]", form).forEach(b => b.setAttribute("aria-expanded", b === button));
    render();
    $(".cal__day.is-start:not([disabled]), .cal__day:not([disabled])", months)?.focus();
  }

  function close() {
    hideCalendar();
    opener?.focus();
  }

  $$("[data-open]", form).forEach(b => b.addEventListener("click", () => open(b.dataset.open, b)));
  $$("[data-step]", cal).forEach(b => b.addEventListener("click", () => {
    view = new Date(view.getFullYear(), view.getMonth() + +b.dataset.step, 1);
    render();
  }));
  $("#calClear", cal).addEventListener("click", () => { picking = "in"; setDates("", ""); render(); });
  $("#calDone", cal).addEventListener("click", close);

  months.addEventListener("click", e => {
    const day = e.target.closest(".cal__day:not([disabled])");
    if (!day) return;
    const date = day.dataset.date;
    if (picking === "in" || date <= f.checkin.value) {
      setDates(date, "");          // new check-in; now ask for check-out
      picking = "out";
      render();
    } else {
      setDates(f.checkin.value, date);
      close();
    }
  });

  // While choosing check-out, preview the stay under the mouse
  months.addEventListener("mouseover", e => {
    if (picking !== "out" || !f.checkin.value) return;
    const hover = e.target.closest(".cal__day:not([disabled])")?.dataset.date;
    $$(".cal__day", months).forEach(b =>
      b.classList.toggle("in-preview", !!hover && b.dataset.date > f.checkin.value && b.dataset.date < hover));
  });
}

function hideCalendar() {
  const cal = $("#cal");
  if (cal) cal.hidden = true;
  $$("[data-open]").forEach(b => b.setAttribute("aria-expanded", "false"));
}

// Close the calendar when clicking outside it or pressing Escape
document.addEventListener("pointerdown", e => {
  if ($("#cal") && !e.target.closest("#cal, [data-open]")) hideCalendar();
});
document.addEventListener("keydown", e => { if (e.key === "Escape") hideCalendar(); });

// ==========================================================
// 4. Booking form
// ==========================================================
const NAME_CHARS = /[^A-Za-zऀ-ॿ .'-]/g;                      // letters (English or Hindi), space . ' -
const NAME_OK = /^[A-Za-zऀ-ॿ][A-Za-zऀ-ॿ .'-]{1,39}$/;
const INDIA_MOBILE_OK = /^[6-9]\d{9}$/;                                // Indian mobile: 10 digits, starts 6–9
const CODE_OK = /^[1-9]\d{0,3}$/;                                      // country code: 1–4 digits

function initBooking(h) {
  const form = $("#reserveForm");
  const f = form.elements;            // form.name would be the form's own name, so read inputs via .elements
  const estimate = $("#estimate");
  const formError = $("#formError");

  // Name: only letters and a few name characters, max 40
  f.name.addEventListener("input", () => {
    const clean = f.name.value.replace(NAME_CHARS, "").replace(/\s{2,}/g, " ").slice(0, 40);
    if (clean !== f.name.value) f.name.value = clean;
  });

  // Mobile number: digits only. India (+91) allows 10 digits; other countries up to
  // 15 digits in total including the code (the international maximum).
  const isIndia = () => f.cc.value === "91";
  const maxDigits = () => isIndia() ? 10 : 15 - f.cc.value.length;
  const phoneOK = () => CODE_OK.test(f.cc.value) &&
    (isIndia() ? INDIA_MOBILE_OK.test(f.phone.value) : f.phone.value.length >= 6 && f.phone.value.length <= maxDigits());

  const tidyPhone = () => {
    const raw = f.phone.value.trim();
    let digits = raw.replace(/\D/g, "");
    if (raw.startsWith("+") && digits.startsWith(f.cc.value)) digits = digits.slice(f.cc.value.length);   // pasted "+971 50…"
    else if (isIndia() && digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);       // pasted "91 98765…"
    digits = digits.replace(/^0+/, "");                                                                    // local "0" prefix, e.g. 07911… (UK)
    f.phone.value = digits.slice(0, maxDigits());
  };
  f.phone.addEventListener("input", tidyPhone);
  f.cc.addEventListener("input", () => {
    f.cc.value = f.cc.value.replace(/\D/g, "").replace(/^0+/, "").slice(0, 4);
    f.phone.placeholder = isIndia() ? "9876543210" : "mobile number";
    tidyPhone();
  });

  // Typing in a field clears its error
  form.addEventListener("input", e => e.target.closest(".blank")?.classList.remove("has-error"));

  const update = () => {
    if (!estimate) return;
    const roomName = f.room ? f.room.value : "";
    const price = f.room ? +f.room.selectedOptions[0].dataset.price : h.priceFrom;
    const nights = f.checkin.value && f.checkout.value ? nightsBetween(f.checkin.value, f.checkout.value) : 0;
    if (!price) estimate.textContent = "";
    else estimate.innerHTML = nights > 0
      ? `<strong>${plural(nights, "night")}</strong>${roomName ? ` in the ${esc(roomName)}` : ""} · approx. <strong>${inr(nights * price)}</strong>`
      : `${roomName ? esc(roomName) + " from" : "Rooms from"} <strong>${inr(price)}</strong> a night`;
  };
  form.addEventListener("change", update);
  initDatePicker(form, update);
  update();

  // "Reserve →" on a room card preselects that room
  $$("[data-room]").forEach(a => a.addEventListener("click", () => { if (f.room) { f.room.value = a.dataset.room; update(); } }));

  form.addEventListener("submit", e => {
    e.preventDefault();
    $$(".has-error", form).forEach(el => el.classList.remove("has-error"));

    const problems = [];
    const flag = (el, message) => { el.closest(".blank").classList.add("has-error"); problems.push(message); };
    if (!f.checkin.value || !f.checkout.value) flag($('[data-open="in"]', form), "choose your check-in and check-out dates");
    if (!NAME_OK.test(f.name.value.trim())) flag(f.name, "enter your name (letters only, at least 2)");
    if (!phoneOK()) flag(f.phone, !CODE_OK.test(f.cc.value) ? "enter your country code"
      : isIndia() ? "enter a valid 10-digit mobile number" : "enter a valid mobile number");

    if (problems.length) {
      formError.textContent = "Please " + problems.join(", ").replace(/, ([^,]*)$/, " and $1") + ".";
      const first = $(".has-error", form);
      return (first.matches("button") ? first : $("input", first)).focus();
    }
    formError.textContent = "";

    const lines = [
      `Hello, I'd like to request a stay at ${h.name}, ${h.city}.`,
      "",
      `Name: ${f.name.value.trim()}`,
      `Mobile: +${f.cc.value} ${f.phone.value}`
    ];
    if (f.room) lines.push(`Room: ${f.room.value}`);
    lines.push(
      `Guests: ${f.guests.value}`,
      `Check-in: ${fmtFull.format(fromISO(f.checkin.value))}`,
      `Check-out: ${fmtFull.format(fromISO(f.checkout.value))} (${plural(nightsBetween(f.checkin.value, f.checkout.value), "night")})`
    );

    window.open(`${whatsappLink(h.whatsapp)}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
  });
}

// ==========================================================
// 5. Live time & weather on hotel pages
// ==========================================================
let clockTimer;
const WEATHER = [[0, "clear skies"], [3, "a few clouds"], [48, "misty"], [67, "light rain"], [77, "snow"], [82, "showers"], [99, "thunderstorms"]];

function initLive(h) {
  const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: h.timeZone || "Asia/Kolkata" });
  const tick = () => { const el = $("#localTime"); if (el) el.textContent = fmt.format(new Date()); };
  tick();
  clockTimer = setInterval(tick, 30000);

  // Free weather API, no key needed. If it fails, the weather is simply not shown.
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${h.location.lat}&longitude=${h.location.lon}&current=temperature_2m,weather_code`)
    .then(res => res.json())
    .then(({ current }) => {
      const el = $("#weather");
      if (!el) return;
      const desc = WEATHER.find(([max]) => current.weather_code <= max)[1];
      el.textContent = `${Math.round(current.temperature_2m)}°C, ${desc}`;
    })
    .catch(() => {});
}

// ==========================================================
// 6. Photo gallery: tap a photo to see it full size
// ==========================================================
const viewer = document.createElement("dialog");
viewer.className = "viewer";
viewer.innerHTML = `
  <img alt="">
  <button type="button" class="viewer__btn viewer__prev" aria-label="Previous photo">‹</button>
  <button type="button" class="viewer__btn viewer__next" aria-label="Next photo">›</button>
  <button type="button" class="viewer__close" aria-label="Close">×</button>
  <p class="viewer__count" aria-live="polite"></p>`;
document.body.append(viewer);
let viewerItems = [];
let viewerIndex = 0;

function showPhoto(i) {
  viewerIndex = (i + viewerItems.length) % viewerItems.length;
  const item = viewerItems[viewerIndex];
  $("img", viewer).src = item.dataset.full;
  $("img", viewer).alt = $("img", item).alt;
  $(".viewer__count", viewer).textContent = `${viewerIndex + 1} / ${viewerItems.length}`;
}

document.addEventListener("click", e => {
  const item = e.target.closest(".gallery__item");
  if (!item) return;
  viewerItems = $$(".gallery__item");
  showPhoto(viewerItems.indexOf(item));
  viewer.showModal();
});
$(".viewer__prev", viewer).addEventListener("click", () => showPhoto(viewerIndex - 1));
$(".viewer__next", viewer).addEventListener("click", () => showPhoto(viewerIndex + 1));
$(".viewer__close", viewer).addEventListener("click", () => viewer.close());
viewer.addEventListener("click", e => { if (e.target === viewer) viewer.close(); });   // tap outside the photo
viewer.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") showPhoto(viewerIndex - 1);
  if (e.key === "ArrowRight") showPhoto(viewerIndex + 1);
});
viewer.addEventListener("close", () => { $("img", viewer).src = ""; });

// Swipe left/right on phones
let touchX = null;
viewer.addEventListener("touchstart", e => { touchX = e.touches[0].clientX; }, { passive: true });
viewer.addEventListener("touchend", e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) showPhoto(viewerIndex + (dx < 0 ? 1 : -1));
  touchX = null;
});

// ==========================================================
// 7. Header, footer, menu, then draw the first page
// ==========================================================
$("#logo").textContent = SITE.name;
$("#nav").innerHTML = navHTML();
$("#contact").innerHTML = footerHTML();
$("#whatsapp").hidden = !on("whatsappButton");

const nav = $("#nav");
const menuBtn = $("#menuBtn");
function setMenu(open) {
  nav.classList.toggle("is-open", open);
  menuBtn.setAttribute("aria-expanded", open);
}
menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

route();
