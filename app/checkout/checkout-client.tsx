"use client";

import { useEffect, useMemo, useState } from "react";
import type { CartItem, CheckoutDetails } from "@/lib/menu-types";

const cartKey = "meharbaan-cart";
const checkoutKey = "meharbaan-checkout";

function money(value: number) {
  return `$${value.toFixed(2)}`;
}

export default function CheckoutClient({
  stripeEnabled,
}: {
  stripeEnabled: boolean;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mode, setMode] = useState<"delivery" | "pickup">("delivery");
  const [suburb, setSuburb] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(checkoutKey);
    if (!saved) return;
    const checkout = JSON.parse(saved) as {
      items: CartItem[];
      mode: "delivery" | "pickup";
      suburb: string;
      time: string;
    };
    queueMicrotask(() => {
      setItems(checkout.items ?? []);
      setMode(checkout.mode ?? "delivery");
      setSuburb(checkout.suburb ?? "");
      setTime(checkout.time ?? "");
    });
  }, []);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || !items.length) return;
    setSubmitting(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    const details: CheckoutDetails = {
      mode,
      suburb,
      time,
      name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      address: String(form.get("address") ?? ""),
      zipcode: String(form.get("zipcode") ?? ""),
      notes: String(form.get("notes") ?? ""),
    };

    try {
      const response = await fetch(
        stripeEnabled ? "/api/stripe/checkout" : "/api/orders",
        {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ details, items }),
        },
      );
      const data = (await response.json()) as {
        error?: string;
        order?: { id?: string };
        mail?: { ok?: boolean; error?: string };
        url?: string;
      };
      if (stripeEnabled && response.ok && data.url) {
        window.location.assign(data.url);
        return;
      }
      if (!response.ok || !data.order?.id) {
        setStatus(data.error ?? "We could not place the order.");
        return;
      }
      window.localStorage.removeItem(cartKey);
      window.localStorage.removeItem(checkoutKey);
      setItems([]);
      setOrderId(data.order.id);
      if (data.mail?.ok === false) {
        setStatus(
          `Your order was received, but email was not sent: ${data.mail.error}`,
        );
      }
    } catch {
      setStatus("We could not place the order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (orderId) {
    return (
      <main className="checkout-success">
        <div>
          <span aria-hidden="true">✓</span>
          <p className="eyebrow navy">Order received</p>
          <h1>Thank you.</h1>
          <p>
            Your order <strong>{orderId}</strong> has been sent to the
            Meharbaan kitchen.
          </p>
          <a className="button button-navy" href="/order-online">
            Back to menu
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="shell checkout-layout">
        <form className="checkout-form" onSubmit={submitOrder}>
          <p className="eyebrow navy">Almost there</p>
          <h1>
            Complete your
            <br />
            <em>order.</em>
          </h1>
          <div className="checkout-meta">
            <span>{mode}</span>
            {suburb ? <span>{suburb}</span> : null}
            <span>{time || "Time not selected"}</span>
          </div>
          <div className="checkout-fields">
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
            {mode === "delivery" ? (
              <>
                <label className="full-field">
                  <span>Delivery address *</span>
                  <input
                    name="address"
                    autoComplete="street-address"
                    required
                  />
                </label>
                <label>
                  <span>Postcode *</span>
                  <input name="zipcode" autoComplete="postal-code" required />
                </label>
              </>
            ) : null}
            <label className="full-field">
              <span>Order notes</span>
              <textarea
                name="notes"
                rows={4}
                placeholder="Dietary notes or helpful instructions"
              />
            </label>
          </div>
          {status ? <p className="checkout-error">{status}</p> : null}
          <button
            className="button button-gold checkout-submit"
            type="submit"
            disabled={!items.length || !time || submitting}
          >
            {submitting
              ? stripeEnabled
                ? "Opening secure payment…"
                : "Sending order…"
              : stripeEnabled
                ? `Pay securely · ${money(total)}`
                : `Place order · ${money(total)}`}
          </button>
          {stripeEnabled ? (
            <p className="checkout-payment-note">
              You&apos;ll complete payment on Stripe&apos;s secure checkout.
            </p>
          ) : null}
        </form>

        <aside className="checkout-summary">
          <p className="eyebrow navy">Your selection</p>
          <h2>Order summary</h2>
          <div>
            {items.length ? (
              items.map((item) => (
                <article key={item.id}>
                  <span>{item.quantity}×</span>
                  <div>
                    <strong>{item.name}</strong>
                    <small>
                      {item.size?.name}
                      {item.size && item.spice ? " · " : ""}
                      {item.spice}
                    </small>
                  </div>
                  <b>{money(item.price * item.quantity)}</b>
                </article>
              ))
            ) : (
              <p>Your cart is empty. Return to the menu to add dishes.</p>
            )}
          </div>
          <footer>
            <span>Total</span>
            <strong>{money(total)}</strong>
          </footer>
          <a href="/order-online">← Edit order</a>
        </aside>
      </div>
    </main>
  );
}
