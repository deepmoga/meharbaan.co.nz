import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { updateOrderStatus } from "@/lib/menu-store";
import { readSiteSettings } from "@/lib/site-settings";
import { stripeRequest, type StripeCheckoutSession } from "@/lib/stripe";
import ClearCart from "./clear-cart";

export const metadata: Metadata = {
  title: "Payment Complete | Meharbaan Indian Cuisine",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams?: Promise<{ session_id?: string }>;
}) {
  const sessionId = (await searchParams)?.session_id || "";
  let paid = false;
  let orderId = "";

  if (sessionId) {
    try {
      const settings = await readSiteSettings();
      const session = await stripeRequest<StripeCheckoutSession>(
        settings.stripe.secretKey,
        `/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      );
      paid =
        session.payment_status === "paid" ||
        session.payment_status === "no_payment_required";
      orderId = session.metadata?.order_id || "";
      if (paid && orderId) await updateOrderStatus(orderId, "paid");
    } catch (error) {
      console.error("Could not verify Stripe checkout session", error);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="checkout-success">
        <div>
          {paid ? <ClearCart /> : null}
          <span aria-hidden="true">{paid ? "✓" : "!"}</span>
          <p className="eyebrow navy">
            {paid ? "Payment confirmed" : "Payment not confirmed"}
          </p>
          <h1>{paid ? "Thank you." : "Please contact us."}</h1>
          <p>
            {paid
              ? `Your order${orderId ? ` ${orderId.slice(0, 8).toUpperCase()}` : ""} has been paid and sent to the Meharbaan kitchen.`
              : "We could not verify this payment. Your cart has been kept so you can try again."}
          </p>
          <a className="button button-navy" href="/order-online">
            {paid ? "Back to menu" : "Return to your order"}
          </a>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
