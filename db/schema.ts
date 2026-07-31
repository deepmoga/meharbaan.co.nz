import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const menuCategories = sqliteTable("menu_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const menuProducts = sqliteTable("menu_products", {
  id: text("id").primaryKey(),
  categoryId: text("category_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  price: real("price").notNull().default(0),
  image: text("image").notNull().default("/butter-chicken.webp"),
  sizeOptions: text("size_options").notNull().default("[]"),
  spiceOptions: text("spice_options").notNull().default("[]"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
});

export const restaurantSettings = sqliteTable("restaurant_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const customerOrders = sqliteTable("customer_orders", {
  id: text("id").primaryKey(),
  status: text("status").notNull().default("new"),
  createdAt: text("created_at").notNull(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull().default(""),
  mode: text("mode").notNull(),
  address: text("address").notNull().default(""),
  suburb: text("suburb").notNull().default(""),
  pickupTime: text("pickup_time").notNull().default(""),
  notes: text("notes").notNull().default(""),
  items: text("items").notNull(),
  total: real("total").notNull().default(0),
});
