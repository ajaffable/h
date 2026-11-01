/* ==========================================================================
   YOUR WEBSITE CONTENT: this is the only file you need to edit.

   WHAT'S IN HERE
   1. SITE        – your brand name, web address, contact details
   2. FEATURES    – switches to show or hide parts of the website
   3. CATEGORIES  – the hotel types (Resorts, Hotels)
   4. HOTELS      – one { ... } block per hotel
   5. REVIEWS     – guest reviews (shown on the home page and on each hotel's page)
   6. FAQS        – common questions, shown on the home page
   7. REDIRECTS   – old page addresses that should forward to new ones (optional)

   HOTELS: HOW IT WORKS
   - The site builds Category → State → City → Hotel pages from the HOTELS list.
   - To ADD a hotel, copy any block, paste it, and change the values.
   - If a state has only one city, or a city has only one hotel, that level is skipped.
   - Required: category, state, city, name, image. Everything else is optional,
     and a section only appears on the hotel page if you fill it in.
   - popular: true         → shown under "Popular hotels" on the home page
   - addedOn: "YYYY-MM-DD" → shown under "Newly added" (with a "New" badge for 90 days)
   - offer: "..."          → shown as a badge, and on the Offers page

   HIDING SOMETHING FOR NOW
   - A whole feature: set it to false in FEATURES below.
   - One hotel or one category: add  hidden: true  to its block.
   Hidden things disappear from every page, search and Google, and come back
   exactly as they were when you remove the line.

   IMAGES
   Hotel photos live in images/hotels/<state>/<city>/<hotel id>/ and site photos
   in images/site/. Each comes in three sizes (main-480.webp, main-960.webp,
   main.webp) so phones download less; write the plain name in the data, e.g.
   "images/hotels/uttarakhand/nainital/the-emerald/main.webp".
   For a new photo you can also just add one file, e.g. "images/lake-view.webp".

   Tip: keep the commas between blocks, and put text inside "quotes".
   ========================================================================== */

const SITE = {
  // ▼ PLACEHOLDERS: replace everything marked ← with your real brand details
  url: "https://www.hotelswale.com",      // ← your domain, used for Google (no slash at the end)
  name: "Hotels Wale",                  // ← shown as the logo
  brand: "HOTELSWALE.COM",// ← full name used in Google titles
  tagline: "Hotels & Resorts",
  headline: "Stays across the Himalayas,",
  headlineEm: "made for every journey.",
  intro: "Hotels and resorts across Uttarakhand, Himachal Pradesh, Punjab and Haryana, where the beauty of the Himalayas greets you at every turn.",
  heroImage: "images/site/hero.webp",
  address: "Radha Bhawan Estate, Mussoorie, Uttarakhand - 248179",      // ← shown in the footer (delete the line to hide it)
  phone: "+91 9910078107",            // ← main phone, used for every hotel
  whatsapp: "919910078107",            // ← WhatsApp number: digits only, with country code
  email: "sales@hotelswale.com",           // ← main email
  instagram: "#",                      // ← your Instagram page link
  facebook: "#",                       // ← your Facebook page link

  // Extra numbers for the trust row on the home page (hotel, destination and
  // state counts are added automatically). Delete any you don't want.
  stats: [
    // { value: "10+", label: "years of hospitality" },   ← add your own figures
  ],

  // "Why book with us" points (switch on with FEATURES.whyBookWithUs), e.g.
  // { title: "Best rate, guaranteed", text: "Book direct for our lowest price." },
  perks: []
};

/* Show or hide parts of the website: true = show, false = hide. */
const FEATURES = {
  // Pages
  destinations: true,        // "Destinations" page, plus a page per city (all hotel types together)
  offersPage: true,          // "Offers" page listing every hotel with an offer (hidden while there are none)

  // Home page
  search: true,              // search box, suggestions and the "Find a hotel" page
  popularCities: true,       // city buttons under the search box
  stats: true,               // trust numbers: hotels, destinations, states, SITE.stats
  homeDestinations: true,    // "Where to next?" destination cards
  recentlyViewed: true,      // "Recently viewed" row for returning visitors
  popularHotels: true,       // "Popular hotels" row (hotels with popular: true)
  browseByType: true,        // the category cards
  newlyAdded: true,          // "Newly added" row (uses addedOn)
  whyBookWithUs: false,      // the SITE.perks section (add perks first)
  siteReviews: true,         // reviews and average rating (shown once REVIEWS has some)
  faq: false,                // questions and answers (add FAQS first)

  // Hotel pages
  aboutText: true,           // the longer "About the hotel" text
  rooms: true,               // room cards
  hotelSections: true,       // dining, events and spa sections
  gallery: true,             // photo gallery with full-screen viewer
  liveWeather: true,         // local time and weather
  experiences: true,         // "A day here" timeline (uses experiences)
  hotelReviews: true,        // reviews tagged to the hotel
  bookingForm: false,        // the booking letter (off = an "Enquire on WhatsApp" button instead)
  priceEstimate: false,      // "3 nights · approx. ₹19,500" in the booking form
  nearbyHotels: true,        // "More in Rishikesh" row

  // Everywhere
  prices: true,              // "from ₹…" prices (add priceFrom to hotels to show them)
  ratings: true,             // ★ ratings (add rating to hotels to show them)
  offers: true,              // offer badges
  badges: true,              // "New" and "Popular" badges
  typeTags: true,            // the coloured ● Resort / ● Hotel tags
  breadcrumbs: true,         // Home / Resorts / Uttarakhand / …
  whatsappButton: true       // the round green button in the corner
};

/* The hotel types. A hotel's `category` must match one of these ids.
   `short` and `color` are used for the small tag on every hotel card,
   so visitors can tell the type at a glance. */
const CATEGORIES = [
  {
    id: "resorts",
    name: "Resorts",
    short: "Resort",
    color: "#2f6b4f",
    tagline: "Mountain, river and forest retreats",
    description: "Resorts and spa retreats by rivers, forests and mountain valleys, with room to unwind, celebrate and explore.",
    image: "images/site/category-resorts.webp"
  },
  {
    id: "hotels",
    name: "Hotels",
    short: "Hotel",
    color: "#a94e28",
    tagline: "Comfortable stays close to it all",
    description: "Well-located hotels near temples, markets and Mall Roads, ideal for families, pilgrims and weekend getaways.",
    image: "images/site/category-hotels.webp"
  }
];

const HOTELS = [
  {
    id: "royal-escape",
    category: "hotels",
    state: "Haryana",
    city: "Karnal",
    name: "Royal Escape",
    tagline: "Your Private Luxury Villa in Karnal",
    description: "Make every occasion special at Royal Escape, a private 3 BHK luxury villa in Karnal featuring a swimming pool, a beautiful garden, and modern comforts. Perfect for birthday parties, pool parties, kitty parties, family gatherings, Haldi, Mehendi, and private getaways.",
    about: "Make every occasion special at Royal Escape, a private 3 BHK luxury villa in Karnal featuring a swimming pool, a beautiful garden, and modern comforts. Perfect for birthday parties, pool parties, kitty parties, family gatherings, Haldi, Mehendi, and private getaways. Enjoy your own space, celebrate your way, and create memories that last forever.",
    image: "images/hotels/haryana/karnal/royal-escape/main.webp",
    address: "INR FARMS, VPO SAMORA, PLOT NO. 92, INDRI, Karnal, Haryana - 132041",
    location: {lat: 29.82687,lon: 77.01077},
    highlights: [
      "Private 3 BHK Villa",
      "Swimming Pool",
      "Garden",
      "Ideal for Parties & Family Gatherings"
    ],
    gallery: [
      "images/hotels/haryana/karnal/royal-escape/main.webp",
      "images/hotels/haryana/karnal/royal-escape/photo-01.webp",
      "images/hotels/haryana/karnal/royal-escape/photo-02.webp",
      "images/hotels/haryana/karnal/royal-escape/photo-03.webp",
      "images/hotels/haryana/karnal/royal-escape/photo-04.webp",
      "images/hotels/haryana/karnal/royal-escape/photo-05.webp",
      "images/hotels/haryana/karnal/royal-escape/photo-06.webp",
      "images/hotels/haryana/karnal/royal-escape/photo-07.webp",
      "images/hotels/haryana/karnal/royal-escape/photo-08.webp",
      "images/hotels/haryana/karnal/royal-escape/photo-09.webp",
      "images/hotels/haryana/karnal/royal-escape/photo-10.webp",
      "images/hotels/haryana/karnal/royal-escape/photo-11.webp",
      "images/hotels/haryana/karnal/royal-escape/photo-12.webp",
      "images/hotels/haryana/karnal/royal-escape/photo-13.webp",
      "images/hotels/haryana/karnal/royal-escape/photo-14.webp"
    ]
  },

  {
    id: "the-ark",
    category: "hotels",
    state: "Himachal Pradesh",
    city: "Dalhousie",
    name: "The Ark",
    tagline: "A 4-Star Hotel in Banikhet",
    description: "Imagine a peaceful retreat surrounded by the breathtaking beauty of Banikhet, Dalhousie – that's exactly what The Ark offers. Whether you're here for a staycation, a family adventure, or to celebrate a special event, we've got everything you need for a memorable stay.",
    about: "Imagine a peaceful retreat surrounded by the breathtaking beauty of Banikhet, Dalhousie – that's exactly what The Ark offers. Whether you're here for a staycation, a family adventure, or to celebrate a special event, we've got everything you need for a memorable stay. Our accommodations are thoughtfully designed with a modern 4-star property feel, featuring wooden interiors that create a warm, inviting atmosphere with touches of elegance. When it's time to eat, our restaurant delights with a variety of mouth-watering multi-cuisine dishes, perfect for any occasion. Whether it's a casual meal or a special celebration, we make dining a breeze. For events, our banquet space is ideal for creating lasting memories and is equipped with all the amenities to make your gathering a success. Book your stay today at one of the best hotels in Banikhet and experience the perfect mix of relaxation, adventure, and hospitality!",
    image: "images/hotels/himachal-pradesh/dalhousie/the-ark/photo-01.webp",
    address: "Surkhigala, Banikhet, Dalhousie, Himachal Pradesh - 176303",
    location: {lat: 32.54779,lon: 75.95653},
    highlights: [
      "Open Terrace Area",
      "Elevator (24-hour)",
      "Doctor-on-call (Chargeable)",
      "Multi-cuisine Restaurant",
      "Multiple Event Spaces",
      "24-hour Room Service",
      "24/7 Customer Support"
    ],
    rooms: [
      {"name":"Deluxe Non-View Room","specs":"At 180 sq. ft., our cosy room is the perfect home-away-from-home, comfortably accommodating up to 4 guests. With modern amenities and a welcoming atmosphere, it's ideal for couples or small families looking for a relaxing retreat that blends comfort and convenience.","image":"images/hotels/himachal-pradesh/dalhousie/the-ark/room-deluxe-non-view-room.webp"},
      {"name":"Premium Room With Balcony","specs":"Spanning 180 sq. ft., our charming room offers space for 4 guests and features a private balcony – the perfect spot to unwind with a breath of fresh air. Whether you're enjoying a quiet morning or a peaceful evening, our room provides a lovely escape for those seeking a little extra relaxation.","image":"images/hotels/himachal-pradesh/dalhousie/the-ark/room-premium-room-with-balcony.webp"},
      {"name":"Luxury Suite With Balcony","specs":"Stretching over 200 sq. ft., our spacious suite offers a luxurious experience for up to 4 guests. Complete with a private balcony, it's the perfect place to relax and enjoy a stunning view. With added space and refined amenities, this suite is perfect for those who desire a more comfortable and memorable stay.","image":"images/hotels/himachal-pradesh/dalhousie/the-ark/room-luxury-suite-with-balcony.webp"},
      {"name":"Family Suite With Balcony","specs":"Covering 250 sq. ft., this family-friendly suite is designed to accommodate up to 6 guests, with plenty of space to relax and enjoy each other's company. Featuring a private balcony for extra comfort, it's the perfect choice for families looking for a spacious and convenient stay, where everyone can unwind in style.","image":"images/hotels/himachal-pradesh/dalhousie/the-ark/room-family-suite-with-balcony.webp"}
    ],
    sections: [
      {"title":"Taste the Best of Every Bite","text":"Our restaurant offers a range of delectable dishes, ideal for any occasion. Whether you're having a casual meal or celebrating a special moment, our menu caters to every taste. Enjoy your meal in a comfortable indoor setting, designed for a relaxed dining experience. With excellent food and top-notch service, dining at The Ark, one of the finest hotels in Banikhet, promises to be a memorable part of your stay.","image":"images/hotels/himachal-pradesh/dalhousie/the-ark/dining.webp"},
      {"title":"Host Unforgettable Events with Us","text":"From intimate gatherings to grand celebrations, our versatile banquet spaces are perfect for any occasion. Equipped with all the amenities needed for a seamless experience, we ensure your event runs smoothly. Whether it's a wedding, corporate function, or family celebration, we provide exceptional service to make your event memorable. Let us help you create lasting memories in a beautiful setting.","image":"images/hotels/himachal-pradesh/dalhousie/the-ark/events.webp"}
    ],
    gallery: [
      "images/hotels/himachal-pradesh/dalhousie/the-ark/photo-01.webp",
      "images/hotels/himachal-pradesh/dalhousie/the-ark/photo-03.webp",
      "images/hotels/himachal-pradesh/dalhousie/the-ark/dining.webp",
      "images/hotels/himachal-pradesh/dalhousie/the-ark/room-deluxe-non-view-room.webp",
      "images/hotels/himachal-pradesh/dalhousie/the-ark/events.webp"
    ]
  },

  {
    id: "dalhousie-valley-resort",
    category: "resorts",
    state: "Himachal Pradesh",
    city: "Dalhousie",
    name: "Dalhousie Valley Resort",
    tagline: "A Premier 4-Star Resort in Dalhousie",
    description: "Tucked amidst the spellbinding landscapes of Himachal Pradesh, Dalhousie Valley Resort embodies the perfect harmony of nature's majesty and genuine hospitality. As a serene resort near Banikhet helipad, we invite you to immerse yourself in awe-inspiring mountain vistas and thoughtfully designed comforts.",
    about: "Tucked amidst the spellbinding landscapes of Himachal Pradesh, Dalhousie Valley Resort embodies the perfect harmony of nature's majesty and genuine hospitality. As a serene resort near Banikhet helipad, we invite you to immerse yourself in awe-inspiring mountain vistas and thoughtfully designed comforts. Whether you dream of a family retreat, a romantic escape, or a peaceful staycation, every corner of our resort is imbued with elegance and tranquillity. From exquisitely crafted rooms to the culinary treasures of Talap, every moment here promises to become an unforgettable memory.",
    image: "images/hotels/himachal-pradesh/dalhousie/dalhousie-valley-resort/main.webp",
    address: "BS Estate College Road Ward No. 5, VPO Banikhet District, Near KV School, Tehsil, Dalhousie, Himachal Pradesh - 176303",
    location: {lat: 32.54626,lon: 75.9436},
    highlights: [
      "Multi-cuisine Restaurant",
      "Bonfire (Chargeable)",
      "Gazebo",
      "Open Terrace",
      "24/7 Customer Support",
      "Laundry (Chargeable)",
      "Free Parking"
    ],
    rooms: [
      {"name":"Deluxe Room","specs":"With 140 sq. ft. of inviting space, this cosy retreat comfortably hosts up to 4 guests, offering essential amenities and a shared balcony that frames awe-inspiring mountain views.","image":"images/hotels/himachal-pradesh/dalhousie/dalhousie-valley-resort/room-deluxe-room.webp"},
      {"name":"Super Deluxe Room","specs":"Spanning 160 sq. ft., these rooms welcome up to 4 guests, offering enhanced experience and a charming blend of comfort and functionality, perfect for couples or small families.","image":"images/hotels/himachal-pradesh/dalhousie/dalhousie-valley-resort/room-super-deluxe-room.webp"},
      {"name":"Luxury Room","specs":"At 180 sq. ft., this refined space is a haven for up to 4 guests, featuring a Jacuzzi/steam bath that adds a touch of indulgence to your stay.","image":"images/hotels/himachal-pradesh/dalhousie/dalhousie-valley-resort/room-luxury-room.webp"},
      {"name":"Family Room","specs":"Spread across an expansive 400 sq. ft., this room is a sanctuary for up to 6 guests, complete with a common balcony to ensure relaxation after a day of exploration","image":"images/hotels/himachal-pradesh/dalhousie/dalhousie-valley-resort/room-family-room.webp"}
    ],
    sections: [
      {"title":"A Feast for the Senses","text":"Delight your palate at Talap, a multi-cuisine restaurant with a blend of cosy indoor scenic outdoor seating and a gazebo. Offering flavours that span global favourites and local delicacies, the inviting ambience makes every meal a celebration.","image":"images/hotels/himachal-pradesh/dalhousie/dalhousie-valley-resort/dining.webp"}
    ],
    gallery: [
      "images/hotels/himachal-pradesh/dalhousie/dalhousie-valley-resort/main.webp",
      "images/hotels/himachal-pradesh/dalhousie/dalhousie-valley-resort/photo-01.webp",
      "images/hotels/himachal-pradesh/dalhousie/dalhousie-valley-resort/room-luxury-room.webp",
      "images/hotels/himachal-pradesh/dalhousie/dalhousie-valley-resort/photo-02.webp",
      "images/hotels/himachal-pradesh/dalhousie/dalhousie-valley-resort/photo-03.webp",
      "images/hotels/himachal-pradesh/dalhousie/dalhousie-valley-resort/photo-04.webp",
      "images/hotels/himachal-pradesh/dalhousie/dalhousie-valley-resort/dining.webp",
      "images/hotels/himachal-pradesh/dalhousie/dalhousie-valley-resort/room-deluxe-room.webp",
      "images/hotels/himachal-pradesh/dalhousie/dalhousie-valley-resort/room-super-deluxe-room.webp",
      "images/hotels/himachal-pradesh/dalhousie/dalhousie-valley-resort/room-family-room.webp"
    ]
  },

  {
    id: "nature-trinket-resort",
    category: "resorts",
    state: "Himachal Pradesh",
    city: "Dalhousie",
    name: "Nature Trinket Resort",
    tagline: "A 4-Star Retreat in Dalhousie",
    description: "Where the whispers of pine forests and the grandeur of Himalayan peaks converge, Nature Trinket Resort — a 4-star retreat — invites you to a world of serene escapes. Situated at a short distance from Khajjiar's emerald meadows, the bustling charm of Dalhousie Mall Road, and the panoramic heights of Dainkund Peak, our resort is more than a stay —it's an experience.",
    about: "Where the whispers of pine forests and the grandeur of Himalayan peaks converge, Nature Trinket Resort — a 4-star retreat — invites you to a world of serene escapes. Situated at a short distance from Khajjiar's emerald meadows, the bustling charm of Dalhousie Mall Road, and the panoramic heights of Dainkund Peak, our resort is more than a stay —it's an experience. Here, every corner tells a story of Dalhousie's natural beauty, woven with modern comforts and heartfelt hospitality. From waking up to mountain-kissed mornings to unwinding under starlit skies, your journey begins here at our luxury hotel in Dalhousie. Complement your stay with delightful dining at our multi-cuisine restaurant, where every meal is accompanied by stunning views and a warm ambience.",
    image: "images/hotels/himachal-pradesh/dalhousie/nature-trinket-resort/main.webp",
    address: "NH 154A, Dalhousie, Dadra, Himachal Pradesh - 176304",
    location: {lat: 32.56556,lon: 75.96388},
    highlights: [
      "Accommodations with Mountain Views",
      "Multi-cuisine Restaurant",
      "Travel Desk",
      "Lawn",
      "24/7 Customer Support",
      "Free Parking"
    ],
    rooms: [
      {"name":"Deluxe Room","specs":"Spread across 120 sq. ft., this cosy haven accommodates up to 4 guests and boasts serene mountain views that soothe the soul.","image":"images/hotels/himachal-pradesh/dalhousie/nature-trinket-resort/room-deluxe-room.webp"},
      {"name":"Premium Room","specs":"Stretch out in this 160 sq. ft. space designed for 4 guests, where a private balcony offers uninterrupted vistas of rolling hills and the valley beyond.","image":"images/hotels/himachal-pradesh/dalhousie/nature-trinket-resort/room-premium-room.webp"}
    ],
    sections: [
      {"title":"Dine with a View","text":"Our resort near Chamera Lake takes pride in its multi-cuisine restaurant, where flavours and ambience come together in perfect harmony. Whether you savour the aroma of freshly prepared delicacies indoors or enjoy your meal in the open, every bite is enhanced by the beauty of Dalhousie's enchanting landscapes.","image":"images/hotels/himachal-pradesh/dalhousie/nature-trinket-resort/dining.webp"}
    ],
    gallery: [
      "images/hotels/himachal-pradesh/dalhousie/nature-trinket-resort/main.webp",
      "images/hotels/himachal-pradesh/dalhousie/nature-trinket-resort/photo-01.webp",
      "images/hotels/himachal-pradesh/dalhousie/nature-trinket-resort/photo-02.webp",
      "images/hotels/himachal-pradesh/dalhousie/nature-trinket-resort/photo-03.webp",
      "images/hotels/himachal-pradesh/dalhousie/nature-trinket-resort/photo-04.webp",
      "images/hotels/himachal-pradesh/dalhousie/nature-trinket-resort/photo-05.webp",
      "images/hotels/himachal-pradesh/dalhousie/nature-trinket-resort/photo-06.webp",
      "images/hotels/himachal-pradesh/dalhousie/nature-trinket-resort/photo-07.webp",
      "images/hotels/himachal-pradesh/dalhousie/nature-trinket-resort/photo-08.webp",
      "images/hotels/himachal-pradesh/dalhousie/nature-trinket-resort/photo-09.webp",
      "images/hotels/himachal-pradesh/dalhousie/nature-trinket-resort/room-deluxe-room.webp",
      "images/hotels/himachal-pradesh/dalhousie/nature-trinket-resort/room-premium-room.webp",
      "images/hotels/himachal-pradesh/dalhousie/nature-trinket-resort/dining.webp"
    ]
  },

  {
    id: "anupam-resort",
    category: "resorts",
    state: "Himachal Pradesh",
    city: "Dharamshala",
    name: "Anupam Resort",
    tagline: "Where Comfort Meets Scenic Beauty",
    description: "Discover the charm of Dharamshala at Anupam Resort, a 3-star resort near Dal Lake in Naddi. Set amidst the serene beauty of the Kangra Valley.",
    about: "Discover the charm of Dharamshala at Anupam Resort, a 3-star resort near Dal Lake in Naddi. Set amidst the serene beauty of the Kangra Valley. Our cosy accommodations with mountain views are designed to suit every traveller's needs, offering a peaceful retreat with modern comforts. Enjoy multi-cuisine dining at our restaurant, host memorable events in our banquet hall, or gather around a bonfire for a magical evening. Our travel desk offers personalised travel assistance, helping you explore the beauty of Dharamshala with ease. Additionally, our dedicated 24/7 customer support team is always available to make your stay hassle-free and enjoyable. Perfect for vacations, celebrations, or corporate getaways, our resort in Dharamshala promises a refreshing escape in the heart of Himachal Pradesh.",
    image: "images/hotels/himachal-pradesh/dharamshala/anupam-resort/main.webp",
    address: "Naddi Road, near Dal Lake, Naddi, Upper, Dharamshala, Himachal Pradesh - 176216",
    location: {lat: 32.24853,lon: 76.30708},
    highlights: [
      "Multi-cuisine Restaurant",
      "Event Space",
      "24-hour Travel Desk",
      "Bonfire (Chargeable)",
      "Free Parking",
      "24/7 Customer Support"
    ],
    rooms: [
      {"name":"Deluxe Room","specs":"Experience comfort in our Deluxe Rooms, spread across 180 sq. ft. Designed for up to 4 guests, these 10 thoughtfully crafted rooms ensure a cosy stay with serene mountain views.","image":"images/hotels/himachal-pradesh/dharamshala/anupam-resort/room-deluxe-room.webp"},
      {"name":"Super Deluxe Room","specs":"Step into spacious elegance with our 15 Super Deluxe Rooms, each covering 220 sq. ft. Accommodating up to 4 guests, these rooms are ideal for those who value a blend of style and functionality.","image":"images/hotels/himachal-pradesh/dharamshala/anupam-resort/room-super-deluxe-room.webp"},
      {"name":"Family Room","specs":"Unwind in luxury with our two Family Suites, each spanning an impressive 450 sq. ft. Designed to host up to 6 guests, these suites feature expansive layouts and ample space, making them perfect for family gatherings.","image":"images/hotels/himachal-pradesh/dharamshala/anupam-resort/room-family-room.webp"}
    ],
    sections: [
      {"title":"Dining That Delights Every Palate","text":"Indulge your taste buds with a culinary journey at Anupam Restaurant! Serving a variety of multi-cuisine delights, this charming space seats 40 guests and offers stunning valley views, making every meal a feast for both the palate and the eyes.","image":"images/hotels/himachal-pradesh/dharamshala/anupam-resort/dining.webp"},
      {"title":"Transform Your Event into a Grand Affair","text":"Celebrate life's moments at Anupam Banquet Hall! This 400 sq. ft. space comfortably accommodates up to 50 guests, making it ideal for intimate weddings, corporate meetings, or special occasions. Equipped with Wi-Fi, AV facilities, and a projector, it's the perfect venue for unforgettable events.","image":"images/hotels/himachal-pradesh/dharamshala/anupam-resort/events.webp"}
    ],
    gallery: [
      "images/hotels/himachal-pradesh/dharamshala/anupam-resort/main.webp",
      "images/hotels/himachal-pradesh/dharamshala/anupam-resort/photo-01.webp",
      "images/hotels/himachal-pradesh/dharamshala/anupam-resort/photo-03.webp",
      "images/hotels/himachal-pradesh/dharamshala/anupam-resort/photo-05.webp",
      "images/hotels/himachal-pradesh/dharamshala/anupam-resort/events.webp",
      "images/hotels/himachal-pradesh/dharamshala/anupam-resort/photo-06.webp",
      "images/hotels/himachal-pradesh/dharamshala/anupam-resort/dining.webp"
    ]
  },

  {
    id: "hotel-shiva-sanctuary-and-spa",
    category: "hotels",
    state: "Himachal Pradesh",
    city: "Dharamshala",
    name: "Hotel Shiva Sanctuary & Spa",
    tagline: "Your Go-to Hotel in Dharamshala",
    description: "When in Dharamshala, Hotel Shiva Sanctuary & Spa is your ultimate retreat for both relaxation and exploration. Surrounded by the serene beauty of the Himalayas, our hotel in McLeodganj offers a unique blend of luxury, comfort, and convenience.",
    about: "When in Dharamshala, Hotel Shiva Sanctuary & Spa is your ultimate retreat for both relaxation and exploration. Surrounded by the serene beauty of the Himalayas, our hotel in McLeodganj offers a unique blend of luxury, comfort, and convenience. Wake up to stunning mountain views from spacious, thoughtfully designed accommodations, and enjoy a range of top-tier facilities including hassle-free parking, a helpful travel desk, and a rejuvenating spa. Savour exquisite meals at our in-house restaurant, host memorable events in our banquet hall or explore nearby monasteries and hiking trails. With its perfect mix of tranquillity and adventure, our hotel in Dharamshala ensures every moment of your stay is special. Ready to create unforgettable memories? Your sanctuary in the hills is waiting.",
    image: "images/hotels/himachal-pradesh/dharamshala/hotel-shiva-sanctuary-and-spa/main.webp",
    address: "Near Dal Lake Strawberry Hills, McLeod Ganj, Dharamshala, Dhial, Himachal Pradesh-176216",
    location: {lat: 32.24685,lon: 76.30905},
    highlights: [
      "Multi-cuisine Restaurant",
      "Banquet Hall",
      "24-hour Travel Desk",
      "Spa",
      "Free Parking",
      "24/7 Customer Support"
    ],
    rooms: [
      {"name":"Deluxe Room","specs":"Step into a snug 144 sq. ft. Deluxe Room, crafted for 3 adults—simple, cosy, and perfect for unwinding after a day in the hills.","image":"images/hotels/himachal-pradesh/dharamshala/hotel-shiva-sanctuary-and-spa/room-deluxe-room.webp"},
      {"name":"Premium Room","specs":"Breathe in the mountain air from your private balcony in this 195 sq. ft. Premium Room. Perfect for 4 adults, it's where comfort meets a touch of luxury.","image":"images/hotels/himachal-pradesh/dharamshala/hotel-shiva-sanctuary-and-spa/room-premium-room.webp"},
      {"name":"Suite","specs":"Immerse yourself in luxury with our 400 sq. ft. Suite. With space for 6 guests, plus a Jacuzzi and balcony, it's indulgence at its finest.","image":"images/hotels/himachal-pradesh/dharamshala/hotel-shiva-sanctuary-and-spa/room-suite.webp"}
    ],
    sections: [
      {"title":"Indulge in Exquisite Dining Experiences","text":"At our restaurant 'Shiva', every meal is a celebration of flavours. From hearty comfort food to exotic culinary creations, our multi-cuisine menu offers something for everyone. Enjoy these delicious moments in a warm, inviting indoor setting designed for memorable dining experiences.","image":"images/hotels/himachal-pradesh/dharamshala/hotel-shiva-sanctuary-and-spa/dining.webp"},
      {"title":"Create Unforgettable Moments with Us","text":"Elevate your events in our spacious 1,200 sq. ft. banquet hall, perfect for hosting up to 70 guests. With versatile seating arrangements and modern amenities like Wi-Fi, a projector, and audio-visual equipment, this elegant space is ideal for conferences, celebrations, and everything in between.","image":"images/hotels/himachal-pradesh/dharamshala/hotel-shiva-sanctuary-and-spa/events.webp"},
      {"title":"Pamper Yourself with Luxurious Spa Treatments","text":"Relax, rejuvenate, and rediscover yourself at Shiva Sanctuary Spa. Indulge in soothing massages and holistic therapies, designed to melt away stress and leave you feeling refreshed amidst the serene Dharamshala hills.","image":"images/hotels/himachal-pradesh/dharamshala/hotel-shiva-sanctuary-and-spa/spa.webp"}
    ],
    gallery: [
      "images/hotels/himachal-pradesh/dharamshala/hotel-shiva-sanctuary-and-spa/main.webp",
      "images/hotels/himachal-pradesh/dharamshala/hotel-shiva-sanctuary-and-spa/photo-01.webp",
      "images/hotels/himachal-pradesh/dharamshala/hotel-shiva-sanctuary-and-spa/photo-02.webp",
      "images/hotels/himachal-pradesh/dharamshala/hotel-shiva-sanctuary-and-spa/photo-03.webp",
      "images/hotels/himachal-pradesh/dharamshala/hotel-shiva-sanctuary-and-spa/photo-04.webp",
      "images/hotels/himachal-pradesh/dharamshala/hotel-shiva-sanctuary-and-spa/photo-06.webp",
      "images/hotels/himachal-pradesh/dharamshala/hotel-shiva-sanctuary-and-spa/photo-07.webp",
      "images/hotels/himachal-pradesh/dharamshala/hotel-shiva-sanctuary-and-spa/events.webp",
      "images/hotels/himachal-pradesh/dharamshala/hotel-shiva-sanctuary-and-spa/photo-08.webp",
      "images/hotels/himachal-pradesh/dharamshala/hotel-shiva-sanctuary-and-spa/dining.webp",
      "images/hotels/himachal-pradesh/dharamshala/hotel-shiva-sanctuary-and-spa/spa.webp"
    ]
  },

  {
    id: "meghavan-resort",
    category: "resorts",
    state: "Himachal Pradesh",
    city: "Dharamshala",
    name: "Meghavan Resort",
    tagline: "A Luxury 4-Star Resort in Dharamshala",
    description: "Set in the heart of Bhagsunag, Dharamshala, Meghavan Resort offers stunning views of the Dhauladhar mountains, blending luxury with natural beauty. Our cosy rooms with valley views and high-speed internet are perfect for sharing your travel moments.",
    about: "Set in the heart of Bhagsunag, Dharamshala, Meghavan Resort offers stunning views of the Dhauladhar mountains, blending luxury with natural beauty. Our cosy rooms with valley views and high-speed internet are perfect for sharing your travel moments. Located near top attractions like Bhagsunag Temple, Dalai Lama Temple, Bhagsunag Waterfall, and Saint John's Church, our resort in Bhagsunag is an ideal base for exploration. After your adventures, relax, enjoy yoga, or stroll through our garden. Savour delicious meals at our restaurant or café, and host memorable events in our versatile venues. Book your stay today at Meghavan Resort!",
    image: "images/hotels/himachal-pradesh/dharamshala/meghavan-resort/photo-02.webp",
    address: "Bhagsunag Rd., Upper McLeod Ganj, Dharamshala, Himachal Pradesh - 176219",
    location: {lat: 32.24449,lon: 76.3327},
    highlights: [
      "Restaurant & Cafe",
      "Multiple Event Venues",
      "Garden",
      "Yoga Hall",
      "Elevator",
      "24/7 Doctor on Call (Chargeable)",
      "Free Parking",
      "Candlelight Dinner",
      "24-hour Room Service",
      "Laundry Service (Chargeable)",
      "24/7 Customer Support"
    ],
    rooms: [
      {"name":"Deluxe Room","specs":"Unwind in our 250 sq. ft. Deluxe Room, perfect for up to 3 guests. With a cosy king size bed and a warm, inviting space, it's ideal for a relaxing getaway.","image":"images/hotels/himachal-pradesh/dharamshala/meghavan-resort/room-deluxe-room.webp"},
      {"name":"Deluxe Room With View","specs":"Experience comfort and tranquillity in our Deluxe Room With View. Spanning 285 sq. ft., it accommodates up to 4 guests and offers breathtaking mountain views for a refreshing escape.","image":"images/hotels/himachal-pradesh/dharamshala/meghavan-resort/room-deluxe-room-with-view.webp"},
      {"name":"Premium Room With View","specs":"Indulge in the charm of our Premium Room With View, offering 305 sq. ft. of luxurious space with breathtaking mountain views—ideal for up to 4 guests.","image":"images/hotels/himachal-pradesh/dharamshala/meghavan-resort/room-premium-room-with-view.webp"},
      {"name":"Junior Suite With View and Bathtub","specs":"Experience luxury in our Junior Suite With View and Bathtub. With 330 sq. ft. of refined space offering stunning mountain views, and a relaxing bathtub, it's the perfect escape for up to 4 guests.","image":"images/hotels/himachal-pradesh/dharamshala/meghavan-resort/room-junior-suite-with-view-and-bathtub.webp"},
      {"name":"Master Suite With View and Bathtub","specs":"Retreat to our Master Suite With View and Bathtub, featuring 305 sq. ft. of space with breathtaking Dhauladhar Range views, and a luxurious bathtub—an ideal haven for up to 4 guests.","image":"images/hotels/himachal-pradesh/dharamshala/meghavan-resort/room-master-suite-with-view-and-bathtub.webp"}
    ],
    sections: [
      {"title":"Savour Exquisite Food in Dharamshala","text":"At Meghavan Resort, dining becomes a memorable experience. Savour a delightful range of multi-cuisine dishes at the vibrant Rainbow Restaurant, where every meal is a treat. For a more laid-back vibe, head to our garden café, nestled by the garden, offering a charming blend of indoor and outdoor seating—perfect for enjoying coffee, snacks, and serene moments.","image":"images/hotels/himachal-pradesh/dharamshala/meghavan-resort/dining.webp"},
      {"title":"Top Venues for Your Unforgettable Events","text":"Meghavan Resort features versatile event spaces for every need. The Yoga Hall (2,000 sq. ft.) is perfect for corporate and social events, hosting up to 80 guests with flexible seating arrangements. The Conference Hall (4,000 sq. ft.) accommodates up to 125 guests, ideal for larger gatherings. For outdoor events, the Garden Area (3,000 sq. ft.) offers a charming setting for parties and bonfires, with space for up to 120 guests. Each venue is designed to ensure a seamless and memorable experience.","image":"images/hotels/himachal-pradesh/dharamshala/meghavan-resort/events.webp"}
    ],
    gallery: [
      "images/hotels/himachal-pradesh/dharamshala/meghavan-resort/photo-02.webp",
      "images/hotels/himachal-pradesh/dharamshala/meghavan-resort/photo-03.webp",
      "images/hotels/himachal-pradesh/dharamshala/meghavan-resort/photo-04.webp",
      "images/hotels/himachal-pradesh/dharamshala/meghavan-resort/photo-05.webp",
      "images/hotels/himachal-pradesh/dharamshala/meghavan-resort/photo-06.webp",
      "images/hotels/himachal-pradesh/dharamshala/meghavan-resort/photo-07.webp",
      "images/hotels/himachal-pradesh/dharamshala/meghavan-resort/photo-08.webp",
      "images/hotels/himachal-pradesh/dharamshala/meghavan-resort/dining.webp",
      "images/hotels/himachal-pradesh/dharamshala/meghavan-resort/events.webp"
    ]
  },

  {
    id: "spring-valley-resort",
    category: "resorts",
    state: "Himachal Pradesh",
    city: "Dharamshala",
    name: "Spring Valley Resort",
    tagline: "A Mountain Resort in Dharamshala, Like No Other",
    description: "Perched on the scenic Bhagsunag Road, near the bustling charm of McLeod Ganj, Spring Valley Resort offers a harmonious blend of tranquillity and modern comfort. Our 4-star hotel in Dharamshala invites travellers to experience the enchanting beauty of the mountains while enjoying exceptional hospitality.",
    about: "Perched on the scenic Bhagsunag Road, near the bustling charm of McLeod Ganj, Spring Valley Resort offers a harmonious blend of tranquillity and modern comfort. Our 4-star hotel in Dharamshala invites travellers to experience the enchanting beauty of the mountains while enjoying exceptional hospitality. With five thoughtfully designed accommodation categories, most of them with breathtaking mountain view options, and our vibrant restaurant serving multi-cuisine delights, every moment here is crafted for your delight. Whether you're seeking a romantic escape, a family retreat, or a peaceful staycation, our resort stands as a testament to comfort, care, and convenience.",
    image: "images/hotels/himachal-pradesh/dharamshala/spring-valley-resort/main.webp",
    address: "Bhagsunag Road, Upper McLeod Ganj, Dharamshala, Himachal Pradesh - 176219",
    location: {lat: 32.24304,lon: 76.33189},
    highlights: [
      "Spa",
      "Restaurant",
      "Conference Hall",
      "Bonfire & BBQ",
      "Garden",
      "Open Terrace",
      "Doctor-on-call",
      "Free Parking",
      "24/7 Customer Support"
    ],
    rooms: [
      {"name":"Deluxe Room","specs":"The 180 sq. ft. Deluxe Room offers a serene retreat for up to 4 guests. Perfect for unwinding after a day of exploring, this room combines simplicity and thoughtful amenities to create a relaxing escape.","image":"images/hotels/himachal-pradesh/dharamshala/spring-valley-resort/room-deluxe-room.webp"},
      {"name":"Premium Room","specs":"Spanning 220 sq. ft., the Premium Room with mountain view accommodates up to 4 people, offering breathtaking mountain vistas. With a private balcony and modern conveniences, it's ideal for a rejuvenating getaway.","image":"images/hotels/himachal-pradesh/dharamshala/spring-valley-resort/room-premium-room.webp"},
      {"name":"Luxury Cottage","specs":"The 220 sq. ft. Luxury Cottage, designed for up to 4 guests, blends natural beauty with contemporary features. Enjoy the tranquillity of mountain views from your balcony in this charming retreat.","image":"images/hotels/himachal-pradesh/dharamshala/spring-valley-resort/room-luxury-cottage.webp"},
      {"name":"Spring Suite","specs":"Stylish and spacious at 200 sq. ft., the Spring Suite accommodates up to 4 guests. It features a balcony overlooking the serene mountains, offering the perfect blend of elegance and relaxation.","image":"images/hotels/himachal-pradesh/dharamshala/spring-valley-resort/room-spring-suite.webp"},
      {"name":"Spring Duplex","specs":"At 270 sq. ft., the Spring Duplex is a two-level haven for a maximum of 7 guests. With a private balcony and stunning mountain views, this duplex is perfect for families or groups seeking unmatched comfort and space.","image":"images/hotels/himachal-pradesh/dharamshala/spring-valley-resort/room-spring-duplex.webp"}
    ],
    sections: [
      {"title":"Relish the Flavours of the Hills","text":"Indulge in a culinary journey at our vibrant multi-cuisine restaurant at our resort in Dharamshala. With its inviting indoor setting and diverse menu, every meal here is crafted to delight and inspire.","image":"images/hotels/himachal-pradesh/dharamshala/spring-valley-resort/dining.webp"},
      {"title":"Crafting Memorable Events","text":"From intimate meetings to lively gatherings, our conference hall offers the perfect blend of functionality and charm, ensuring your every event is unforgettable.","image":"images/hotels/himachal-pradesh/dharamshala/spring-valley-resort/events.webp"},
      {"title":"Relax, Renew, and Revitalise","text":"Experience pure relaxation at Soul Spa, the wellness retreat at Spring Valley Resort Dharamshala. Offering indulgent full-body massages, it's the ideal escape to rejuvenate your senses while surrounded by the serene charm of Dharamshala.","image":"images/hotels/himachal-pradesh/dharamshala/spring-valley-resort/spa.webp"}
    ],
    gallery: [
      "images/hotels/himachal-pradesh/dharamshala/spring-valley-resort/main.webp",
      "images/hotels/himachal-pradesh/dharamshala/spring-valley-resort/photo-01.webp",
      "images/hotels/himachal-pradesh/dharamshala/spring-valley-resort/photo-04.webp",
      "images/hotels/himachal-pradesh/dharamshala/spring-valley-resort/photo-05.webp",
      "images/hotels/himachal-pradesh/dharamshala/spring-valley-resort/spa.webp",
      "images/hotels/himachal-pradesh/dharamshala/spring-valley-resort/dining.webp",
      "images/hotels/himachal-pradesh/dharamshala/spring-valley-resort/events.webp"
    ]
  },

  {
    id: "whispering-winds",
    category: "hotels",
    state: "Himachal Pradesh",
    city: "Kasauli",
    name: "Whispering Winds",
    tagline: "A Mountain-scaped Stay at The Best Hotel in Kasauli",
    description: "Nestled amidst the serene hills of Kasauli, Whispering Winds is a charming 3-star hotel in Kasauli offering an idyllic escape, perfect for a relaxing staycation. This haven provides a welcoming atmosphere and convenient access to major tourist attractions such as Kasauli Mall Road and Dharampur.",
    about: "Nestled amidst the serene hills of Kasauli, Whispering Winds is a charming 3-star hotel in Kasauli offering an idyllic escape, perfect for a relaxing staycation. This haven provides a welcoming atmosphere and convenient access to major tourist attractions such as Kasauli Mall Road and Dharampur. With 20 well-appointed rooms and an inviting on-site restaurant, it's a delightful choice for those seeking comfort and convenience. At our luxury hotel in Kasauli, guests can unwind in the indoor game zone featuring foosball and table tennis or make use of the spacious conference hall. For visitors looking for the best hotels in Kasauli, this retreat offers a tranquil base for exploration and relaxation.",
    image: "images/hotels/himachal-pradesh/kasauli/whispering-winds/main.webp",
    address: "Sector 5, Kasauli, Himachal Pradesh - 173220",
    location: {lat: 30.89696,lon: 77.00894},
    highlights: [
      "Indoor Game Zone",
      "24/7 Customer Support",
      "Travel Desk",
      "Event Hall",
      "Restaurant",
      "Free Parking",
      "CCTV Surveillance",
      "Elevator"
    ],
    rooms: [
      {"name":"Deluxe Room","specs":"Deluxe Rooms feature balconies with breathtaking forest views, providing a picturesque backdrop for your stay.","image":"images/hotels/himachal-pradesh/kasauli/whispering-winds/room-deluxe-room.webp"},
      {"name":"Premium Room","specs":"Wake up to nature's beauty each morning with mountain views from the balcony of our Premium Rooms. Designed for comfort and relaxation, they provide an ideal retreat.","image":"images/hotels/himachal-pradesh/kasauli/whispering-winds/room-premium-room.webp"}
    ],
    sections: [
      {"title":"A Culinary Feast for the Senses","text":"Experience exquisite fine dining at our restaurant, complemented by stunning hill views from the terrace. Our restaurant seamlessly blends elegant indoor dining with open terrace areas, allowing guests to savour diverse multi-cuisine dishes amidst scenic beauty. Perfect for romantic dinners or family gatherings, our restaurant provides a sophisticated and welcoming atmosphere for memorable culinary moments.","image":"images/hotels/himachal-pradesh/kasauli/whispering-winds/dining.webp"},
      {"title":"An Elegant Space for Events and Business","text":"Host unforgettable events at Whispering Wind Hall, a spacious 3,000 sq. ft. venue that comfortably accommodates up to 50 guests. Equipped with modern facilities, it is ideal for meetings, seminars, and social gatherings. This versatile space provides a professional and welcoming atmosphere, ensuring your events are memorable.","image":"images/hotels/himachal-pradesh/kasauli/whispering-winds/spa.webp"}
    ],
    gallery: [
      "images/hotels/himachal-pradesh/kasauli/whispering-winds/main.webp",
      "images/hotels/himachal-pradesh/kasauli/whispering-winds/photo-01.webp",
      "images/hotels/himachal-pradesh/kasauli/whispering-winds/photo-02.webp",
      "images/hotels/himachal-pradesh/kasauli/whispering-winds/room-premium-room.webp",
      "images/hotels/himachal-pradesh/kasauli/whispering-winds/photo-03.webp",
      "images/hotels/himachal-pradesh/kasauli/whispering-winds/photo-04.webp",
      "images/hotels/himachal-pradesh/kasauli/whispering-winds/spa.webp",
      "images/hotels/himachal-pradesh/kasauli/whispering-winds/photo-05.webp",
      "images/hotels/himachal-pradesh/kasauli/whispering-winds/photo-06.webp",
      "images/hotels/himachal-pradesh/kasauli/whispering-winds/photo-07.webp",
      "images/hotels/himachal-pradesh/kasauli/whispering-winds/photo-08.webp",
      "images/hotels/himachal-pradesh/kasauli/whispering-winds/photo-09.webp",
      "images/hotels/himachal-pradesh/kasauli/whispering-winds/photo-10.webp",
      "images/hotels/himachal-pradesh/kasauli/whispering-winds/photo-11.webp",
      "images/hotels/himachal-pradesh/kasauli/whispering-winds/photo-12.webp",
      "images/hotels/himachal-pradesh/kasauli/whispering-winds/room-deluxe-room.webp"
    ]
  },

  {
    id: "hotel-devlok",
    category: "hotels",
    state: "Himachal Pradesh",
    city: "Manali",
    name: "Hotel Devlok",
    tagline: "Your Perfect Snow Retreat in Manali",
    description: "Tucked away in the serene surroundings of Hadimba Temple Road, Hotel Devlok offers the perfect retreat in the heart of Manali. Surrounded by the stunning Himalayan peaks, our 3-star hotel in Manali provides a tranquil escape, where comfort meets nature.",
    about: "Tucked away in the serene surroundings of Hadimba Temple Road, Hotel Devlok offers the perfect retreat in the heart of Manali. Surrounded by the stunning Himalayan peaks, our 3-star hotel in Manali provides a tranquil escape, where comfort meets nature. Experience a stay like no other with our thoughtfully designed accommodations, exceptional dining, and personalised service. Whether you're here for a peaceful getaway, a romantic retreat, or a family vacation, Hotel Devlok promises an unforgettable stay with every comfort and convenience at your fingertips. Let us take care of the details while you immerse yourself in the beauty and serenity of Manali.",
    image: "images/hotels/himachal-pradesh/manali/hotel-devlok/photo-02.webp",
    address: "Hadimba Temple Road, Siyal, Manali, Himachal Pradesh - 175131",
    location: {lat: 32.24808,lon: 77.18393},
    highlights: [
      "Multi-cuisine Restaurant",
      "Travel Desk",
      "Free Parking",
      "Garden Area",
      "Doctor-on-call (Chargeable)",
      "24/7 Customer Support"
    ],
    rooms: [
      {"name":"Deluxe Non-View Room","specs":"The Deluxe Non-View Room offers 216 sq. ft. of space, accommodating up to 4 guests.","image":"images/hotels/himachal-pradesh/manali/hotel-devlok/room-deluxe-non-view-room.webp"},
      {"name":"Super Deluxe Room","specs":"The Super Deluxe Room provides 252 sq. ft. of space, perfect for up to 4 guests, with scenic city views.","image":"images/hotels/himachal-pradesh/manali/hotel-devlok/room-super-deluxe-room.webp"},
      {"name":"Family Room","specs":"The Family Room features 572 sq. ft. of space, including a hall with two king size beds, ideal for up to 6 guests.","image":"images/hotels/himachal-pradesh/manali/hotel-devlok/room-family-room.webp"},
      {"name":"Family Suite","specs":"The Family Suite offers 572 sq. ft. of space with two interconnected rooms, perfect for up to 6 guests seeking comfort and privacy.","image":"images/hotels/himachal-pradesh/manali/hotel-devlok/room-family-suite.webp"}
    ],
    sections: [
      {"title":"A Meal Above the Clouds","text":"Indulge in a memorable dining experience at one of the best hotels in Manali. Our multi-cuisine restaurant offers a delightful range of dishes, from buffet spreads to a la carte options. Whether you choose the cosy indoor ambience or enjoy a peaceful meal in our outdoor garden, every bite promises to satisfy your cravings.","image":"images/hotels/himachal-pradesh/manali/hotel-devlok/dining.webp"}
    ],
    gallery: [
      "images/hotels/himachal-pradesh/manali/hotel-devlok/photo-02.webp",
      "images/hotels/himachal-pradesh/manali/hotel-devlok/photo-03.webp",
      "images/hotels/himachal-pradesh/manali/hotel-devlok/photo-05.webp",
      "images/hotels/himachal-pradesh/manali/hotel-devlok/photo-06.webp",
      "images/hotels/himachal-pradesh/manali/hotel-devlok/photo-07.webp",
      "images/hotels/himachal-pradesh/manali/hotel-devlok/photo-08.webp",
      "images/hotels/himachal-pradesh/manali/hotel-devlok/room-deluxe-non-view-room.webp",
      "images/hotels/himachal-pradesh/manali/hotel-devlok/room-super-deluxe-room.webp",
      "images/hotels/himachal-pradesh/manali/hotel-devlok/room-family-room.webp",
      "images/hotels/himachal-pradesh/manali/hotel-devlok/room-family-suite.webp",
      "images/hotels/himachal-pradesh/manali/hotel-devlok/dining.webp"
    ]
  },

  {
    id: "kapoor-resort",
    category: "resorts",
    state: "Himachal Pradesh",
    city: "Manali",
    name: "Kapoor Resort",
    tagline: "The Best Resort in Manali",
    description: "Manali, with its snow-capped peaks, lush valleys, and crystal-clear rivers, offers the perfect blend of natural beauty and adventure, making it an ideal destination for every traveller. In the heart of this serene landscape, Kapoor Resort invites you to experience a serene retreat, at the best hotel in Manali, recognised for its exceptional service.",
    about: "Manali, with its snow-capped peaks, lush valleys, and crystal-clear rivers, offers the perfect blend of natural beauty and adventure, making it an ideal destination for every traveller. In the heart of this serene landscape, Kapoor Resort invites you to experience a serene retreat, at the best hotel in Manali, recognised for its exceptional service. We also offer accommodations and dining facilities that feel like a homely escape. Enjoy thoughtful facilities such as a lawn with scenic views of the mountains, where bonfires are arranged on a chilly night. With 24/7 customer support, we ensure your safety and convenience throughout your stay in Manali. Book your escape today at our luxury resort in Manali and discover the magic of this hill station at Kapoor Resort!",
    image: "images/hotels/himachal-pradesh/manali/kapoor-resort/photo-02.webp",
    address: "Hadimba Temple Road, Manali, Himachal Pradesh - 175131",
    location: {lat: 32.24829,lon: 77.18394},
    highlights: [
      "Multi-cuisine Restaurant",
      "Doctor-on-call (Chargeable)",
      "24-hour Travel Desk",
      "24/7 Customer Support",
      "Bonfire & BBQ (Chargeable)",
      "Free Parking"
    ],
    rooms: [
      {"name":"Deluxe Non-View Room","specs":"Cosy in up in our Deluxe Non-View Rooms, which are perfect for a comfortable stay. These 216 sq. ft. rooms can accommodate up to 4 guests. With 10 rooms available, we ensure a seamless stay.","image":"images/hotels/himachal-pradesh/manali/kapoor-resort/room-deluxe-non-view-room.webp"},
      {"name":"Super Deluxe Room","specs":"Looking for a bit more space? Our Super Deluxe Rooms offer 252 sq. ft. of comfort and can also accommodate up to 4 guests. With 15 rooms available, you're sure to find the perfect spot to relax and unwind.","image":"images/hotels/himachal-pradesh/manali/kapoor-resort/room-super-deluxe-room.webp"}
    ],
    sections: [
      {"title":"Experience the Art of Dining","text":"Craving Indian, Chinese, or something else? Our multi-cuisine restaurant is your one-stop shop for a culinary adventure! Our menu offers a diverse range of flavours, perfect for sharing with friends or enjoying a solo meal. Come experience the taste of the world.","image":"images/hotels/himachal-pradesh/manali/kapoor-resort/dining.webp"}
    ],
    gallery: [
      "images/hotels/himachal-pradesh/manali/kapoor-resort/photo-01.webp",
      "images/hotels/himachal-pradesh/manali/kapoor-resort/photo-02.webp",
      "images/hotels/himachal-pradesh/manali/kapoor-resort/photo-03.webp",
      "images/hotels/himachal-pradesh/manali/kapoor-resort/photo-04.webp",
      "images/hotels/himachal-pradesh/manali/kapoor-resort/photo-05.webp",
      "images/hotels/himachal-pradesh/manali/kapoor-resort/photo-06.webp",
      "images/hotels/himachal-pradesh/manali/kapoor-resort/photo-07.webp",
      "images/hotels/himachal-pradesh/manali/kapoor-resort/room-deluxe-non-view-room.webp",
      "images/hotels/himachal-pradesh/manali/kapoor-resort/room-super-deluxe-room.webp",
      "images/hotels/himachal-pradesh/manali/kapoor-resort/dining.webp"
    ]
  },

  {
    id: "la-serene-valley",
    category: "hotels",
    state: "Himachal Pradesh",
    city: "Manali",
    name: "La Serene Valley",
    tagline: "Your Ideal 4-Star Hotel in Manali",
    description: "Manali, where snow-capped peaks kiss the skies and rivers hum nature's melody, sets the perfect backdrop for unforgettable escapes. Located on Kullu-Naggar Manali Road, La Serene Valley redefines comfort and convenience in the heart of this Himalayan paradise.",
    about: "Manali, where snow-capped peaks kiss the skies and rivers hum nature's melody, sets the perfect backdrop for unforgettable escapes. Located on Kullu-Naggar Manali Road, La Serene Valley redefines comfort and convenience in the heart of this Himalayan paradise. Rated an impressive 4.8 out of 5 on Google and located 1.5 km from Mall Road, our 4-star hotel in Manali is designed for travellers seeking more than just a stay. Whether you're planning a romantic getaway, a family retreat, or a peaceful staycation, our thoughtfully curated accommodations promise a home-like ambience. Indulge in delightful dining at our multi-cuisine restaurant, and create cherished memories with your loved ones. We ensure round-the-clock customer support for a seamless experience. At La Serene Valley, every detail is tailored to make your journey exceptional. So, why wait? Your Manali adventure starts here!",
    image: "images/hotels/himachal-pradesh/manali/la-serene-valley/main.webp",
    address: "Left Bank Area, Naggar Road, Manali, Himachal Pradesh -175131",
    location: {lat: 32.23318,lon: 77.19368},
    highlights: [
      "Multi-cuisine Restaurant",
      "Event Space",
      "Travel Desk",
      "24/7 Customer Support",
      "Free Parking",
      "Bonfire",
      "DJ Nights",
      "Game Zone"
    ],
    rooms: [
      {"name":"Deluxe Room","specs":"Spanning 168 sq. ft., our 13 Deluxe Rooms offer a cosy retreat for up to 3 guests. Perfect for a serene escape, these rooms blend comfort with simplicity.","image":"images/hotels/himachal-pradesh/manali/la-serene-valley/room-deluxe-room.webp"},
      {"name":"Super Deluxe Room","specs":"Unwind in one of our 10 Super Deluxe Rooms, covering 168 sq. ft., each with a private balcony. Ideal for up to 4 guests, these rooms invite you to relax and enjoy Manali's crisp mountain air.","image":"images/hotels/himachal-pradesh/manali/la-serene-valley/room-super-deluxe-room.webp"},
      {"name":"Honeymoon Suite","specs":"Crafted for romance, our four Honeymoon Suites cover 192 sq. ft. and feature a luxurious round bed, a sofa set, and a balcony. Accommodating up to 3 guests, this space sets the tone for unforgettable moments.","image":"images/hotels/himachal-pradesh/manali/la-serene-valley/room-honeymoon-suite.webp"},
      {"name":"Family Suite (3-Bedded)","specs":"Our three spacious Family Suites span 270 sq. ft., comfortably hosting up to 4 guests. A king size bed and single bed ensure ample space for your family's comfort.","image":"images/hotels/himachal-pradesh/manali/la-serene-valley/room-honeymoon-suite.webp"},
      {"name":"Family Suite (4-Bedded)","specs":"With 270 sq. ft. of space, our two Family Suites are tailored for larger families, accommodating up to 6 guests. Featuring a king size bed and two single beds, they offer both space and style.","image":"images/hotels/himachal-pradesh/manali/la-serene-valley/room-family-suite-4-bedded.webp"}
    ],
    sections: [
      {"title":"Flavours That Speak to Your Soul","text":"Step into our vibrant multi-cuisine restaurant, and let your taste buds embark on a flavourful journey! From hearty breakfasts to indulgent dinners, we serve it all with a side of smiles. With an open terrace setting, it's where delicious food meets scenic vibes. Ready to dig in?","image":"images/hotels/himachal-pradesh/manali/la-serene-valley/dining.webp"},
      {"title":"From Meetings to Milestones","text":"Host unforgettable moments in our pillarless event space, perfect for meetings, celebrations, and gatherings. With a capacity to accommodate up to 50 guests, it's equipped with modern amenities like Wi-Fi, projectors, and AV equipment. Your next big event deserves a space as dynamic as your vision.","image":"images/hotels/himachal-pradesh/dharamshala/anupam-resort/events.webp"}
    ],
    gallery: [
      "images/hotels/himachal-pradesh/manali/la-serene-valley/main.webp",
      "images/hotels/himachal-pradesh/manali/la-serene-valley/photo-01.webp",
      "images/hotels/himachal-pradesh/manali/la-serene-valley/dining.webp",
      "images/hotels/himachal-pradesh/manali/la-serene-valley/room-super-deluxe-room.webp",
      "images/hotels/himachal-pradesh/manali/la-serene-valley/room-deluxe-room.webp",
      "images/hotels/himachal-pradesh/manali/la-serene-valley/photo-02.webp",
      "images/hotels/himachal-pradesh/manali/la-serene-valley/photo-03.webp",
      "images/hotels/himachal-pradesh/manali/la-serene-valley/room-honeymoon-suite.webp",
      "images/hotels/himachal-pradesh/manali/la-serene-valley/room-family-suite-4-bedded.webp",
      "images/hotels/himachal-pradesh/dharamshala/anupam-resort/events.webp"
    ]
  },

  {
    id: "hillcrest-resort",
    category: "resorts",
    state: "Himachal Pradesh",
    city: "Shimla",
    name: "Hillcrest Resort",
    tagline: "Escape to the Hills, Where Peace Instils",
    description: "Mashobra, a charming town nestled in the tranquil hills of Himachal Pradesh, is known for its peaceful ambience, verdant landscapes, and stunning views of the surrounding mountains. It is the perfect destination for those seeking a serene retreat amidst nature.",
    about: "Mashobra, a charming town nestled in the tranquil hills of Himachal Pradesh, is known for its peaceful ambience, verdant landscapes, and stunning views of the surrounding mountains. It is the perfect destination for those seeking a serene retreat amidst nature. Tucked away in the tranquil hills near Mashobra, Hillcrest Resort offers the perfect escape for both leisure and corporate travellers. Approximately 18 km from Shimla Railway Station and about 21 km from ISBT Shimla (New Bus Stand), our resort provides a peaceful retreat away from the crowds, yet remains easily accessible. Surrounded by lush pine forests and offering panoramic views of the mountains, our resort in Mashobra, Shimla, is ideal for those looking to relax and recharge, while providing a serene and productive environment for corporate guests. With a multi-cuisine restaurant serving a variety of flavours and a versatile event space for meetings or celebrations, we offer everything you need for a memorable stay.",
    image: "images/hotels/himachal-pradesh/shimla/hillcrest-resort/main.webp",
    address: "Mashobra-Naldehra Road, Sadhora, Himachal Pradesh - 171007",
    location: {lat: 31.15745,lon: 77.20907},
    highlights: [
      "Multi-cuisine Restaurant",
      "Event Space",
      "Travel Desk",
      "Gym",
      "Lawn",
      "Table Tennis Space",
      "Free Parking Space",
      "24-hour Customer Service"
    ],
    rooms: [
      {"name":"Deluxe Room","specs":"These rooms span 132 sq. ft. of comfort for up to 4 guests, featuring a king size bed and stunning views for a restful, stylish stay.","image":"images/hotels/himachal-pradesh/shimla/hillcrest-resort/room-deluxe-room.webp"},
      {"name":"Super Deluxe Room","specs":"These rooms, spanning 160 sq. ft., feature a king size bed, accommodate up to 4 guests, and offer stunning views, perfect for a relaxing family stay.","image":"images/hotels/himachal-pradesh/shimla/hillcrest-resort/room-super-deluxe-room.webp"},
      {"name":"Executive Premium Room","specs":"Stay in our Executive Premium Room, which spans 204 sq. ft., featuring a king size bed, a sofa set, and mountain views, ideal for up to 4 guests seeking comfort and relaxation.","image":"images/hotels/himachal-pradesh/shimla/hillcrest-resort/room-executive-premium-room.webp"},
      {"name":"Suite","specs":"Indulge in our suites that offer mountain views, spanning 240 sq. ft., accommodating up to 4 guests with a king size bed and sofa set for a perfect blend of comfort and space.","image":"images/hotels/himachal-pradesh/shimla/hillcrest-resort/room-suite.webp"}
    ],
    sections: [
      {"title":"Taste the Best of Every Cuisine","text":"Embark on a culinary journey like never before with our buffet, where every dish tells a story of flavour and freshness! From savoury starters to indulgent desserts, each bite is a celebration of taste. With a delightful spread that caters to every craving, our buffet promises an unforgettable dining experience for every guest.","image":"images/hotels/himachal-pradesh/shimla/hillcrest-resort/dining.webp"},
      {"title":"Host Seamless Meetings in Our Premium Space","text":"Our event space, spanning 1,500 sq. ft., is the perfect setting for your next meeting or corporate gathering, accommodating up to 80-100 guests. Designed for productivity and comfort, it offers a professional ambience with modern amenities, ensuring a seamless experience. Whether it's a seminar, workshop, or team discussion, our versatile venue is designed to cater to your requirements. Combined with exceptional service and seamless execution, Hillcrest stands as the best resort near Shimla for all types of gatherings.","image":"images/hotels/himachal-pradesh/shimla/hillcrest-resort/spa.webp"}
    ],
    gallery: [
      "images/hotels/himachal-pradesh/shimla/hillcrest-resort/main.webp",
      "images/hotels/himachal-pradesh/shimla/hillcrest-resort/photo-01.webp",
      "images/hotels/himachal-pradesh/shimla/hillcrest-resort/photo-02.webp",
      "images/hotels/himachal-pradesh/shimla/hillcrest-resort/photo-03.webp",
      "images/hotels/himachal-pradesh/shimla/hillcrest-resort/photo-04.webp",
      "images/hotels/himachal-pradesh/shimla/hillcrest-resort/photo-05.webp",
      "images/hotels/himachal-pradesh/shimla/hillcrest-resort/photo-06.webp",
      "images/hotels/himachal-pradesh/shimla/hillcrest-resort/photo-07.webp",
      "images/hotels/himachal-pradesh/shimla/hillcrest-resort/photo-08.webp",
      "images/hotels/himachal-pradesh/shimla/hillcrest-resort/photo-09.webp",
      "images/hotels/himachal-pradesh/shimla/hillcrest-resort/room-deluxe-room.webp",
      "images/hotels/himachal-pradesh/shimla/hillcrest-resort/room-super-deluxe-room.webp",
      "images/hotels/himachal-pradesh/shimla/hillcrest-resort/room-executive-premium-room.webp",
      "images/hotels/himachal-pradesh/shimla/hillcrest-resort/room-suite.webp",
      "images/hotels/himachal-pradesh/shimla/hillcrest-resort/dining.webp",
      "images/hotels/himachal-pradesh/shimla/hillcrest-resort/spa.webp"
    ]
  },

  {
    id: "the-rock-castle",
    category: "hotels",
    state: "Himachal Pradesh",
    city: "Shimla",
    name: "The Rock Castle",
    tagline: "A Slice of History with a View",
    description: "Shimla is a stunning hill station perched atop seven scenic hills, offering a perfect blend of breathtaking views, colonial charm, and refreshing mountain air. For those seeking a peaceful retreat, The Rock Castle provides the ideal escape.",
    about: "Shimla is a stunning hill station perched atop seven scenic hills, offering a perfect blend of breathtaking views, colonial charm, and refreshing mountain air. For those seeking a peaceful retreat, The Rock Castle provides the ideal escape. Our hotel in Shimla, once a graceful 20th-century hotel has been beautifully transformed into a modern haven of comfort and elegance. Located around 4 km from ISBT Shimla (New Bus Stand) and about 17 km from Shimla Airport, it offers easy access to the city's top attractions. Whether you're here for business, a romantic getaway, or simply to relax, our accommodations combine tranquillity with convenience. Enjoy a cosy bonfire under the stars or savour delicious meals at our multi-cuisine restaurant, all while soaking in the breathtaking hill views.",
    image: "images/hotels/himachal-pradesh/shimla/the-rock-castle/main.webp",
    address: "NH 22, near Sankat Mochan, Shimla, Himachal Pradesh - 171010",
    location: {lat: 31.09063,lon: 77.13794},
    highlights: [
      "Multi-cuisine Restaurant",
      "Event Space",
      "Travel Desk",
      "Free Parking Space",
      "Bonfire",
      "24-hour Customer Service"
    ],
    rooms: [
      {"name":"Deluxe Room","specs":"Our Deluxe Room features a cosy king-size bed, offering a peaceful stay for up to 3 guests in a comfortable setting.","image":"images/hotels/himachal-pradesh/shimla/the-rock-castle/room-deluxe-room.webp"},
      {"name":"Super Deluxe Room","specs":"The Super Deluxe Room offers a plush king size bed, accommodating up to 4 guests. Perfect for couples or small groups, it boasts stunning mountain views for a serene experience.","image":"images/hotels/himachal-pradesh/shimla/the-rock-castle/room-super-deluxe-room.webp"},
      {"name":"Executive Room","specs":"Our Executive Room features a luxurious king size bed, accommodating up to 4 guests. Perfect for families or small groups, it offers stunning nature views for a tranquil stay.","image":"images/hotels/himachal-pradesh/shimla/the-rock-castle/room-executive-room.webp"}
    ],
    sections: [
      {"title":"Sky's the Limit, Taste Every Minute","text":"Royal Orchid is our exquisite multi-cuisine restaurant, offers a memorable dining experience with stunning hill views. Enjoy a diverse selection of delicious dishes in a serene and elegant ambience, with the added charm of outdoor space for a refreshing dining experience. Whether you're indulging in local specialities or international flavours, we promise a truly unique and relaxing experience, enhanced by breathtaking scenery.","image":"images/hotels/himachal-pradesh/shimla/the-rock-castle/dining.webp"},
      {"title":"Elegant Venue for Every Occasion","text":"Our elegant banquet hall, spanning 700 sq. ft., offers the perfect blend of style and versatility for your next event. Whether you're hosting a conference, meeting, or wedding, this space comfortably accommodates up to 40 guests, ensuring a memorable experience for all. Let us help you make your event truly special!","image":"images/hotels/himachal-pradesh/shimla/the-rock-castle/events.webp"}
    ],
    gallery: [
      "images/hotels/himachal-pradesh/shimla/the-rock-castle/main.webp",
      "images/hotels/himachal-pradesh/shimla/the-rock-castle/photo-01.webp",
      "images/hotels/himachal-pradesh/shimla/the-rock-castle/photo-02.webp",
      "images/hotels/himachal-pradesh/shimla/the-rock-castle/photo-03.webp",
      "images/hotels/himachal-pradesh/shimla/the-rock-castle/photo-04.webp",
      "images/hotels/himachal-pradesh/shimla/the-rock-castle/dining.webp",
      "images/hotels/himachal-pradesh/shimla/the-rock-castle/events.webp",
      "images/hotels/himachal-pradesh/shimla/the-rock-castle/photo-05.webp",
      "images/hotels/himachal-pradesh/shimla/the-rock-castle/room-deluxe-room.webp",
      "images/hotels/himachal-pradesh/shimla/the-rock-castle/room-super-deluxe-room.webp",
      "images/hotels/himachal-pradesh/shimla/the-rock-castle/room-executive-room.webp"
    ]
  },

  {
    id: "hotel-amritsar",
    category: "hotels",
    state: "Punjab",
    city: "Amritsar",
    name: "Hotel Amritsar",
    tagline: "200 Steps from the Golden Temple",
    description: "Few cities in India stir the soul quite like Amritsar. Its lanes echo with history, its mornings carry the scent of incense, and its evenings glow at the Golden Temple.",
    about: "Few cities in India stir the soul quite like Amritsar. Its lanes echo with history, its mornings carry the scent of incense, and its evenings glow at the Golden Temple. Hotel Amritsar places you at the centre of it all. Located around 200 steps from the Golden Temple, the Partition Museum, and Heritage Street, our hotel in Amritsar makes it easy to explore the city at your own pace. Whether you are visiting for spiritual reasons, corporate travel, or to discover Punjab's rich past, the central location adds unmatched convenience. Our accommodations are designed for simple, genuine comfort, clean, well-appointed, and welcoming after a long day out. The in-house restaurant serves flavourful meals that reflect the local taste and culture. What truly sets us apart as a great hotel near the Golden Temple is the consistency of the experience: warm hospitality, thoughtful facilities, and a location close to the city's most iconic landmarks. For travellers who want to feel connected to the city without compromise, Hotel Amritsar is simply the right address.",
    image: "images/hotels/punjab/amritsar/hotel-amritsar/photo-01.webp",
    address: "58-59, Bazaar Bakarwana, near Golden Temple Way, Ghee Mandi, Town Hall, Katra Ahluwalia, Amritsar, Amritsar Cantt., Punjab - 143006",
    location: {lat: 31.62401,lon: 74.8811},
    highlights: [
      "Multi-cuisine Vegetarian Restaurant",
      "Cafe",
      "24-hour Customer Support",
      "Laundry Service (Chargeable)",
      "Just 6 minutes away from Amritsar Railway Station"
    ],
    gallery: [
      "images/hotels/punjab/amritsar/hotel-amritsar/photo-01.webp",
      "images/hotels/punjab/amritsar/hotel-amritsar/photo-02.webp",
      "images/hotels/punjab/amritsar/hotel-amritsar/photo-03.webp",
      "images/hotels/punjab/amritsar/hotel-amritsar/photo-04.webp",
      "images/hotels/punjab/amritsar/hotel-amritsar/photo-05.webp",
      "images/hotels/punjab/amritsar/hotel-amritsar/photo-06.webp",
      "images/hotels/punjab/amritsar/hotel-amritsar/photo-07.webp",
      "images/hotels/punjab/amritsar/hotel-amritsar/photo-08.webp",
      "images/hotels/punjab/amritsar/hotel-amritsar/photo-09.webp",
      "images/hotels/punjab/amritsar/hotel-amritsar/photo-10.webp",
      "images/hotels/punjab/amritsar/hotel-amritsar/photo-11.webp"
    ]
  },

  {
    id: "tehri-club-resort",
    category: "resorts",
    state: "Uttarakhand",
    city: "Chamba (Tehri)",
    name: "Tehri Club Resort",
    tagline: "Best Resort in Chamba, Uttarakhand",
    description: "Surrounded by the towering peaks of the mighty Himalayas, Tehri offers a serene escape where the crisp mountain air and endless landscapes invite you to relax and reconnect with nature. In this tranquil corner of the world, Tehri Club Resort stands as the best resort in Chamba, Uttarakhand, welcoming you to unwind in the heart of the mountains.",
    about: "Surrounded by the towering peaks of the mighty Himalayas, Tehri offers a serene escape where the crisp mountain air and endless landscapes invite you to relax and reconnect with nature. In this tranquil corner of the world, Tehri Club Resort stands as the best resort in Chamba, Uttarakhand, welcoming you to unwind in the heart of the mountains. Our 4-star property in Tehri features premium accommodations that open up to breathtaking views of the Himalayan foothills, creating the perfect backdrop for relaxation. After a day spent soaking in the mountain serenity, indulge in a rejuvenating spa treatment, take a refreshing dip in the swimming pool, or stay energised with a workout at our gym. As the best resort in Chamba, Uttarakhand, for both leisure and celebrations, our elegant banquet halls set the stage for your special moments, while our travel desk ensures a seamless experience. At Tehri Club Resort, the beauty of the mountains blends effortlessly with the luxury of comfort, making your stay in Tehri truly unforgettable.",
    image: "images/hotels/uttarakhand/chamba-tehri/tehri-club-resort/main.webp",
    address: "Badshahi Taul, Club and Resort, Chamba, New Tehri Rd., Near Hanuman Mandir, Badshithaul, New Tehri, Chamba, Uttarakhand - 249145",
    location: {lat: 30.34507,lon: 78.41139},
    highlights: [
      "Restaurant",
      "Multiple Event Spaces",
      "24-hour Travel Desk",
      "Fitness Centre",
      "Swimming Pool",
      "Spa",
      "24/7 Customer Support"
    ],
    rooms: [
      {"name":"Deluxe Room","specs":"A cosy 196 sq. ft. Deluxe Room for up to 4 guests, featuring a shared balcony with breathtaking mountain views.","image":"images/hotels/uttarakhand/chamba-tehri/tehri-club-resort/room-deluxe-room.webp"},
      {"name":"Premium Room","specs":"Experience the charm of the valleys from our 288 sq. ft. Premium Room, accommodating up to 4 guests, with the choice of a private or shared balcony.","image":"images/hotels/uttarakhand/chamba-tehri/tehri-club-resort/room-premium-room.webp"},
      {"name":"Honeymoon Suite","specs":"This exclusive 324 sq. ft. suite for 2 adults, adorned with elegant decor, sets the perfect stage for your most romantic moments.","image":"images/hotels/uttarakhand/chamba-tehri/tehri-club-resort/room-honeymoon-suite.webp"},
      {"name":"Royal Family Suite","specs":"Spanning 528 sq. ft., this family-favourite suite accommodates up to 6 guests, featuring 2 king size beds and interconnected rooms for added comfort.","image":"images/hotels/uttarakhand/chamba-tehri/tehri-club-resort/room-royal-family-suite.webp"},
      {"name":"Villa","specs":"The 429 sq. ft. Villa, designed for up to 6 guests, offers 2 interconnected rooms and a shared bathroom for a comfortable stay.","image":"images/hotels/uttarakhand/chamba-tehri/tehri-club-resort/room-villa.webp"}
    ],
    sections: [
      {"title":"Taste the Essence of Tradition and Flavour","text":"Get ready for a dining experience that engages all your senses! At Food Station, enjoy everything from sizzling Tandoori kebabs to the unforgettable ' Bhaddu Ki Daal,' a beloved local speciality. Set against the breathtaking Tehri mountains, every dish offers a perfect mix of bold flavours and timeless traditions. Come visit us and explore our mouth-watering menu!","image":"images/hotels/uttarakhand/chamba-tehri/tehri-club-resort/dining.webp"},
      {"title":"Elevate Your Events with Us","text":"Host unforgettable moments in our stunning banquet halls! Spanning 4,000 sq. ft. each, Gazebo Hall and Elizabeth Hall are crafted for grand weddings, impactful meetings, and seamless conferences. At our premium resort in Tehri Garhwal, elegance meets versatility—your perfect event starts here!","image":"images/hotels/uttarakhand/chamba-tehri/tehri-club-resort/events.webp"},
      {"title":"Revitalise Your Senses and Unwind Like Never Before","text":"Escape to serenity at the TLC Spa, where wellness meets luxury. Indulge in rejuvenating therapies inspired by nature, designed to refresh your body and soul. With expert care and soothing surroundings, every moment here is a step towards pure relaxation and harmony.","image":"images/hotels/uttarakhand/chamba-tehri/tehri-club-resort/spa.webp"}
    ],
    gallery: [
      "images/hotels/uttarakhand/chamba-tehri/tehri-club-resort/main.webp",
      "images/hotels/uttarakhand/chamba-tehri/tehri-club-resort/room-deluxe-room.webp",
      "images/hotels/uttarakhand/chamba-tehri/tehri-club-resort/room-premium-room.webp",
      "images/hotels/uttarakhand/chamba-tehri/tehri-club-resort/room-honeymoon-suite.webp",
      "images/hotels/uttarakhand/chamba-tehri/tehri-club-resort/room-royal-family-suite.webp",
      "images/hotels/uttarakhand/chamba-tehri/tehri-club-resort/room-villa.webp",
      "images/hotels/uttarakhand/chamba-tehri/tehri-club-resort/dining.webp",
      "images/hotels/uttarakhand/chamba-tehri/tehri-club-resort/events.webp",
      "images/hotels/uttarakhand/chamba-tehri/tehri-club-resort/spa.webp"
    ]
  },

  {
    id: "grand-luxotica",
    category: "hotels",
    state: "Uttarakhand",
    city: "Dehradun",
    name: "Grand Luxotica",
    tagline: "The Best Hotel in Dehradun",
    description: "Tucked away in the lap of the majestic Doon Valley, Dehradun embraces its serene landscapes and tranquil charm for you to unwind and sync with nature. Surrounded by a lush panorama, the city invites you to slow down and bask in the ultimate tranquillity.",
    about: "Tucked away in the lap of the majestic Doon Valley, Dehradun embraces its serene landscapes and tranquil charm for you to unwind and sync with nature. Surrounded by a lush panorama, the city invites you to slow down and bask in the ultimate tranquillity. Escape to this natural haven with optimal comfort at Grand Luxotica, a 4-star hotel in Dehradun, boasting cosy accommodations with scenic views of the city. After a day of exploring the city, head over to our rooftop multi-cuisine restaurant for a wholesome meal with breathtaking views of the city as well as the mountains. Looking for the perfect venue for your event ? We have everything you need to make your celebrations truly memorable. At our couple-friendly hotel in Dehradun, soak in the picturesque city with your loved one with unparalleled comfort. Whether you're here for business or an escapade, our luxury hotel in Dehradun promises an exceptional stay and experience that will be etched into your memory.",
    image: "images/hotels/uttarakhand/dehradun/grand-luxotica/dining.webp",
    address: "Dilaram Chawnk, Rajpur Road, New Cantonment Road, Opp. Karnataka Bank, Dehradun, Uttarakhand - 248001",
    location: {lat: 30.33619,lon: 78.05438},
    highlights: [
      "Multi-cuisine Restaurant",
      "Event Space",
      "Rooftop Dining",
      "Parking Space",
      "24/7 Customer Support",
      "Laundry Service (Chargeable)"
    ],
    rooms: [
      {"name":"Deluxe Room","specs":"Overlooking the vibrant city skyline, our Deluxe Rooms comfortably accommodates up to 4 guests and boasts a luxurious king size bed.","image":"images/hotels/uttarakhand/dehradun/grand-luxotica/room-deluxe-room.webp"},
      {"name":"Premium Room","specs":"Immerse yourself in spectacular city views from our Super Deluxe Rooms, designed to welcome up to 4 guests, with the option of twin beds for a comfortable stay.","image":"images/hotels/uttarakhand/dehradun/grand-luxotica/room-premium-room.webp"}
    ],
    sections: [
      {"title":"Indulge in Timeless Flavours","text":"Delight in exquisite dishes that will tantalise your palate at our restaurant, where every meal is a feast for the senses. Choose between the indoor setting or the tranquil rooftop, where you can soak in the views of Dehradun city and the surrounding mountains. Here, exceptional flavours come together with stunning ambience, creating a dining experience that's nothing short of unforgettable.","image":"images/hotels/uttarakhand/dehradun/grand-luxotica/dining.webp"},
      {"title":"Let Your Special Moments Unfold","text":"Host your special moments in our banquet hall, a dynamic 1,800 sq. ft. space where your event takes on a life of its own. Whether it's a birthday, corporate meeting, or ring ceremony, this room transforms to fit your needs with flexible seating options. Every moment here becomes unforgettable, where celebrations come to life and memories are crafted.","image":"images/hotels/uttarakhand/dehradun/grand-luxotica/events.webp"}
    ],
    gallery: [
      "images/hotels/uttarakhand/dehradun/grand-luxotica/photo-02.webp",
      "images/hotels/uttarakhand/dehradun/grand-luxotica/dining.webp",
      "images/hotels/uttarakhand/dehradun/grand-luxotica/room-premium-room.webp",
      "images/hotels/uttarakhand/dehradun/grand-luxotica/photo-03.webp",
      "images/hotels/uttarakhand/dehradun/grand-luxotica/photo-04.webp",
      "images/hotels/uttarakhand/dehradun/grand-luxotica/photo-05.webp",
      "images/hotels/uttarakhand/dehradun/grand-luxotica/photo-06.webp",
      "images/hotels/uttarakhand/dehradun/grand-luxotica/photo-07.webp",
      "images/hotels/uttarakhand/dehradun/grand-luxotica/room-deluxe-room.webp",
      "images/hotels/uttarakhand/dehradun/grand-luxotica/events.webp"
    ]
  },

  {
    id: "ganga-bliss",
    category: "hotels",
    state: "Uttarakhand",
    city: "Haridwar",
    name: "Ganga Bliss",
    tagline: "A Luxury 4-Star Hotel in Haridwar",
    description: "Discover the charm of Ganga Bliss, a 4-star hotel offering a serene and comfortable stay. With 27 well-designed rooms, we are ideally located near popular attractions such as Har Ki Pauri, Vaishno Devi Temple, and Shanti Kunj Gayatri Parivar.",
    about: "Discover the charm of Ganga Bliss, a 4-star hotel offering a serene and comfortable stay. With 27 well-designed rooms, we are ideally located near popular attractions such as Har Ki Pauri, Vaishno Devi Temple, and Shanti Kunj Gayatri Parivar. Whether you're here for a spiritual journey or a relaxing staycation, our welcoming atmosphere is the perfect choice. Relish delicious vegetarian meals at our restaurant, and enjoy a truly memorable visit to this spiritual destination.",
    image: "images/hotels/uttarakhand/haridwar/ganga-bliss/photo-03.webp",
    address: "Opp. Ganga Swaroop Ashram, Bhoopatwala, Haridwar, Motichur Range, Uttarakhand - 249410",
    location: {lat: 29.98523,lon: 78.18441},
    highlights: [
      "Pure Vegetarian Restaurant",
      "24-hour Customer Support",
      "Free Parking",
      "Complimentary Wi-Fi",
      "Laundry Service (Chargeable)"
    ],
    rooms: [
      {"name":"Deluxe Room","specs":"Enjoy serene city views from our Deluxe Rooms, designed to offer a perfect blend of comfort and style for a relaxing retreat.","image":"images/hotels/uttarakhand/haridwar/ganga-bliss/room-deluxe-room.webp"},
      {"name":"Premium Room","specs":"Admire the stunning city views from our Premium Rooms, thoughtfully crafted to combine elegance and comfort for an unforgettable stay.","image":"images/hotels/uttarakhand/haridwar/ganga-bliss/room-premium-room.webp"},
      {"name":"Family Suite Room","specs":"Our Family Suite Rooms offer captivating city views and a spacious, inviting retreat designed for comfort and relaxation.","image":"images/hotels/uttarakhand/haridwar/ganga-bliss/room-family-suite-room.webp"}
    ],
    sections: [
      {"title":"A Pure Vegetarian Restaurant in Haridwar","text":"Experience the flavours of India at our pure vegetarian restaurant at our hotel near Har Ki Pauri. Offering a range of multi-cuisine and continental dishes, it's the perfect place to enjoy a hearty breakfast buffet. Whether you prefer indoor or outdoor seating, the relaxed atmosphere complements every meal, adding a special touch.","image":"images/hotels/uttarakhand/haridwar/ganga-bliss/dining.webp"}
    ],
    gallery: [
      "images/hotels/uttarakhand/haridwar/ganga-bliss/photo-03.webp",
      "images/hotels/uttarakhand/haridwar/ganga-bliss/photo-04.webp",
      "images/hotels/uttarakhand/haridwar/ganga-bliss/photo-05.webp",
      "images/hotels/uttarakhand/haridwar/ganga-bliss/room-family-suite-room.webp",
      "images/hotels/uttarakhand/haridwar/ganga-bliss/photo-06.webp",
      "images/hotels/uttarakhand/haridwar/ganga-bliss/photo-07.webp",
      "images/hotels/uttarakhand/haridwar/ganga-bliss/room-deluxe-room.webp",
      "images/hotels/uttarakhand/haridwar/ganga-bliss/room-premium-room.webp",
      "images/hotels/uttarakhand/haridwar/ganga-bliss/dining.webp"
    ]
  },

  {
    id: "park-grace",
    category: "hotels",
    state: "Uttarakhand",
    city: "Haridwar",
    name: "Park Grace",
    tagline: "A 4-Star Luxury Hotel in Haridwar",
    description: "Experience luxury in the tranquil Motichur Range of Haridwar at Park Grace, a 4-star hotel. With an exceptional rating on Google, this hotel—arguably the best in Haridwar—offers 30 elegantly designed rooms, including deluxe and premium options, ensuring maximum comfort and a homely feel.",
    about: "Experience luxury in the tranquil Motichur Range of Haridwar at Park Grace, a 4-star hotel. With an exceptional rating on Google, this hotel—arguably the best in Haridwar—offers 30 elegantly designed rooms, including deluxe and premium options, ensuring maximum comfort and a homely feel. Enjoy private parking and 24/7 customer support for your peace of mind. For special occasions, our versatile event space is ideal for hosting memorable gatherings, or you can dine at our delightful in-house restaurant. Whether you're here for a romantic retreat, a peaceful getaway, or a celebration, create unforgettable memories amid the scenic beauty of Haridwar. Book your stay at one of the best hotels in Haridwar and make your escape extraordinary!",
    image: "images/hotels/uttarakhand/haridwar/park-grace/main.webp",
    address: "Rishikesh Road, Bhoopatwala, Haridwar, Motichur Range, Uttarakhand - 249410",
    location: {lat: 29.99244,lon: 78.18961},
    highlights: [
      "Pure Vegetarian Restaurant",
      "Event Spaces",
      "Lawn",
      "24-hour Travel Desk",
      "24/7 Customer Support",
      "Free Parking",
      "Bonfire"
    ],
    rooms: [
      {"name":"Deluxe Room","specs":"Step into 220 sq. ft., of tranquillity! Our 15 Deluxe Rooms, perfect for up to 4 guests, feature soothing garden views for a rejuvenating stay.","image":"images/hotels/uttarakhand/haridwar/park-grace/room-deluxe-room.webp"},
      {"name":"Premium Room","specs":"Elevate your stay in our 220 sq. ft., Premium Rooms! With 15 available, they accommodate up to 4 guests and offer captivating city views.","image":"images/hotels/uttarakhand/haridwar/park-grace/room-premium-room.webp"}
    ],
    sections: [
      {"title":"Dine in Serenity, Savour the Flavours","text":"Indulge in a culinary journey at our pure vegetarian restaurant, where every dish is crafted to delight your palate. With a serene dining ambience and a menu inspired by traditional and contemporary flavours, we serve a variety of wholesome meals, including buffet options. It's the perfect spot to enjoy delicious food that nourishes the body and uplifts the soul.","image":"images/hotels/uttarakhand/haridwar/park-grace/dining.webp"},
      {"title":"Host Your Perfect Event with Us","text":"Host unforgettable events at Park Grace! Choose our 2,000 sq. ft. banquet hall for intimate gatherings of 70–80 guests or our sprawling 24,000 sq. ft. lawn, perfect for weddings and grand celebrations of up to 300 guests. Let us bring your vision to life.","image":"images/hotels/uttarakhand/haridwar/park-grace/events.webp"}
    ],
    gallery: [
      "images/hotels/uttarakhand/haridwar/park-grace/main.webp",
      "images/hotels/uttarakhand/haridwar/park-grace/photo-01.webp",
      "images/hotels/uttarakhand/haridwar/park-grace/photo-03.webp",
      "images/hotels/uttarakhand/haridwar/park-grace/photo-04.webp",
      "images/hotels/uttarakhand/haridwar/park-grace/photo-05.webp",
      "images/hotels/uttarakhand/haridwar/park-grace/photo-06.webp",
      "images/hotels/uttarakhand/haridwar/park-grace/photo-07.webp",
      "images/hotels/uttarakhand/haridwar/park-grace/dining.webp",
      "images/hotels/uttarakhand/haridwar/park-grace/photo-08.webp",
      "images/hotels/uttarakhand/haridwar/park-grace/photo-09.webp",
      "images/hotels/uttarakhand/haridwar/park-grace/photo-10.webp",
      "images/hotels/uttarakhand/haridwar/park-grace/photo-11.webp",
      "images/hotels/uttarakhand/haridwar/park-grace/photo-12.webp",
      "images/hotels/uttarakhand/haridwar/park-grace/room-deluxe-room.webp",
      "images/hotels/uttarakhand/haridwar/park-grace/room-premium-room.webp"
    ]
  },

  {
    id: "forest-vines-resort-and-spa",
    category: "resorts",
    state: "Uttarakhand",
    city: "Jim Corbett (Ramnagar)",
    name: "Forest Vines Resort & Spa",
    tagline: "Best Resort in Jim Corbett",
    description: "Set amidst serene landscapes, Forest Vines Resort & Spa is a premier resort in Ramnagar, Nainital, offering a perfect blend of nature's charm and modern comforts. Ideal for family holidays, romantic escapes, weddings, and corporate events, the resort features lush gardens and a dedicated gaming zone, ensuring memorable experiences for all.",
    about: "Set amidst serene landscapes, Forest Vines Resort & Spa is a premier resort in Ramnagar, Nainital, offering a perfect blend of nature's charm and modern comforts. Ideal for family holidays, romantic escapes, weddings, and corporate events, the resort features lush gardens and a dedicated gaming zone, ensuring memorable experiences for all. Our resort near Corbett Tiger Reserve, offers easy accessibility for travellers, making it an excellent choice for both leisure and business stays. We have facilities like a refreshing swimming pool, a travel desk for local explorations, a soothing spa with rejuvenating massages and steam facilities, a restaurant serving delightful multi-cuisine dining, and versatile banquets for celebrations and events. Whether you're here to unwind, celebrate, or work, our luxury resort in Jim Corbett promises an unforgettable stay with exceptional hospitality.",
    image: "images/hotels/uttarakhand/jim-corbett-ramnagar/forest-vines-resort-and-spa/main.webp",
    address: "Motipur, Khushalpur, Chhoi, Ramnagar, Uttarakhand - 244715",
    location: {lat: 29.322,lon: 79.13378},
    highlights: [
      "Multi-cuisine Restaurant",
      "Multiple Event Spaces",
      "Travel Desk",
      "Swimming Pool",
      "Spa",
      "Bonfire",
      "Game Zone",
      "Free Parking",
      "24/7 Customer Service"
    ],
    rooms: [
      {"name":"Deluxe Room","specs":"Unwind in the comfort of our 250 sq. ft. Deluxe Room, designed for up to 4 guests. Stay connected with complimentary Wi-Fi and enjoy your favourite shows on the television, making it a cosy retreat for relaxation.","image":"images/hotels/uttarakhand/jim-corbett-ramnagar/forest-vines-resort-and-spa/room-deluxe-room.webp"},
      {"name":"Premium Room","specs":"Experience 300 sq. ft. of comfort in our Premium Room, accommodating up to 4 guests. Sip a refreshing drink from the minibar and take in the views from your private balcony, crafted for a serene and indulgent stay.","image":"images/hotels/uttarakhand/jim-corbett-ramnagar/forest-vines-resort-and-spa/room-premium-room.webp"},
      {"name":"Forest Suite","specs":"Immerse yourself in the charm of our 400 sq. ft. Forest Suite, perfect for up to 4 guests. Enjoy your morning brew with the in-room tea and coffee maker and unwind on the private balcony overlooking the natural beauty around you.","image":"images/hotels/uttarakhand/jim-corbett-ramnagar/forest-vines-resort-and-spa/room-forest-suite.webp"},
      {"name":"Royal Suite With Jacuzzi","specs":"Indulge in the luxurious 950 sq. ft. Royal Suite, ideal for 4 guests. Pamper yourself with the in-room Jacuzzi and take advantage of our convenient laundry service, ensuring a royal experience throughout your stay.","image":"images/hotels/uttarakhand/jim-corbett-ramnagar/forest-vines-resort-and-spa/room-royal-suite-with-jacuzzi.webp"},
      {"name":"Vines King Suite With Private Pool","specs":"Step into ultimate luxury in the 1,000 sq. ft. Vines King Suite, accommodating up to 4 guests. Dive into your private pool and enjoy 24-hour room service, offering the perfect blend of exclusivity and indulgence.","image":"images/hotels/uttarakhand/jim-corbett-ramnagar/forest-vines-resort-and-spa/room-vines-king-suite-with-private-pool.webp"}
    ],
    sections: [
      {"title":"A Feast for Every Mood","text":"Experience the best of both worlds at our restaurant, offering indoor and outdoor dining. Relax in our cosy indoor area, savour meals by the serene poolside, or unwind on the lush lawn. With a multi-cuisine menu and lavish buffet, we promise a dining experience to remember!","image":"images/hotels/uttarakhand/jim-corbett-ramnagar/forest-vines-resort-and-spa/dining.webp"},
      {"title":"Transform Moments into Memories","text":"Host every occasion in style at our two magnificent banquet halls, designed to make your events unforgettable. The largest hall, spanning an impressive 6,600 sq. ft., is perfect for grand weddings, corporate conferences, and lively celebrations. Whether it's a student gathering or an intimate event, our modern amenities ensure every detail is flawless. Let us bring your vision to life and create memories that last a lifetime!","image":"images/hotels/uttarakhand/jim-corbett-ramnagar/forest-vines-resort-and-spa/events.webp"},
      {"title":"Relax, Rejuvenate, Renew at our Resort in Ramnagar, Nainital","text":"Escape to Vedeic Wellness, where relaxation meets rejuvenation. Indulge in soothing body massages and enjoy the calming steam facilities. Let expert care and serene surroundings refresh your body and mind, leaving you in perfect harmony and bliss.","image":"images/hotels/uttarakhand/jim-corbett-ramnagar/forest-vines-resort-and-spa/spa.webp"}
    ],
    gallery: [
      "images/hotels/uttarakhand/jim-corbett-ramnagar/forest-vines-resort-and-spa/main.webp",
      "images/hotels/uttarakhand/jim-corbett-ramnagar/forest-vines-resort-and-spa/photo-01.webp",
      "images/hotels/uttarakhand/jim-corbett-ramnagar/forest-vines-resort-and-spa/photo-02.webp",
      "images/hotels/uttarakhand/jim-corbett-ramnagar/forest-vines-resort-and-spa/photo-04.webp",
      "images/hotels/uttarakhand/jim-corbett-ramnagar/forest-vines-resort-and-spa/photo-05.webp",
      "images/hotels/uttarakhand/jim-corbett-ramnagar/forest-vines-resort-and-spa/room-vines-king-suite-with-private-pool.webp",
      "images/hotels/uttarakhand/jim-corbett-ramnagar/forest-vines-resort-and-spa/room-premium-room.webp",
      "images/hotels/uttarakhand/jim-corbett-ramnagar/forest-vines-resort-and-spa/photo-06.webp",
      "images/hotels/uttarakhand/jim-corbett-ramnagar/forest-vines-resort-and-spa/dining.webp",
      "images/hotels/uttarakhand/jim-corbett-ramnagar/forest-vines-resort-and-spa/photo-07.webp",
      "images/hotels/uttarakhand/jim-corbett-ramnagar/forest-vines-resort-and-spa/photo-08.webp",
      "images/hotels/uttarakhand/jim-corbett-ramnagar/forest-vines-resort-and-spa/photo-09.webp",
      "images/hotels/uttarakhand/jim-corbett-ramnagar/forest-vines-resort-and-spa/events.webp",
      "images/hotels/uttarakhand/jim-corbett-ramnagar/forest-vines-resort-and-spa/photo-10.webp",
      "images/hotels/uttarakhand/jim-corbett-ramnagar/forest-vines-resort-and-spa/photo-11.webp"
    ]
  },

  {
    id: "highland-resort-and-spa",
    category: "resorts",
    state: "Uttarakhand",
    city: "Mussoorie",
    name: "Highland Resort & Spa",
    tagline: "A 4-star Resort in Mussoorie",
    description: "Known for its tranquil surroundings and lush greenery, Barlowganj is a serene neighbourhood in Mussoorie that exudes charm and natural beauty. Set against this picturesque backdrop, Highland, a 4-star hotel, offers an idyllic escape in the scenic hill station of Mussoorie.",
    about: "Known for its tranquil surroundings and lush greenery, Barlowganj is a serene neighbourhood in Mussoorie that exudes charm and natural beauty. Set against this picturesque backdrop, Highland, a 4-star hotel, offers an idyllic escape in the scenic hill station of Mussoorie. Our resort's location provides a perfect blend of tranquillity and accessibility, making it an ideal choice for both relaxation and exploration. Inside, the accommodations are designed for ultimate comfort, offering modern amenities and breathtaking views, ensuring a restful stay for every guest. Whether you're visiting for a romantic getaway, a family holiday, a corporate retreat, or a staycation, our thoughtfully crafted rooms cater to your needs. Guests can enjoy exceptional service with 24/7 customer support, cleaning, and laundry services, adding an extra layer of convenience to your stay. Indulge in delightful dining at our on-site restaurant, where a variety of cuisines await to tantalise your taste buds. For those looking to host an event, our banquet hall is equipped with everything you need to make your special occasion memorable. After a day of exploring or meetings, unwind at our wellness spa, where rejuvenating body massages and luxurious facilities await. Highland, our resort in Mussoorie, promises an unforgettable experience where you can unwind, rejuvenate, and cherish timeless memories.",
    image: "images/hotels/uttarakhand/mussoorie/highland-resort-and-spa/main.webp",
    address: "Barlowganj, Christian Village, Mussoorie, Uttarakhand - 248122",
    location: {lat: 30.43765,lon: 78.08546},
    highlights: [
      "Travel Desk",
      "24-hour Customer Support",
      "Gaming Zone",
      "Spa",
      "Jacuzzi",
      "Multi-cuisine Restaurant",
      "Banquet Hall",
      "Parking Area"
    ],
    rooms: [
      {"name":"Deluxe Non-View Room","specs":"At 168 sq. ft., our cosy room accommodates up to 4 guests, offering a comfortable and inviting space for relaxation. Ideal for those seeking a peaceful retreat after a day of exploring Mussoorie.","image":"images/hotels/uttarakhand/mussoorie/highland-resort-and-spa/room-deluxe-non-view-room.webp"},
      {"name":"Premium Room With Balcony","specs":"Spanning 168 sq. ft., our room comfortably fits up to 4 guests and includes a private balcony with an amazing view, perfect for unwinding in a tranquil atmosphere.","image":"images/hotels/uttarakhand/mussoorie/highland-resort-and-spa/room-premium-room-with-balcony.webp"},
      {"name":"Luxury Room Without Balcony","specs":"With 270 sq. ft. of space, our room offers ample room for up to 5 guests, providing a luxurious setting for relaxation and comfort during your stay in Mussoorie.","image":"images/hotels/uttarakhand/mussoorie/highland-resort-and-spa/room-luxury-room-without-balcony.webp"},
      {"name":"Luxury Room With Balcony","specs":"Our spacious 270 sq. ft. room with a private balcony accommodates up to 5 guests, offering the perfect blend of comfort and style. The stunning views from the balcony make it an ideal choice for an unforgettable stay.","image":"images/hotels/uttarakhand/mussoorie/highland-resort-and-spa/room-luxury-room-with-balcony.webp"}
    ],
    sections: [
      {"title":"Relish the Flavours of the Hills","text":"At our restaurant, embark on a delightful culinary journey where every meal celebrates taste. Our multi-cuisine menu caters to diverse palates, offering dishes that blend flavours and textures perfectly. Whether dining indoors or enjoying our refreshing outdoor seating, every bite promises an unforgettable experience. With a vibrant ambience and attentive service, it is the perfect spot to relax and indulge after exploring Mussoorie's scenic beauty.","image":"images/hotels/uttarakhand/mussoorie/highland-resort-and-spa/dining.webp"},
      {"title":"Memorable Events, Perfectly Crafted","text":"Create unforgettable memories at our versatile event spaces, perfect for weddings, corporate retreats, and milestone celebrations. Surrounded by the breathtaking charm of our Mussoorie resort, our elegant conference hall is designed to make your event seamless and special. With warm hospitality and exceptional service, every moment is as magical as the mountain views.","image":"images/hotels/uttarakhand/mussoorie/highland-resort-and-spa/events.webp"},
      {"title":"Rejuvenate Your Senses at Our Spa","text":"Step into a world of relaxation at our spa, where tranquillity meets luxury. Indulge in soothing body massages, or unwind in the calming steam, sauna, and Jacuzzi, designed to refresh both body and mind. With every treatment tailored to your needs, our spa offers a serene escape, allowing you to fully relax and recharge during your stay.","image":"images/hotels/uttarakhand/mussoorie/highland-resort-and-spa/spa.webp"}
    ],
    gallery: [
      "images/hotels/uttarakhand/mussoorie/highland-resort-and-spa/main.webp",
      "images/hotels/uttarakhand/mussoorie/highland-resort-and-spa/photo-01.webp",
      "images/hotels/uttarakhand/mussoorie/highland-resort-and-spa/photo-02.webp",
      "images/hotels/uttarakhand/mussoorie/highland-resort-and-spa/photo-04.webp",
      "images/hotels/uttarakhand/mussoorie/highland-resort-and-spa/photo-05.webp",
      "images/hotels/uttarakhand/mussoorie/highland-resort-and-spa/photo-06.webp",
      "images/hotels/uttarakhand/mussoorie/highland-resort-and-spa/events.webp",
      "images/hotels/uttarakhand/mussoorie/highland-resort-and-spa/photo-07.webp",
      "images/hotels/uttarakhand/mussoorie/highland-resort-and-spa/photo-08.webp",
      "images/hotels/uttarakhand/mussoorie/highland-resort-and-spa/room-deluxe-non-view-room.webp",
      "images/hotels/uttarakhand/mussoorie/highland-resort-and-spa/room-premium-room-with-balcony.webp",
      "images/hotels/uttarakhand/mussoorie/highland-resort-and-spa/room-luxury-room-without-balcony.webp",
      "images/hotels/uttarakhand/mussoorie/highland-resort-and-spa/room-luxury-room-with-balcony.webp",
      "images/hotels/uttarakhand/mussoorie/highland-resort-and-spa/dining.webp"
    ]
  },

  {
    id: "oak-bush",
    category: "hotels",
    state: "Uttarakhand",
    city: "Mussoorie",
    name: "Oak Bush",
    tagline: "Escape to Bliss at Our 4-Star Hotel in Mussoorie",
    description: "Dreaming of the perfect escape to the hills where tranquillity meets luxury? Let us introduce you to Oak Bush, Mussoorie—a premium retreat where nature's beauty meets unmatched comfort.",
    about: "Dreaming of the perfect escape to the hills where tranquillity meets luxury? Let us introduce you to Oak Bush, Mussoorie—a premium retreat where nature's beauty meets unmatched comfort. Ranked as one of the finest 4-star hotels in Mussoorie, our property offers an experience that combines breathtaking valley views and serene charm. Whether you're planning a lively family vacation, a romantic getaway, a much-needed staycation, or a corporate retreat, this serene destination promises an unforgettable stay, all backed by our trusted name. With 30 thoughtfully designed accommodations, our hotel ensures every guest finds their ideal sanctuary. Each accommodation is a harmonious blend of elegance and warmth, offering the perfect space to relax after a day of exploring or productive meetings. Dining is no less delightful, with our multi-cuisine restaurant serving flavour-packed dishes in a spacious setting. Step onto our open terrace to savour your meals with breathtaking valley views—a true feast for both the eyes and the palate. For those who prefer a more relaxed setting, there is a separate leisure seating area alongside the parking area, where you can enjoy the same menu as the restaurant while soaking in the surroundings. At Oak Bush, every detail is crafted to make your stay extraordinary. So, when are you checking in?",
    image: "images/hotels/uttarakhand/mussoorie/oak-bush/photo-07.webp",
    address: "Oaks Road, The Mall Road, Mussoorie, Uttarakhand - 248179",
    location: {lat: 30.45281,lon: 78.08679},
    highlights: [
      "24-hour Travel Desk",
      "24/7 Customer Support",
      "Elevator",
      "Open Terrace Area",
      "Multi-cuisine Restaurant",
      "Bonfire (Chargeable)",
      "Laundry Service (Chargeable)",
      "Free Parking"
    ],
    rooms: [
      {"name":"Deluxe Room","specs":"Dreaming of a cosy escape? Our 13 Deluxe Rooms offer the perfect budget-friendly retreat with all the essentials for a comfortable stay.","image":"images/hotels/uttarakhand/mussoorie/oak-bush/room-deluxe-room.webp"},
      {"name":"Premium Room","specs":"Need more room to stretch out and soak in the beauty? Our 17 Premium Rooms are all about spacious comfort and jaw-dropping valley views that will leave you in awe.","image":"images/hotels/uttarakhand/mussoorie/oak-bush/room-premium-room.webp"}
    ],
    sections: [
      {"title":"Valley Views and Vibrant Feast","text":"Here, dining isn't just about food—it's a feast for the senses and the soul! Imagine savouring a delicious meal on our open terrace, with stunning valley views that make every moment picture-perfect. Whether you're kicking off your day with a hearty breakfast or enjoying a magical dinner under the stars, the experience is nothing short of unforgettable. With a menu packed with mouth-watering flavours and a setting straight out of a dream, this is dining elevated to a whole new level of fun and relaxation.","image":"images/hotels/uttarakhand/mussoorie/oak-bush/dining.webp"}
    ],
    gallery: [
      "images/hotels/uttarakhand/mussoorie/oak-bush/photo-03.webp",
      "images/hotels/uttarakhand/mussoorie/oak-bush/photo-04.webp",
      "images/hotels/uttarakhand/mussoorie/oak-bush/photo-05.webp",
      "images/hotels/uttarakhand/mussoorie/oak-bush/photo-06.webp",
      "images/hotels/uttarakhand/mussoorie/oak-bush/photo-07.webp",
      "images/hotels/uttarakhand/mussoorie/oak-bush/photo-08.webp",
      "images/hotels/uttarakhand/mussoorie/oak-bush/room-deluxe-room.webp",
      "images/hotels/uttarakhand/mussoorie/oak-bush/room-premium-room.webp",
      "images/hotels/uttarakhand/mussoorie/oak-bush/dining.webp"
    ]
  },

  {
    id: "the-pearl",
    category: "hotels",
    state: "Uttarakhand",
    city: "Mussoorie",
    name: "The Pearl",
    tagline: "Experience Unmatched Hospitality at Our Hotel in Mussoorie",
    description: "Experience the perfect blend of luxury and comfort at The Pearl, a 3-star hotel located on the scenic Mall Road in Mussoorie, Uttarakhand.",
    about: "Experience the perfect blend of luxury and comfort at The Pearl, a 3-star hotel located on the scenic Mall Road in Mussoorie, Uttarakhand. Here, we deliver a seamless combination of luxury accommodations, unmatched services, and the warmth of Indian hospitality, creating an unforgettable stay for all our guests. Our premium accommodations are designed with your comfort in mind, featuring amenities that make you feel right at home. Whether you're here for a peaceful staycation, a romantic getaway, or a dream wedding, we offer an ideal setting for every occasion. We also offer a delightful dining experience that caters to every palate, enhancing your experience with every meal. Our proximity to major tourist attractions and a dedicated 24/7 travel desk ensures your explorations in Mussoorie are both convenient and memorable. We prioritize your safety and security, with 24/7 customer support always available to assist you. Book your stay today and discover why our hotel in Mall Road is the perfect place for your next getaway.",
    image: "images/hotels/uttarakhand/mussoorie/the-pearl/main.webp",
    address: "Kulri, Kalsia Estate, near Pearl Hotel, The Mall Road, Mussoorie, Uttarakhand - 248179",
    location: {lat: 30.45353,lon: 78.08224},
    highlights: [
      "Multi-cuisine Restaurant",
      "Conference Hall",
      "24-hour Travel Desk",
      "24/7 Customer Support",
      "Free Parking",
      "Outdoor Dining"
    ],
    rooms: [
      {"name":"Deluxe Room","specs":"Spread across 221 sq. ft, our 14 Deluxe Rooms offer comfort and simplicity for up to 4 guests, making it a great choice for a peaceful retreat in Mussoorie.","image":"images/hotels/uttarakhand/mussoorie/the-pearl/room-deluxe-room.webp"},
      {"name":"Premium Room","specs":"With 236 sq. ft. of space, the 10 Premium Rooms elevate your stay with extra comfort and the ability to accommodate up to 4 guests.","image":"images/hotels/uttarakhand/mussoorie/the-pearl/room-premium-room.webp"},
      {"name":"Pearl Suite","specs":"Discover luxury in our six Pearl Suites, each offering an expansive 420 sq. ft. of indulgence for up to 5 guests.","image":"images/hotels/uttarakhand/mussoorie/the-pearl/room-pearl-suite.webp"}
    ],
    sections: [
      {"title":"Unveil the Art of Fine Dining","text":"Savour the world on your plate at Pearl Restaurant. Its vibrant multi-cuisine menu, fresh ingredients, and delightful flavours come together in a warm and inviting ambience, making it the ultimate dining experience in Mussoorie.","image":"images/hotels/uttarakhand/mussoorie/the-pearl/dining.webp"},
      {"title":"Bring Your Vision to Life in Our Exquisite Event Space","text":"Our versatile event space at The Pearl is designed to bring your special occasions to life, whether it's a corporate gathering, an intimate celebration, or a grand wedding. With a blend of elegance and flexibility, the space can be tailored to suit any event, ensuring a memorable experience for every guest. Let us transform your vision into reality, creating moments that will be cherished for years to come.","image":"images/hotels/uttarakhand/mussoorie/the-pearl/spa.webp"}
    ],
    gallery: [
      "images/hotels/uttarakhand/mussoorie/the-pearl/main.webp",
      "images/hotels/uttarakhand/mussoorie/the-pearl/photo-01.webp",
      "images/hotels/uttarakhand/mussoorie/the-pearl/photo-02.webp",
      "images/hotels/uttarakhand/mussoorie/the-pearl/photo-03.webp",
      "images/hotels/uttarakhand/mussoorie/the-pearl/photo-04.webp",
      "images/hotels/uttarakhand/mussoorie/the-pearl/room-deluxe-room.webp",
      "images/hotels/uttarakhand/mussoorie/the-pearl/room-premium-room.webp",
      "images/hotels/uttarakhand/mussoorie/the-pearl/room-pearl-suite.webp",
      "images/hotels/uttarakhand/mussoorie/the-pearl/spa.webp"
    ]
  },

  {
    id: "the-emerald",
    category: "hotels",
    state: "Uttarakhand",
    city: "Nainital",
    name: "The Emerald",
    tagline: "Your Perfect Getaway in Nainital",
    description: "Set amidst the foothills of the Himalayas, The Emerald stands among the top hotels in Nainital. It provides an intimate, couple-friendly haven for those seeking a rejuvenating retreat.",
    about: "Set amidst the foothills of the Himalayas, The Emerald stands among the top hotels in Nainital. It provides an intimate, couple-friendly haven for those seeking a rejuvenating retreat. With 15 elegantly designed rooms, we ensure personalised service and attention to detail. Guests can enjoy a sumptuous range of dishes at our multi-cuisine restaurant or explore nearby attractions such as Tiffin Top, Mall Road, and Naini Lake. Embrace our welcoming ambience as you create cherished memories in this captivating destination.",
    image: "images/hotels/uttarakhand/nainital/the-emerald/main.webp",
    address: "Near Aurbindo Ashram, Ayarpatta, Naina Range, Nainital, Uttarakhand - 263002",
    location: {lat: 29.38832,lon: 79.44559},
    highlights: [
      "Bonfire (Chargeable)",
      "Open Terrace",
      "Multi-cuisine Restaurant",
      "Common Balcony",
      "Free Parking",
      "24/7 Customer Support"
    ],
    rooms: [
      {"name":"Deluxe Room","specs":"Discover comfort and charm in our 8 Deluxe Rooms, perfectly suited for families and small groups seeking a memorable stay.","image":"images/hotels/uttarakhand/nainital/the-emerald/room-deluxe-room.webp"},
      {"name":"Premium Room","specs":"Immerse yourself in tranquillity with our 7 Premium Rooms, each offering breathtaking jungle views and spacious, thoughtfully designed interiors.","image":"images/hotels/uttarakhand/nainital/the-emerald/room-premium-room.webp"}
    ],
    sections: [
      {"title":"Fine Dining with a Terrace View","text":"Embark on an unforgettable gastronomic journey at our multi-cuisine restaurant at The Emerald. Start your day with a hearty breakfast buffet or indulge in a variety of appetising dishes from our à la carte menu. Choose elegant indoor seating for a fine-dining experience, or relax on the terrace for scenic forest views. Whether you prefer a refined meal or a laid-back setting, it promises an unforgettable culinary experience.","image":"images/hotels/uttarakhand/nainital/the-emerald/dining.webp"}
    ],
    gallery: [
      "images/hotels/uttarakhand/nainital/the-emerald/main.webp",
      "images/hotels/uttarakhand/nainital/the-emerald/photo-01.webp",
      "images/hotels/uttarakhand/nainital/the-emerald/photo-02.webp",
      "images/hotels/uttarakhand/nainital/the-emerald/room-premium-room.webp",
      "images/hotels/uttarakhand/nainital/the-emerald/room-deluxe-room.webp",
      "images/hotels/uttarakhand/nainital/the-emerald/photo-03.webp",
      "images/hotels/uttarakhand/nainital/the-emerald/photo-04.webp",
      "images/hotels/uttarakhand/nainital/the-emerald/dining.webp"
    ]
  },

  {
    id: "divine-river-resort-and-spa",
    category: "resorts",
    state: "Uttarakhand",
    city: "Rishikesh",
    name: "Divine River Resort & Spa",
    tagline: "5-Star Resort in Rishikesh",
    description: "Perched along the gentle whispers of a flowing river and embraced by towering mountains, Divine River Resort & Spa is where nature's tranquillity and thoughtful luxury intertwine. Picture yourself waking to golden sunlight streaming through the hills, stepping into lush gardens that lead to a serene riverside, or relishing a quiet moment by our swimming pool as the mountain breeze stirs your soul.",
    about: "Perched along the gentle whispers of a flowing river and embraced by towering mountains, Divine River Resort & Spa is where nature's tranquillity and thoughtful luxury intertwine. Picture yourself waking to golden sunlight streaming through the hills, stepping into lush gardens that lead to a serene riverside, or relishing a quiet moment by our swimming pool as the mountain breeze stirs your soul. Designed to inspire and indulge, our resort in Rishikesh offers a blend of serene escapes and thrilling adventures. From our riverside garden access and rejuvenating spa therapies to exhilarating wall-climbing activities and panoramic dining experiences, every moment here is infused with the essence of Rishikesh's timeless beauty. Whether you seek a romantic getaway, a family holiday, or a perfect setting for life's grand celebrations, this is where your journey transforms into an unforgettable story.",
    image: "images/hotels/uttarakhand/rishikesh/divine-river-resort-and-spa/main.webp",
    address: "Mohan Chatti, Rishikesh, Uttarakhand - 249304",
    location: {lat: 30.06183,lon: 78.38679},
    highlights: [
      "Swimming Pool",
      "Spa",
      "Adventure Activities",
      "Indoor Gaming Zone",
      "Gym",
      "Multi-cuisine Restaurant",
      "Banquet Hall",
      "Free Parking",
      "24/7 Customer Support"
    ],
    rooms: [
      {"name":"Deluxe Room With Forest View","specs":"Spanning 250 sq. ft., this cosy retreat is perfect for up to 4 guests. The stunning forest views make it a serene choice for nature lovers.","image":"images/hotels/uttarakhand/rishikesh/divine-river-resort-and-spa/room-deluxe-room-with-forest-view.webp"},
      {"name":"Premium Room With Balcony","specs":"Spread over 350 sq. ft., this room accommodates up to 4 guests and offers breathtaking mountain and river views from your private balcony.","image":"images/hotels/uttarakhand/rishikesh/divine-river-resort-and-spa/room-premium-room-with-balcony.webp"},
      {"name":"Luxury Cottage With Balcony","specs":"Encompassing 400 sq. ft., this intimate space is ideal for 4 guests and promises a perfect blend of privacy and panoramic river vistas.","image":"images/hotels/uttarakhand/rishikesh/divine-river-resort-and-spa/room-luxury-cottage-with-balcony.webp"}
    ],
    sections: [
      {"title":"A Riverside Culinary Journey","text":"Experience the charm of dining by the river at our restaurant, where vegetarian, non-vegetarian, and Jain cuisines come alive. With cosy interiors, optional garden seating, and serene river views, every meal here is a delightful blend of flavours and tranquillity.","image":"images/hotels/uttarakhand/rishikesh/divine-river-resort-and-spa/dining.webp"},
      {"title":"Celebrate Love and Togetherness","text":"Our banquet hall is the perfect canvas for your dream destination wedding and can accommodate 120 guests. With its picturesque location, versatile settings, and impeccable service, we bring your celebrations to life amidst the enchanting beauty of Rishikesh.","image":"images/hotels/uttarakhand/rishikesh/divine-river-resort-and-spa/events.webp"},
      {"title":"Wellness Spa: Rejuvenation Redefined","text":"Unwind and recharge at our wellness spa, a sanctuary for your senses. From soothing massages to indulgent steam and sauna baths, our spa offers holistic treatments designed to refresh your body, mind, and soul.","image":"images/hotels/uttarakhand/rishikesh/divine-river-resort-and-spa/spa.webp"}
    ],
    gallery: [
      "images/hotels/uttarakhand/rishikesh/divine-river-resort-and-spa/main.webp",
      "images/hotels/uttarakhand/rishikesh/divine-river-resort-and-spa/room-deluxe-room-with-forest-view.webp",
      "images/hotels/uttarakhand/rishikesh/divine-river-resort-and-spa/room-premium-room-with-balcony.webp",
      "images/hotels/uttarakhand/rishikesh/divine-river-resort-and-spa/room-luxury-cottage-with-balcony.webp",
      "images/hotels/uttarakhand/rishikesh/divine-river-resort-and-spa/dining.webp",
      "images/hotels/uttarakhand/rishikesh/divine-river-resort-and-spa/events.webp",
      "images/hotels/uttarakhand/rishikesh/divine-river-resort-and-spa/spa.webp"
    ]
  },

  {
    id: "hotel-on-the-ganges",
    category: "hotels",
    state: "Uttarakhand",
    city: "Rishikesh",
    name: "Hotel on the Ganges",
    tagline: "Embrace the Divine Energy of Rishikesh",
    description: "Rishikesh, also known as the 'Yoga Capital of the World', is a haven where the tranquil Ganges meets the towering Himalayas. The city is a breathtaking blend of spiritual serenity, natural beauty, and adventure.",
    about: "Rishikesh, also known as the 'Yoga Capital of the World', is a haven where the tranquil Ganges meets the towering Himalayas. The city is a breathtaking blend of spiritual serenity, natural beauty, and adventure. Whether you're seeking peace by the riverbanks or looking to explore the vibrant local culture, Rishikesh enchants at every turn, offering a perfect balance of tranquillity and excitement. Our 4-star hotel near Ram Jhula in Rishikesh provides the perfect blend of comfort and luxury. Wake up in our cosy accommodations to panoramic views of lush greenery, setting the tone for a peaceful day in the heart of Rishikesh. Relish delicious meals at our restaurant, unwind at the rejuvenating spa, or take advantage of our dynamic event space and modern facilities. Whether you're here to relax, celebrate, or explore, every moment spent here promises a memorable experience.",
    image: "images/hotels/uttarakhand/rishikesh/hotel-on-the-ganges/photo-01.webp",
    address: "Ghughtiyani Talli, Tehsil - Narendra Nagar, Badrinath Road, Near Hotel Alova Grand, Tapovan, Tehri Garhwal, Rishikesh, Uttarakhand - 249192",
    location: {lat: 30.13147,lon: 78.32616},
    highlights: [
      "Restaurant",
      "Banquet Hall",
      "Yoga Hall",
      "Wellness Centre",
      "Indoor Swimming Pool",
      "Indoor Kids' Play Area",
      "Elevator (24-hour)",
      "Free Parking",
      "Laundry Service (Chargeable)",
      "24/7 Customer Support"
    ],
    rooms: [
      {"name":"Premium Room","specs":"Step into 250 sq. ft. of tranquility with a king-size bed, space for 5, and lush green views outside your window—your Rishikesh escape starts here.","image":"images/hotels/uttarakhand/rishikesh/hotel-on-the-ganges/room-premium-room.webp"},
      {"name":"Deluxe Room","specs":"Wake up to misty mornings in these 192 sq. ft. rooms, perfect for up to 4 guests. Sink into a cosy king-size bed and enjoy all the modern comforts at your fingertips.","image":"images/hotels/uttarakhand/rishikesh/hotel-on-the-ganges/room-deluxe-room.webp"},
      {"name":"Deluxe Twin Room","specs":"Whether you're traveling solo or on business, these 192 sq. ft. twin bedrooms offer a peaceful retreat with smart amenities at our hotel in Tapovan.","image":"images/hotels/uttarakhand/rishikesh/hotel-on-the-ganges/room-deluxe-room.webp"},
      {"name":"Suite","specs":"Planning a family trip? These 502 sq. ft. suites sleep six, with a king-size bed, private living area, a Jacuzzi, and lovely in-room dining with views.","image":"images/hotels/uttarakhand/rishikesh/hotel-on-the-ganges/room-suite.webp"}
    ],
    sections: [
      {"title":"Flavours That Speak to the Soul","text":"Our all-day dining restaurant offers delicious Continental, Chinese, and Indian dishes with a touch of South Indian flair. Overlooking lush green mountains and the serene Ganges, it's perfect for relaxed family meals. Open 24/7, it serves both vegetarian and non-vegetarian options along with a lavish buffet.","image":"images/hotels/uttarakhand/rishikesh/hotel-on-the-ganges/dining.webp"},
      {"title":"A Pillarless Canvas for Your Next Event","text":"Planning a corporate event? Our 1,250 sq. ft. pillarless banquet hall in Rishikesh is the perfect spot. With space for up to 130 guests and all the modern amenities you need, it's ideal for conferences and business gatherings. Let us help you create a memorable experience.","image":"images/hotels/uttarakhand/rishikesh/hotel-on-the-ganges/events.webp"},
      {"title":"Feel the Calmness of the Ganges with Every Treatment","text":"Step into a sanctuary of peace and relaxation at our spa, where soothing Ayurvedic treatments and a rejuvenating steam bath await you. Let our skilled therapists melt away your stress and refresh your body and mind, leaving you feeling recharged and completely rejuvenated. It's the perfect escape to nourish your soul and find your inner calm.","image":"images/hotels/uttarakhand/rishikesh/hotel-on-the-ganges/spa.webp"}
    ],
    gallery: [
      "images/hotels/uttarakhand/rishikesh/hotel-on-the-ganges/photo-01.webp",
      "images/hotels/uttarakhand/rishikesh/hotel-on-the-ganges/photo-02.webp",
      "images/hotels/uttarakhand/rishikesh/hotel-on-the-ganges/room-premium-room.webp",
      "images/hotels/uttarakhand/rishikesh/hotel-on-the-ganges/photo-03.webp",
      "images/hotels/uttarakhand/rishikesh/hotel-on-the-ganges/photo-04.webp",
      "images/hotels/uttarakhand/rishikesh/hotel-on-the-ganges/photo-05.webp",
      "images/hotels/uttarakhand/rishikesh/hotel-on-the-ganges/photo-06.webp",
      "images/hotels/uttarakhand/rishikesh/hotel-on-the-ganges/photo-07.webp",
      "images/hotels/uttarakhand/rishikesh/hotel-on-the-ganges/photo-08.webp",
      "images/hotels/uttarakhand/rishikesh/hotel-on-the-ganges/photo-09.webp",
      "images/hotels/uttarakhand/rishikesh/hotel-on-the-ganges/photo-10.webp",
      "images/hotels/uttarakhand/rishikesh/hotel-on-the-ganges/photo-11.webp",
      "images/hotels/uttarakhand/rishikesh/hotel-on-the-ganges/room-deluxe-room.webp"
    ]
  },

  {
    id: "mj-river-resort",
    category: "resorts",
    state: "Uttarakhand",
    city: "Rishikesh",
    name: "MJ River Resort",
    tagline: "The Best Resort in Rishikesh for Riverside Bliss",
    description: "Imagine waking up to the gentle murmur of the sacred Ganges and the soft glow of the morning sun painting the riverbanks – this is what your stay at MJ River Resort looks like. Nestled in the heart of Rishikesh, our 4-star sanctuary combines rustic charm with modern elegance.",
    about: "Imagine waking up to the gentle murmur of the sacred Ganges and the soft glow of the morning sun painting the riverbanks – this is what your stay at MJ River Resort looks like. Nestled in the heart of Rishikesh, our 4-star sanctuary combines rustic charm with modern elegance. As one of the most enchanting resorts in Rishikesh, we offer thoughtfully designed accommodations that provide unmatched comfort and sophistication, complete with breathtaking views that captivate leisure travellers, families, and couples alike. Indulge in a culinary journey at our multi-cuisine restaurant, where every dish tells a story of flavour and tradition, complemented by serene river views and a lush, beautifully maintained garden. Our state-of-the-art conference hall, framed by a tranquil riverside backdrop, is a versatile space seamlessly blending productivity with serenity for impactful meetings, team-building sessions, corporate events, and vibrant private parties. Whether you're seeking a rejuvenating retreat, an adventurous getaway, or the perfect venue for memorable celebrations, MJ River Resort promises an extraordinary experience tailored to your desires.",
    image: "images/hotels/uttarakhand/rishikesh/mj-river-resort/main.webp",
    address: "Ghatto Ghat, Neelkanth Temple Road Taliyal Gaon, Rishikesh, Uttarakhand - 249304",
    location: {lat: 30.09146,lon: 78.38358},
    highlights: [
      "24-hour Travel Desk",
      "24-hour Customer Support",
      "Swimming Pool",
      "Lush Garden Views",
      "Parking Facility (Chargeable)",
      "Multi-cuisine Restaurant",
      "Multiple Event Spaces"
    ],
    rooms: [
      {"name":"Luxury Cottage","specs":"Our Luxury Cottages, spanning 220 sq. ft., for up to 4 guests offer unmatched comfort, blending rustic charm with modern elegance and soothing garden views.","image":"images/hotels/uttarakhand/rishikesh/mj-river-resort/room-luxury-cottage.webp"},
      {"name":"Family Cottage","specs":"At 350 sq. ft., our exclusive Family Cottage features generous space designed for up to 6 guests with modern amenities and stunning views of lush gardens.","image":"images/hotels/uttarakhand/rishikesh/mj-river-resort/room-family-cottage.webp"}
    ],
    sections: [
      {"title":"A Culinary Escape by the Riverside","text":"Every bite at our restaurant is a chapter in a story inspired by the river's rhythm and the garden's vibrant hues. Our multi-cuisine restaurant, nestled by the serene river and lush gardens, combines breathtaking views with dishes crafted from the freshest ingredients. Whether you choose the cosy indoor seating or enjoy the riverside breeze in the garden, every bite is a moment to savour. Here, delicious food meets nature's beauty, creating memories as rich as the tastes on your plate.","image":"images/hotels/uttarakhand/rishikesh/mj-river-resort/dining.webp"},
      {"title":"Designed to Host. Crafted to Impress.","text":"Every celebration deserves a space that inspires, and our event venues deliver just that. Imagine hosting your next meeting or celebration in our elegant 1,200 sq. ft. conference hall, a haven of sophistication and flexibility tailored to your vision. For those moments that call for grandeur, our 2,500 sq. ft. garden becomes a canvas for your imagination, transforming into an enchanting setting for weddings, galas, or festive soirees. Whether surrounded by the refined beauty of our indoor spaces or embraced by the lush serenity of our outdoor garden, your events here are more than just occasions – they're unforgettable stories waiting to be told.","image":"images/hotels/uttarakhand/rishikesh/mj-river-resort/events.webp"}
    ],
    gallery: [
      "images/hotels/uttarakhand/rishikesh/mj-river-resort/main.webp",
      "images/hotels/uttarakhand/rishikesh/mj-river-resort/photo-01.webp",
      "images/hotels/uttarakhand/rishikesh/mj-river-resort/photo-02.webp",
      "images/hotels/uttarakhand/rishikesh/mj-river-resort/photo-03.webp",
      "images/hotels/uttarakhand/rishikesh/mj-river-resort/dining.webp",
      "images/hotels/uttarakhand/rishikesh/mj-river-resort/events.webp",
      "images/hotels/uttarakhand/rishikesh/mj-river-resort/photo-04.webp",
      "images/hotels/uttarakhand/rishikesh/mj-river-resort/room-luxury-cottage.webp",
      "images/hotels/uttarakhand/rishikesh/mj-river-resort/room-family-cottage.webp"
    ]
  }
];


/* Guest reviews. `hotel` is the hotel's id (optional). Tagged reviews also
   appear on that hotel's page. The home page shows the first three in this
   order, so put your best or newest reviews at the top. For example:
   { rating: 5, text: "Lovely stay by the river.", name: "Ananya", from: "Delhi", hotel: "divine-river-resort-and-spa" }, */
const REVIEWS = [
];

/* Common questions, shown on the home page (switch on with FEATURES.faq). For example:
   { q: "What are the check-in and check-out times?", a: "Check-in is at 12 pm and check-out at 10 am." }, */
const FAQS = [
];

/* Optional: old page addresses that should forward to new pages, for example
   when you move from another website. Each old address gets a small page that
   forwards visitors and Google to the new one.
   "/old-page/": "/hotel/divine-river-resort-and-spa/", */
const REDIRECTS = {
};
