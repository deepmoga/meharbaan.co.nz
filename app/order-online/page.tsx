import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import MenuClient from "./menu-client";

export const metadata: Metadata = {
  title: "Order Online | Meharbaan Indian Cuisine",
  description:
    "Browse and order Meharbaan Indian Cuisine favourites for pickup or delivery in Papatoetoe, Auckland.",
};

export default function OrderOnlinePage() {
  return (
    <>
      <SiteHeader />
      <MenuClient />
      <SiteFooter />
    </>
  );
}
