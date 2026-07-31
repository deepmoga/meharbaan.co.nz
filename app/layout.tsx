import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import "./commerce.css";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "https";
  const base = host ? `${protocol}://${host}` : "https://meharbaan.co.nz";

  return {
    metadataBase: new URL(base),
    title: "Meharbaan Indian Cuisine | Papatoetoe, Auckland",
    description:
      "Authentic Indian cuisine in Papatoetoe. Order curries, tandoori favourites, biryani, vegan dishes, momos and Indo-Chinese plates online.",
    keywords: [
      "Indian restaurant Papatoetoe",
      "Indian food Auckland",
      "Meharbaan Indian Cuisine",
      "Indian takeaway Papatoetoe",
      "Indian catering Auckland",
    ],
    alternates: {
      canonical: "/",
    },
    icons: {
      icon: "/meharbaan-logo.png",
      shortcut: "/meharbaan-logo.png",
      apple: "/meharbaan-logo.png",
    },
    openGraph: {
      type: "website",
      locale: "en_NZ",
      url: "/",
      siteName: "Meharbaan Indian Cuisine",
      title: "Meharbaan Indian Cuisine | A feast made for sharing",
      description:
        "Authentic Indian flavours, freshly prepared in Papatoetoe, Auckland.",
      images: [
        {
          url: "/og.jpg",
          width: 1200,
          height: 630,
          alt: "Meharbaan Indian Cuisine — a feast made for sharing",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Meharbaan Indian Cuisine",
      description: "A feast made for sharing in Papatoetoe, Auckland.",
      images: ["/og.jpg"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
