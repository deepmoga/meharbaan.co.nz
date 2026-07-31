// Generate SQL file from the seed data
// Run with: npx tsx generate-sql.ts

import { seedCategories, seedProducts, seedSettings } from "./lib/seed-data";

function esc(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n");
}

const lines: string[] = [];

lines.push("-- ============================================");
lines.push("-- Meharbaan Indian Cuisine - Database Schema & Seed Data");
lines.push("-- Generated: " + new Date().toISOString());
lines.push("-- ============================================");
lines.push("");

// Tables
lines.push("-- 1. Menu Categories");
lines.push(`CREATE TABLE IF NOT EXISTS menu_categories (
  id VARCHAR(128) PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
lines.push("");

lines.push("-- 2. Menu Products");
lines.push(`CREATE TABLE IF NOT EXISTS menu_products (
  id VARCHAR(191) PRIMARY KEY,
  category_id VARCHAR(128) NOT NULL,
  name VARCHAR(191) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  image VARCHAR(500) NOT NULL DEFAULT '/butter-chicken.webp',
  size_options JSON NOT NULL,
  spice_options JSON NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX menu_products_category_idx (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
lines.push("");

lines.push("-- 3. App Settings");
lines.push(`CREATE TABLE IF NOT EXISTS app_settings (
  setting_key VARCHAR(80) PRIMARY KEY,
  setting_value JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
lines.push("");

lines.push("-- 4. Delivery Settings");
lines.push(`CREATE TABLE IF NOT EXISTS delivery_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  suburbs JSON NOT NULL,
  time_slots JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
lines.push("");

lines.push("-- 5. Orders");
lines.push(`CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(80) PRIMARY KEY,
  mode ENUM('delivery', 'pickup') NOT NULL,
  customer_name VARCHAR(180) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  address VARCHAR(255) NOT NULL DEFAULT '',
  zipcode VARCHAR(20) NOT NULL DEFAULT '',
  suburb VARCHAR(120),
  delivery_time VARCHAR(40),
  notes TEXT,
  items JSON NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  order_snapshot JSON,
  status VARCHAR(40) NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
lines.push("");

// Seed data
lines.push("-- ============================================");
lines.push("-- SEED DATA");
lines.push("-- ============================================");
lines.push("");

// Categories
lines.push("-- Clear existing data");
lines.push("DELETE FROM menu_products;");
lines.push("DELETE FROM menu_categories;");
lines.push("");

lines.push("-- Insert Categories");
for (const cat of seedCategories) {
  lines.push(`INSERT INTO menu_categories (id, name, sort_order) VALUES ('${esc(cat.id)}', '${esc(cat.name)}', ${cat.sortOrder});`);
}
lines.push("");

// Products
lines.push("-- Insert Products");
for (const p of seedProducts) {
  const sizeOpts = esc(JSON.stringify(p.sizeOptions));
  const spiceOpts = esc(JSON.stringify(p.spiceOptions));
  lines.push(`INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('${esc(p.id)}', '${esc(p.categoryId)}', '${esc(p.name)}', '${esc(p.description)}', ${p.price}, '', '${sizeOpts}', '${spiceOpts}', 1, 1);`);
}
lines.push("");

// Settings
lines.push("-- Insert Settings");
lines.push(`INSERT INTO app_settings (setting_key, setting_value) VALUES ('order_options', '${esc(JSON.stringify({ delivery: seedSettings.delivery, pickup: seedSettings.pickup }))}') ON DUPLICATE KEY UPDATE setting_key = setting_key;`);
lines.push(`INSERT INTO app_settings (setting_key, setting_value) VALUES ('menu_catalog_version', '"excel-2026-07-29"') ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);`);
lines.push("");

// Delivery settings
const daySlots = Object.fromEntries(
  ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map(
    day => [day, seedSettings.timeSlots]
  )
);
lines.push("-- Insert Delivery Settings (only if empty)");
lines.push(`INSERT INTO delivery_settings (suburbs, time_slots) SELECT '${esc(JSON.stringify(seedSettings.suburbs))}', '${esc(JSON.stringify(daySlots))}' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM delivery_settings LIMIT 1);`);
lines.push("");

lines.push("-- Done!");

const sql = lines.join("\n");
const fs = await import("fs");
fs.writeFileSync("meharbaan_database.sql", sql);
console.log(`✅ SQL file generated: meharbaan_database.sql (${sql.length} bytes, ${seedCategories.length} categories, ${seedProducts.length} products)`);
