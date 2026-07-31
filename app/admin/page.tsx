import type { Metadata } from "next";
import AdminClient from "./admin-client";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin Portal",
  description: "Manage Meharbaan menu categories, products, orders and delivery settings."
};

export default function AdminPage() {
  return <AdminClient />;
}
