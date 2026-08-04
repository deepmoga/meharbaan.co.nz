import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin Portal | Meharbaan Indian Cuisine",
  description: "Manage Meharbaan menu categories, products, orders and delivery settings."
};

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
