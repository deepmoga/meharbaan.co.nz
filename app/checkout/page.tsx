import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { readSiteSettings } from "@/lib/site-settings";
import CheckoutClient from "./checkout-client";

export const metadata: Metadata = {
  title: "Checkout | Meharbaan Indian Cuisine",
  description: "Complete your Meharbaan pickup or delivery order.",
};

export default async function CheckoutPage() {
  const settings = await readSiteSettings();
  const stripeEnabled =
    settings.stripe.enabled && Boolean(settings.stripe.secretKey);
  return (
    <>
      <SiteHeader />
      <CheckoutClient stripeEnabled={stripeEnabled} />
      <SiteFooter />
    </>
  );
}
