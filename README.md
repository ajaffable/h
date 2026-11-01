# Hotels & Resorts — Website

A fast website for a group of hotels, built with plain HTML, CSS and JavaScript. It has no frameworks and no database.
**All content lives in one file: `data/hotels.js`.**

```
data/hotels.js        → ALL your content and settings (the only file you edit)
index.html            → page template (header, footer)
css/style.css         → design (colours and fonts at the top in :root)
js/render.js          → turns the data into pages
js/main.js            → search, booking form, date picker, live weather
build.js              → builds the finished site into _site/ (GitHub runs it for you)
.github/workflows/    → tells GitHub to build and publish on every change
```

---

## Before going live: checklist

The hotel content has been cleaned up: no old brand names in the text, old signs and logos removed from the photos, photos renamed and organised, and outlet names replaced with general wording. These items still need your input.

### 1. Must replace

All in `SITE` at the top of `data/hotels.js` (the lines marked `←`):

- [ ] `url`: your domain (now `https://www.example.com`)
- [ ] `name`: brand name shown as the logo (now `Your Brand`)
- [ ] `brand`: full name used in Google titles (now `Your Brand Hotels & Resorts`)
- [ ] `address`: office address shown in the footer, or delete the line
- [ ] `phone`, `whatsapp`, `email`: real contact details (used for every hotel)
- [ ] `instagram`, `facebook`: real social media links (now `#`)
- [ ] `stats`: optional figures like "10+ years of hospitality" (empty for now)

### 2. Check a few names

- [ ] **The Ark** (Dalhousie): renamed from its previous name, which contained a registered trademark. Change it if you prefer another name.
- [ ] Restaurants, spas and banquet halls are described generally ("our restaurant", "our spa"). If your outlets have names, add them back in the hotel text.

### 3. Photos

- Photos are in `images/hotels/<state>/<city>/<hotel>/`, named by what they show: `main`, `room-…`, `dining`, `events`, `spa`, `photo-01`… Each has three sizes (`-480`, `-960` and full).
- Photos that showed the previous brand were removed from the galleries, and hotels whose main photo showed it now use another, untouched photo.
- **20 photos are still edited versions** (the previous brand's logo was cleaned off cushions and bed runners), because no other photo of that room exists. Retake these when you can, keeping the same file names:
  - [ ] Anupam Resort: `room-deluxe-room`, `room-super-deluxe-room`, `room-family-room`
  - [ ] The Ark: `room-premium-room-with-balcony`, `room-luxury-suite-with-balcony`, `room-family-suite-with-balcony`
  - [ ] Meghavan Resort: `room-deluxe-room`, `room-deluxe-room-with-view`, `room-premium-room-with-view`, `room-junior-suite-with-view-and-bathtub`, `room-master-suite-with-view-and-bathtub`
  - [ ] Spring Valley Resort: `room-deluxe-room`, `room-premium-room`, `room-luxury-cottage`, `room-spring-suite`, `room-spring-duplex`
  - [ ] Hotel Shiva Sanctuary & Spa: `room-deluxe-room`, `room-premium-room`, `room-suite`
  - [ ] The Pearl: `dining` (sign removed from the wall)
- Building photos with your new signage would also make good main photos for each hotel.

### 4. Rewrite the descriptions

- [ ] The `tagline`, `description`, `about`, room and section texts are the previous website's wording. Rewrite each hotel's `description` and `about` in your own words (even small changes help Google treat your pages as original).

### 5. Optional

- Hotel `id`s (e.g. `divine-river-resort-and-spa`) are part of each page's address and folder name. If you change one, do it **before going live**, and rename its photo folder to match.

---

## 1. Show or hide anything

Open `data/hotels.js` and find `FEATURES`. Set any line to `false` to hide that feature, or back to `true` to show it again:

```js
const FEATURES = {
  search: true,          // search box and "Find a hotel" page
  newlyAdded: false,     // ← hidden for now
  bookingForm: true,
  prices: true,
  ...
};
```

| Switch | What it controls |
|---|---|
| `destinations` | "Destinations" page, plus a page per city listing all its hotels whatever their type (e.g. `/destinations/rishikesh/`) |
| `offersPage` | "Offers" page with every hotel that has an `offer` (shown only when at least one hotel has one) |
| `homeDestinations` | "Where to next?" destination cards on the home page |
| `aboutText` | The longer "About the hotel" text (`about`) |
| `hotelSections` | Dining, events and spa sections (`sections`) |
| `gallery` | Photo gallery with a full-screen viewer (`gallery`) |
| `search` | Search box, suggestions and the "Find a hotel" page |
| `popularCities` | City buttons under the search box |
| `stats` | Trust numbers on the home page: hotels, destinations and states are counted automatically, and extras come from `SITE.stats` |
| `recentlyViewed` | "Recently viewed" row for returning visitors |
| `popularHotels` | "Popular hotels" row |
| `browseByType` | Category cards on the home page (always shown if search is off, so visitors can still reach hotels) |
| `newlyAdded` | "Newly added" row |
| `whyBookWithUs` | The "Book direct, stay better" section |
| `siteReviews` | Reviews and average rating on the home page |
| `faq` | Questions and answers |
| `liveWeather` | Local time and weather on hotel pages |
| `rooms` | Room cards |
| `experiences` | "A day here" timeline |
| `hotelReviews` | Reviews on each hotel's page |
| `bookingForm` | The booking letter (when off, an "Enquire on WhatsApp" button appears instead) |
| `priceEstimate` | "3 nights · approx. ₹19,500" in the booking form |
| `nearbyHotels` | "More in Rishikesh" row |
| `prices` | All "from ₹…" prices |
| `ratings` | All ★ ratings |
| `offers` | Offer badges |
| `badges` | "New" and "Popular" badges |
| `typeTags` | The coloured ● Heritage / ● City tags |
| `breadcrumbs` | Home / Heritage Palaces / Rajasthan / … |
| `whatsappButton` | Round WhatsApp button in the corner |

**Hide one hotel or one category for now:** add `hidden: true` to its block.

```js
{
  id: "the-emerald",
  hidden: true,          // ← not shown anywhere until you remove this line
  ...
}
```

Hidden hotels disappear from every page, from search, and from Google. If that leaves a state or city empty, it disappears too. Remove the line and everything comes back as it was.

---

## 2. Adding, changing or removing hotels

- **Add:** copy any hotel block `{ ... },` in `HOTELS`, paste it, and change the values. New states and cities are created automatically.
- **Change:** edit the text in quotes.
- **Remove:** delete the block, or use `hidden: true` to keep it for later.

Required fields: `category`, `state`, `city`, `name`, `image`. Everything else is optional, and a section only appears if you fill it in.

| Field | Shows as |
|---|---|
| `id` | The page address: `yoursite.com/hotel/<id>/`. Keep it short, lowercase, with dashes, and never change it once live (Google remembers it) |
| `popular: true` | Listed under "Popular hotels" |
| `addedOn: "2026-10-01"` | Listed under "Newly added", with a "New" badge for 90 days |
| `offer` | Offer badge on the card and page |
| `tagline`, `description` | Text at the top of the hotel page (and in Google results) |
| `priceFrom`, `rating` | "From ₹…" and "★ 4.8" |
| `highlights` | The ✦ list under the main photo |
| `details` | "Good to know" facts, with any labels you like, e.g. `"Metro": "2 min walk"` |
| `rooms` | Room cards, plus a room choice in the booking form |
| `experiences` | "A day here" timeline |
| `about` | Longer "About the hotel" text |
| `sections` | Dining, events, spa and so on: `{ title, text, image }` |
| `gallery` | List of photo links; tap one to see it full screen |
| `address` | Address and a "Get directions" link |
| `location` | Live local time and weather |
| `phone`, `whatsapp`, `email` | Hotel-specific contact (otherwise the main `SITE` details are used) |

**Levels with only one choice are skipped.** A state with one city goes straight to that city, and a city with one hotel goes straight to the hotel.

**Reviews** go in `REVIEWS`. Add `hotel: "<hotel id>"` and the review also appears on that hotel's page. **FAQs** go in `FAQS`. **"Why book with us"** points are in `SITE.perks`.

**Categories:** each one in `CATEGORIES` needs a unique `id`, plus a `short` name and a `color` for its tag. Don't use the ids `hotel`, `search`, `destinations` or `offers`, because those words are taken by page addresses.

**Old page addresses:** if you move from another website, list old addresses in `REDIRECTS` at the bottom of `data/hotels.js`. Each one forwards visitors and Google to the new page, so existing links and rankings keep working.

**Images:** hotel photos live in `images/hotels/<state>/<city>/<hotel-id>/`, site photos in `images/site/`. Each comes in three sizes (`main-480.webp`, `main-960.webp`, `main.webp` at 1440 px) so phones download less; refer to the plain name, e.g. `"images/hotels/uttarakhand/nainital/the-emerald/main.webp"`. For a new photo you can also add a single file, e.g. `"images/my-photo.webp"`.

**If a page goes blank after an edit,** there's usually a missing comma or quote in `data/hotels.js`. Press F12 in the browser to see the error and its line number.

---

## 3. Preview on your computer

Install Node.js (https://nodejs.org, the LTS version) once. Then, in this folder:

```
npx serve -s .
```

Open the address it shows (usually http://localhost:3000). Changes to `data/hotels.js` appear when you refresh.

> The site uses real page addresses (`/hotel/the-emerald/`), so double-clicking `index.html` no longer works. Use the command above.

To see the finished, Google-ready version exactly as it will be published:

```
node build.js
npx serve _site
```

---

## 4. Publish on GitHub Pages (free)

1. In `data/hotels.js`, set `SITE.url` to your domain, e.g. `"https://www.yourhotels.com"`.
2. Create a GitHub repository and push this folder to the `main` branch.
3. In the repo, open **Settings → Pages**. Under **Source**, choose **GitHub Actions**.
4. On the same screen, enter your **Custom domain** (e.g. `www.yourhotels.com`) and save.
5. At your domain registrar, add these DNS records:
   - `CNAME` record: `www` → `<your-github-username>.github.io`
   - `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
6. Once DNS has updated (minutes up to 24 h), tick **Enforce HTTPS**.

From then on, **every time you push a change, GitHub rebuilds and republishes the site in about a minute.** You can watch it in the **Actions** tab.

---

## 5. Getting found on Google

### What the site already does

Every time it's built, the site:

- **Gives every hotel, city and category its own page** at its own address, with the full content in the page itself (not only added by JavaScript later).
- **Writes a title and description for each page**, e.g. *"The Emerald, Nainital | Your Brand Hotels & Resorts"*. Google shows these in its results.
- **Adds structured data (schema.org) to each page.** Hotel pages describe the hotel: name, address, phone, price range, amenities and map location. This is what Google uses for hotel results. Breadcrumbs, the website and the organisation are described too.
- **Creates `sitemap.xml`,** a list of every page, so Google finds new hotels quickly.
- **Creates `robots.txt`,** which allows search engines in and points them to the sitemap.
- **Keeps addresses clean.** Shortcut pages point Google to the real page, and the "not found" page tells Google not to index it.
- **Loads fast and works on mobile,** both of which affect ranking.

### What you need to do (once)

Google doesn't list a new website automatically on day one. These steps tell Google the site exists and get it indexed:

1. **Google Search Console** (free): https://search.google.com/search-console
   - Click **Add property**, choose **Domain**, and enter your domain.
   - Google gives you a **TXT record**. Add it at your domain registrar, wait a few minutes, then click **Verify**.
   - Go to **Sitemaps**, enter `sitemap.xml` and click **Submit**.
   - Optional: paste a hotel's address into **URL inspection** and click **Request indexing** to speed that page up.
2. **Google Business Profile** for each hotel (free): https://business.google.com
   This is the most important step for **people searching a hotel's name**. It puts the hotel on Google Maps and in the box on the right of the search results, with photos, reviews and a "Website" button. Add your hotel page's address as the website link.
3. **Bing Webmaster Tools** (optional, free): https://www.bing.com/webmasters. You can import your site straight from Search Console.

### What to expect

- **Your brand name** (e.g. "Your Brand Hotels") usually shows your site at the top within **a few days to 2 weeks** after you submit the sitemap.
- **Hotel names** (e.g. "The Emerald Nainital") usually appear within **1–4 weeks**. Having a Google Business Profile for each hotel makes this faster and more reliable.
- **General searches** like "resort in Rishikesh" are harder, because booking sites compete for them. What helps most over time: good, unique descriptions for each hotel; real guest reviews on Google; your own photos with clear names (e.g. `lake-palace-pool.webp`); and links to your site from Instagram, Facebook, TripAdvisor and local tourism sites.

### Keep it healthy

- Add each new hotel to `data/hotels.js` and push. The sitemap updates automatically.
- Don't change a hotel's `id` once it's live. If you must, Google will treat it as a new page.
- Check Search Console every month or so. It warns you about any pages Google can't read.
