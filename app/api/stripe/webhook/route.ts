import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/menu-store";
import { readSiteSettings } from "@/lib/site-settings";
import {
  verifyStripeSignature,
  type StripeCheckoutSession,
} from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type StripeEvent = {
  type: string;
  data?: {
    object?: StripeCheckoutSession;
  };
};

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") || "";
  const settings = await readSiteSettings();

  if (!settings.stripe.webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook secret is not configured." },
      { status: 503 },
    );
  }
  if (
    !verifyStripeSignature(
      payload,
      signature,
      settings.stripe.webhookSecret,
    )
  ) {
    return NextResponse.json(
      { error: "Invalid Stripe signature." },
      { status: 400 },
    );
  }

  const event = JSON.parse(payload) as StripeEvent;
  const session = event.data?.object;
  const orderId = session?.metadata?.order_id;
  if (orderId) {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      await updateOrderStatus(orderId, "paid");
    } else if (
      event.type === "checkout.session.expired" ||
      event.type === "checkout.session.async_payment_failed"
    ) {
      await updateOrderStatus(orderId, "payment_failed");
    }
  }

  return NextResponse.json({ received: true });
}
