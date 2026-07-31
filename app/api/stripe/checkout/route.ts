import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createOrder, readMenuStore } from "@/lib/menu-store";
import type { CartItem, CheckoutDetails } from "@/lib/menu-types";
import { getRemoteIp, verifyRecaptcha } from "@/lib/recaptcha";
import { readSiteSettings } from "@/lib/site-settings";
import { stripeRequest, type StripeCheckoutSession } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function siteOrigin(request: Request) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedHost) {
    return `${forwardedProto || "https"}://${forwardedHost}`;
  }
  return new URL(request.url).origin;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      details: CheckoutDetails;
      items: CartItem[];
      captchaToken?: string;
    };

    if (!body.details?.name || !body.details?.phone || !body.items?.length) {
      return NextResponse.json(
        { error: "Customer details and cart items are required." },
        { status: 400 },
      );
    }

    const captcha = await verifyRecaptcha(
      body.captchaToken ?? "",
      getRemoteIp(request),
    );
    if (!captcha.ok) {
      return NextResponse.json({ error: captcha.error }, { status: 400 });
    }

    const [settings, menu] = await Promise.all([
      readSiteSettings(),
      readMenuStore(),
    ]);
    if (!settings.stripe.enabled || !settings.stripe.secretKey) {
      return NextResponse.json(
        { error: "Stripe is not configured. Please choose another payment option." },
        { status: 400 },
      );
    }

    const selectedMode = body.details.mode;
    const modeEnabled =
      (selectedMode === "delivery" && menu.orderOptions.delivery) ||
      (selectedMode === "pickup" && menu.orderOptions.pickup);
    if (!modeEnabled) {
      return NextResponse.json(
        { error: `${selectedMode === "delivery" ? "Delivery" : "Pickup"} ordering is currently unavailable.` },
        { status: 400 },
      );
    }

    const validatedItems: CartItem[] = [];
    for (const item of body.items.slice(0, 100)) {
      const product = menu.products.find(
        (candidate) => candidate.id === item.productId && candidate.active,
      );
      if (!product) continue;
      const quantity = Math.max(1, Math.min(50, Math.floor(Number(item.quantity))));
      const size = item.size?.name
        ? product.sizeOptions.find((option) => option.name === item.size?.name)
        : undefined;
      const spice = item.spice
        ? product.spiceOptions.find((option) => option === item.spice)
        : undefined;
      validatedItems.push({
        id: item.id,
        productId: product.id,
        name: product.name,
        price: product.price + (size?.extra ?? 0),
        quantity,
        size,
        spice,
      });
    }

    if (!validatedItems.length) {
      return NextResponse.json(
        { error: "Your cart no longer contains available items." },
        { status: 400 },
      );
    }

    const orderId = randomUUID();
    const total = validatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const origin = siteOrigin(request);
    const params = new URLSearchParams({
      mode: "payment",
      submit_type: "pay",
      client_reference_id: orderId,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?payment=cancelled`,
      "metadata[order_id]": orderId,
      "payment_intent_data[metadata][order_id]": orderId,
    });
    if (body.details.email) {
      params.set("customer_email", body.details.email);
    }
    validatedItems.forEach((item, index) => {
      const prefix = `line_items[${index}]`;
      params.set(`${prefix}[quantity]`, String(item.quantity));
      params.set(
        `${prefix}[price_data][currency]`,
        settings.stripe.currency || "nzd",
      );
      params.set(
        `${prefix}[price_data][unit_amount]`,
        String(Math.round(item.price * 100)),
      );
      params.set(
        `${prefix}[price_data][product_data][name]`,
        [
          item.name,
          item.size?.name,
          item.spice,
        ].filter(Boolean).join(" · "),
      );
    });

    const session = await stripeRequest<StripeCheckoutSession>(
      settings.stripe.secretKey,
      "/v1/checkout/sessions",
      { method: "POST", body: params },
    );
    if (!session.url) throw new Error("Stripe did not return a checkout URL.");

    await createOrder({
      id: orderId,
      status: "pending_payment",
      details: body.details,
      items: validatedItems,
      total,
    });

    return NextResponse.json({ ok: true, url: session.url, orderId });
  } catch (error) {
    console.error("Stripe checkout failed", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Stripe checkout could not be started.",
      },
      { status: 500 },
    );
  }
}
