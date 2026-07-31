import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Our Story | Meharbaan Indian Cuisine",
  description:
    "Discover Meharbaan's passion for authentic Indian food and warm hospitality in Papatoetoe.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="editorial-page">
        <section className="inner-hero shell">
          <div>
            <p className="eyebrow navy">About Meharbaan</p>
            <h1>
              Indian heritage.
              <br />
              <em>New Zealand heart.</em>
            </h1>
            <p>
              Authentic recipes, generous hospitality and memorable flavours
              shared from our Papatoetoe kitchen.
            </p>
          </div>
          <div className="inner-hero-images">
            <img src="/chicken-tikka.webp" alt="Fresh chicken tikka masala" />
            <img src="/palak-paneer.webp" alt="Palak paneer" />
          </div>
        </section>
        <section className="about-copy shell">
          <aside>
            <span>M</span>
            <strong>Made with care</strong>
          </aside>
          <div>
            <p className="eyebrow navy">Our story</p>
            <h2>Tradition, flavour and quality in every meal.</h2>
            <p>
              At Meharbaan Indian Cuisine, we bring the rich heritage of Indian
              cuisine to New Zealand with a perfect balance of tradition,
              flavour, and quality. Rooted in authentic recipes and
              time-honoured cooking techniques, our journey is driven by a deep
              love for Indian food and hospitality.
            </p>
            <p>
              Every dish we create reflects the diversity of India&apos;s culinary
              culture — from aromatic spices to carefully selected ingredients.
              Our focus is on delivering food that not only tastes exceptional
              but also creates memorable experiences for every guest.
            </p>
            <p>
              We believe great food begins with passion and ends with
              satisfaction. That&apos;s why our team takes pride in preparing each
              meal with care, consistency, and attention to detail, ensuring
              authentic flavours in every bite.
            </p>
            <p>
              Whether you&apos;re enjoying a meal with family, celebrating a special
              moment, or simply craving comforting Indian food, Meharbaan is
              dedicated to serving you quality, warmth, and unforgettable taste.
            </p>
          </div>
        </section>
        <section className="about-values">
          <div className="shell">
            {[
              ["01", "Authentic flavours", "Recipes inspired by Indian tradition and cooked with real aromatic spices."],
              ["02", "Quality ingredients", "Fresh, carefully selected ingredients treated with care in our kitchen."],
              ["03", "Generous hospitality", "Friendly service and food made for sharing with the people who matter."],
              ["04", "Choice for everyone", "Vegetarian, vegan, meat, Indo-Chinese and family-friendly favourites."],
            ].map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="about-cta shell">
          <img src="/biryani.webp" alt="Meharbaan biryani" />
          <div>
            <p className="eyebrow">Come hungry</p>
            <h2>
              There&apos;s always room
              <br />
              <em>at our table.</em>
            </h2>
            <a className="button button-gold" href="/order-online">
              Explore the menu →
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
