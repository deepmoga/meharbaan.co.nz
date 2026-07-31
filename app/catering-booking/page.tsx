import type { Metadata } from "next";
import Script from "next/script";
import { Phone } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { recaptchaSiteKey } from "@/lib/recaptcha-config";

export const metadata: Metadata = {
  title: "Catering Booking | Meharbaan Indian Cuisine",
  description:
    "Book authentic Indian catering for family celebrations, corporate events and special occasions in Auckland.",
};

export default async function CateringBookingPage({
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
      ? "Thank you. Your catering request has been sent to our team."
      : params?.error === "1"
        ? `Sorry, we could not send your request. ${
            params.mailError || "Please call us or try again."
          }`
        : "";

  return (
    <>
      <SiteHeader />
      <main className="catering-booking-page">
        <section className="contact-form-section catering-booking-section">
          <div className="shell contact-form-layout">
            <div className="catering-booking-copy">
              <p className="eyebrow navy">Book a catering service</p>
              <h1>
                Reserve your catering
                <br />
                <em>today.</em>
              </h1>
              <p>
                From family milestones to corporate gatherings, let our kitchen
                bring authentic Indian flavour and warm hospitality to your
                occasion. Share your requirements and we&apos;ll help create a
                generous menu for your guests.
              </p>
              <div className="catering-phone">
                <Phone size={24} aria-hidden="true" />
                <div>
                  <span>Need more help?</span>
                  <a href="tel:+64292420007">029 242 0007</a>
                </div>
              </div>
            </div>
            <form action="/api/catering" method="post">
              <label>
                <span>Name *</span>
                <input name="name" autoComplete="name" required />
              </label>
              <label>
                <span>Address</span>
                <input name="address" autoComplete="street-address" />
              </label>
              <label>
                <span>Email *</span>
                <input name="email" type="email" autoComplete="email" required />
              </label>
              <label>
                <span>Phone *</span>
                <input name="phone" type="tel" autoComplete="tel" required />
              </label>
              <label>
                <span>Event date</span>
                <input name="date" type="date" />
              </label>
              <label>
                <span>Service</span>
                <select name="service" defaultValue="Corporate event">
                  <option>Corporate event</option>
                  <option>Wedding celebration</option>
                  <option>Birthday or family event</option>
                  <option>Private gathering</option>
                  <option>Other catering</option>
                </select>
              </label>
              <label className="full-field">
                <span>Message</span>
                <textarea
                  name="message"
                  rows={6}
                  placeholder="Tell us your guest count, menu ideas and any dietary requirements."
                />
              </label>
              <div className="captcha-field full-field">
                <div className="g-recaptcha" data-sitekey={recaptchaSiteKey} />
              </div>
              <button className="button button-navy full-field" type="submit">
                Send catering request
              </button>
              {formStatus ? (
                <p className="contact-form-status full-field">{formStatus}</p>
              ) : null}
            </form>
          </div>
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
