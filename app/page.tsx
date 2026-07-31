import { SiteFooter, SiteHeader } from "@/components/site-chrome";

const ORDER_URL = "/order-online";
const MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=154+Shirley+Road+Papatoetoe+Auckland+2025";

const menuHighlights = [
  {
    name: "Butter Chicken",
    note: "Tandoori chicken finished in a silky tomato and cream gravy.",
    price: "$14.99",
    image: "/butter-chicken.webp",
    tag: "House favourite",
  },
  {
    name: "Chicken Tikka Masala",
    note: "Charred tandoori chicken folded through a fragrant, spiced gravy.",
    price: "$14.99",
    image: "/chicken-tikka.webp",
    tag: "From the tandoor",
  },
  {
    name: "Hyderabadi Biryani",
    note: "Aromatic basmati rice layered with warming spices and herbs.",
    price: "From $14.99",
    image: "/biryani.webp",
    tag: "Slow layered",
  },
  {
    name: "Palak Paneer",
    note: "Soft paneer simmered in a smooth, gently spiced spinach sauce.",
    price: "$13.99",
    image: "/palak-paneer.webp",
    tag: "Vegetarian",
  },
];

const promises = [
  {
    number: "01",
    title: "Rooted in tradition",
    text: "Time-honoured recipes, aromatic spices and the comfort of food made with care.",
  },
  {
    number: "02",
    title: "Freshly prepared",
    text: "Quality ingredients are cooked with consistency, balance and attention to every plate.",
  },
  {
    number: "03",
    title: "Made for everyone",
    text: "Indian classics, vegan choices, Indo-Chinese favourites, momos and family-friendly meals.",
  },
];

export default function Home() {
  const restaurantJsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Meharbaan Indian Cuisine",
    image: "https://meharbaan.co.nz/og.jpg",
    url: "https://meharbaan.co.nz",
    telephone: "+6492120007",
    servesCuisine: ["Indian", "North Indian", "Indo-Chinese"],
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "154 Shirley Road",
      addressLocality: "Papatoetoe",
      addressRegion: "Auckland",
      postalCode: "2025",
      addressCountry: "NZ",
    },
    sameAs: [
      "https://www.facebook.com/profile.php?id=61585619636550",
      "https://www.instagram.com/meharbaanindiancuisine",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
      />

      <SiteHeader />

      <main>
        <section className="hero" id="home">
          <div className="hero-grain" aria-hidden="true" />
          <div className="shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                <span aria-hidden="true">✦</span>
                Papatoetoe, Auckland
              </p>
              <h1>
                A feast made
                <br />
                <em>for sharing.</em>
              </h1>
              <p className="hero-lead">
                From smoky tandoori favourites to slow-simmered curries, every
                Meharbaan meal brings India&apos;s generous spirit to your table.
              </p>
              <div className="hero-actions">
                <a
                  className="button button-gold"
                  href={ORDER_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Explore & order
                  <span aria-hidden="true">↗</span>
                </a>
                <a className="text-link" href="#menu">
                  See our favourites
                  <span aria-hidden="true">↓</span>
                </a>
              </div>
              <div className="hero-notes">
                <div>
                  <strong>17+</strong>
                  <span>Vegetarian mains</span>
                </div>
                <div>
                  <strong>11</strong>
                  <span>Naturally vegan picks</span>
                </div>
                <div>
                  <strong>Late</strong>
                  <span>Pickup & delivery</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="gold-frame" aria-hidden="true" />
              <figure className="hero-photo">
                <img
                  src="/butter-chicken.webp"
                  alt="Creamy butter chicken finished with herbs"
                />
              </figure>
              <figure className="hero-photo-small">
                <img
                  src="/biryani.webp"
                  alt="Aromatic Hyderabadi biryani"
                />
              </figure>
              <div className="hero-seal" aria-hidden="true">
                <span>Made with</span>
                <strong>heart</strong>
                <span>served with warmth</span>
              </div>
              <div className="hero-caption">
                <span>Meharbaan favourite</span>
                <strong>Butter Chicken</strong>
              </div>
            </div>
          </div>
          <div className="marquee" aria-label="Restaurant qualities">
            <div>
              <span>Authentic recipes</span>
              <b>✦</b>
              <span>Fresh ingredients</span>
              <b>✦</b>
              <span>Warm hospitality</span>
              <b>✦</b>
              <span>Big flavour</span>
              <b>✦</b>
              <span>Family favourites</span>
            </div>
          </div>
        </section>

        <section className="story-section" id="story">
          <div className="shell story-grid">
            <div className="story-mark" aria-hidden="true">
              <span>M</span>
              <i>B</i>
            </div>
            <div className="story-heading">
              <p className="eyebrow navy">Our story</p>
              <h2>
                Indian heritage,
                <br />
                <em>Auckland heart.</em>
              </h2>
            </div>
            <div className="story-copy">
              <p className="story-lead">
                At Meharbaan, we bring the rich heritage of Indian cuisine to
                New Zealand with a balance of tradition, flavour and quality.
              </p>
              <p>
                Our kitchen is rooted in authentic recipes and time-honoured
                techniques. Aromatic spices, carefully selected ingredients and
                a deep love of hospitality shape every plate—whether it&apos;s a
                family dinner, a quick takeaway or a celebration worth
                remembering.
              </p>
              <a className="text-link dark-link" href="#experience">
                What makes us different
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </section>

        <section className="menu-section" id="menu">
          <div className="shell">
            <div className="section-heading menu-heading">
              <div>
                <p className="eyebrow navy">From our kitchen</p>
                <h2>
                  Flavours you&apos;ll
                  <br />
                  <em>come back for.</em>
                </h2>
              </div>
              <div className="heading-side">
                <p>
                  Classic curries, tandoori favourites, biryani, vegan dishes,
                  Indo-Chinese plates and more.
                </p>
                <a
                  className="button button-outline-navy"
                  href={ORDER_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  View full menu
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <div className="menu-grid">
              {menuHighlights.map((item, index) => (
                <article className="dish-card" key={item.name}>
                  <div className="dish-image">
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="dish-info">
                    <p>{item.tag}</p>
                    <div className="dish-title">
                      <h3>{item.name}</h3>
                      <strong>{item.price}</strong>
                    </div>
                    <p>{item.note}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="menu-categories">
              <span>Also on the menu</span>
              <div>
                {[
                  "Tandoor",
                  "Momos",
                  "Lamb & goat",
                  "Vegan",
                  "Indo-Chinese",
                  "Breads",
                  "Kids",
                  "Desserts",
                ].map((category) => (
                  <a
                    key={category}
                    href={ORDER_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {category}
                    <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="experience-section" id="experience">
          <div className="shell experience-grid">
            <div className="experience-photos">
              <figure className="experience-main">
                <img
                  src="/chicken-tikka.webp"
                  alt="Chicken tikka masala"
                />
              </figure>
              <figure className="experience-accent">
                <img
                  src="/palak-paneer.webp"
                  alt="Palak paneer"
                />
              </figure>
              <div className="experience-stamp">
                <span>Meharbaan</span>
                <b>✦</b>
                <span>Papatoetoe</span>
              </div>
            </div>
            <div className="experience-copy">
              <p className="eyebrow gold">The Meharbaan way</p>
              <h2>
                Food with soul.
                <br />
                Welcome with <em>heart.</em>
              </h2>
              <p>
                Great food begins with passion and ends with satisfaction. We
                take pride in preparing every meal with care, consistency and
                the unmistakable warmth of Indian hospitality.
              </p>
              <div className="promise-list">
                {promises.map((promise) => (
                  <article key={promise.number}>
                    <span>{promise.number}</span>
                    <div>
                      <h3>{promise.title}</h3>
                      <p>{promise.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="catering-section" id="catering">
          <div className="shell catering-card">
            <div className="catering-pattern" aria-hidden="true">
              <span>✦</span>
              <span>✦</span>
              <span>✦</span>
            </div>
            <div>
              <p className="eyebrow navy">Celebrate with Meharbaan</p>
              <h2>
                Big moments deserve
                <br />
                <em>generous tables.</em>
              </h2>
            </div>
            <div className="catering-copy">
              <p>
                From family milestones to corporate gatherings, let our kitchen
                bring bold flavours and warm hospitality to your occasion.
              </p>
              <a className="button button-navy" href="tel:0292420007">
                Plan your catering
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        <section className="visit-section" id="visit">
          <div className="shell visit-grid">
            <div className="visit-heading">
              <p className="eyebrow navy">Come say hello</p>
              <h2>
                Your table is
                <br />
                <em>waiting.</em>
              </h2>
              <p>
                Find Meharbaan on Shirley Road for dine-in, pickup and delivery.
              </p>
            </div>
            <div className="visit-details">
              <article>
                <span>Address</span>
                <h3>154 Shirley Road</h3>
                <p>Papatoetoe, Auckland 2025</p>
                <a href={MAP_URL} target="_blank" rel="noreferrer">
                  Get directions ↗
                </a>
              </article>
              <article>
                <span>Call us</span>
                <h3>
                  <a href="tel:+6492120007">09 212 0007</a>
                </h3>
                <p>
                  Mobile: <a href="tel:0292420007">029 242 0007</a>
                </p>
                <a href="mailto:meharbaanindiancuisine@gmail.com">
                  Email us ↗
                </a>
              </article>
              <article>
                <span>Order</span>
                <h3>Pickup or delivery</h3>
                <p>Browse the full menu and choose your favourites online.</p>
                <a href={ORDER_URL} target="_blank" rel="noreferrer">
                  Start an order ↗
                </a>
              </article>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
