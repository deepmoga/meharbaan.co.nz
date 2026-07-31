import type { Metadata } from "next";
import Script from "next/script";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { recaptchaSiteKey } from "@/lib/recaptcha-config";

const MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=154+Shirley+Road+Papatoetoe+Auckland+2025";

export const metadata: Metadata = {
  title: "Visit Us | Meharbaan Indian Cuisine",
  description:
    "Visit Meharbaan Indian Cuisine at 154 Shirley Road, Papatoetoe, Auckland.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<{
    sent?: string;
    error?: string;
    mailError?: string;
  }>;
}) {
  const params = await searchParams;
  const formStatus =
    params?.sent === "1"
      ? "Thank you. Your message has been sent."
      : params?.error === "1"
        ? `Sorry, we could not send your message. ${
            params.mailError || "Please call us or try again."
          }`
        : "";

  return (
    <>
      <SiteHeader />
      <main className="contact-page">
        <section className="contact-intro shell">
          <div>
            <p className="eyebrow navy">Come say hello</p>
            <h1>
              Find us in the heart
              <br />
              <em>of Papatoetoe.</em>
            </h1>
            <p>
              Dine in, pick up your favourites or order delivery from our full
              menu.
            </p>
          </div>
          <img src="/butter-chicken.webp" alt="Meharbaan butter chicken" />
        </section>
        <section className="contact-cards shell">
          <article>
            <span>01 · Address</span>
            <h2>154 Shirley Road</h2>
            <p>Papatoetoe, Auckland 2025</p>
            <a href={MAP_URL} target="_blank" rel="noreferrer">
              Get directions ↗
            </a>
          </article>
          <article>
            <span>02 · Call</span>
            <h2>
              <a href="tel:+6492120007">09 212 0007</a>
            </h2>
            <p>
              Mobile: <a href="tel:0292420007">029 242 0007</a>
            </p>
            <a href="mailto:meharbaanindiancuisine@gmail.com">Email us ↗</a>
          </article>
          <article>
            <span>03 · Order</span>
            <h2>Pickup or delivery</h2>
            <p>Choose a time, customise your dishes and order online.</p>
            <a href="/order-online">Start your order →</a>
          </article>
        </section>
        <section className="contact-form-section">
          <div className="shell contact-form-layout">
            <div>
              <p className="eyebrow navy">Reservations & enquiries</p>
              <h2>
                Plan your table
                <br />
                <em>with us.</em>
              </h2>
              <p>
                Send us your details for a reservation, catering enquiry or
                special occasion. Our team will get back to you.
              </p>
            </div>
            <form action="/api/reservations" method="post">
              <label>
                <span>Name *</span>
                <input name="name" autoComplete="name" required />
              </label>
              <label>
                <span>Phone *</span>
                <input name="phone" type="tel" autoComplete="tel" required />
              </label>
              <label>
                <span>Email</span>
                <input name="email" type="email" autoComplete="email" />
              </label>
              <label>
                <span>Date</span>
                <input name="date" type="date" />
              </label>
              <label>
                <span>Time</span>
                <input name="time" type="time" />
              </label>
              <label>
                <span>Guests</span>
                <input name="people" type="number" min="1" />
              </label>
              <label className="full-field">
                <span>Message</span>
                <textarea name="message" rows={5} />
              </label>
              <div className="captcha-field full-field">
                <div className="g-recaptcha" data-sitekey={recaptchaSiteKey} />
              </div>
              <button className="button button-navy full-field" type="submit">
                Send enquiry
              </button>
              {formStatus ? (
                <p className="contact-form-status full-field">{formStatus}</p>
              ) : null}
            </form>
          </div>
        </section>
        <section className="contact-map" aria-label="Meharbaan location map">
          <iframe
            title="Meharbaan Indian Cuisine map"
            src="https://www.google.com/maps?q=154%20Shirley%20Road%2C%20Papatoetoe%2C%20Auckland%202025&output=embed"
            loading="lazy"
          />
        </section>
      </main>
      <Script
        src="https://www.google.com/recaptcha/api.js"
        strategy="afterInteractive"
      />
      <SiteFooter />
    </>
  );
}
