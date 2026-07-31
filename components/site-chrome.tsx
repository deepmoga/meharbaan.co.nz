import {
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=154+Shirley+Road+Papatoetoe+Auckland+2025";
const FACEBOOK_URL =
  "https://www.facebook.com/profile.php?id=61585619636550";
const INSTAGRAM_URL =
  "https://www.instagram.com/meharbaanindiancuisine";

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M13.7 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.8-.1-1.6-.2-2.4-.2-2.4 0-4 1.4-4 4.1V10H8v3h2.6v8h3.1Z"
      />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <>
      <div className="topbar">
        <div className="shell topbar-inner">
          <div className="topbar-contact">
            <a href="tel:+6492120007">
              <Phone size={14} aria-hidden="true" />
              09 212 0007
            </a>
            <a href="tel:+64292420007">
              <Phone size={14} aria-hidden="true" />
              029 242 0007
            </a>
            <a href={MAP_URL} target="_blank" rel="noreferrer">
              <MapPin size={15} aria-hidden="true" />
              154 Shirley Road, Papatoetoe, Auckland 2025
            </a>
          </div>
          <div className="topbar-social" aria-label="Social media">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <FacebookIcon />
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="shell nav-shell">
          <a className="brand" href="/" aria-label="Meharbaan home">
            <img src="/meharbaan-logo.png" alt="Meharbaan Indian Cuisine" />
          </a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="/">Home</a>
            <a href="/about-us">About Us</a>
            <a href="/order-online">Menu</a>
            <a href="/catering-booking">Catering Booking</a>
            <a href="/contact-us">Contact Us</a>
          </nav>
          <a className="button button-gold header-order" href="/order-online">
            Order online <span aria-hidden="true">→</span>
          </a>
          <details className="mobile-nav">
            <summary aria-label="Open navigation">
              <span />
              <span />
              <span />
            </summary>
            <nav aria-label="Mobile navigation">
              <a href="/">Home</a>
              <a href="/about-us">About Us</a>
              <a href="/order-online">Menu &amp; Order</a>
              <a href="/catering-booking">Catering Booking</a>
              <a href="/contact-us">Contact Us</a>
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div className="footer-brand">
          <img src="/meharbaan-logo.png" alt="Meharbaan Indian Cuisine" />
          <p>
            Authentic Indian food, generous hospitality and flavours made to
            be shared.
          </p>
          <div className="footer-social" aria-label="Social media">
            <a href={FACEBOOK_URL} target="_blank" rel="noreferrer">
              <FacebookIcon size={18} />
              <span>Facebook</span>
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
              <InstagramIcon size={18} />
              <span>Instagram</span>
            </a>
          </div>
        </div>
        <div className="footer-links">
          <div>
            <span>Explore</span>
            <a href="/about-us">About Us</a>
            <a href="/order-online">Menu &amp; Order</a>
            <a href="/catering-booking">Catering Booking</a>
            <a href="/contact-us">Contact Us</a>
          </div>
          <div className="footer-contact">
            <span>Contact</span>
            <a href="tel:+6492120007">
              <Phone size={16} aria-hidden="true" />
              09 212 0007
            </a>
            <a href="tel:+64292420007">
              <Phone size={16} aria-hidden="true" />
              029 242 0007
            </a>
            <a href={MAP_URL} target="_blank" rel="noreferrer">
              <MapPin size={16} aria-hidden="true" />
              154 Shirley Road, Papatoetoe, Auckland 2025
            </a>
            <a href="mailto:meharbaanindiancuisine@gmail.com">
              <Mail size={16} aria-hidden="true" />
              meharbaanindiancuisine@gmail.com
            </a>
          </div>
        </div>
      </div>
      <div className="shell footer-bottom">
        <p>© 2026 Meharbaan Indian Cuisine. All rights reserved.</p>
        <p>
          Papatoetoe · Auckland · New Zealand · <a href="/admin">Admin</a>
        </p>
      </div>
    </footer>
  );
}
