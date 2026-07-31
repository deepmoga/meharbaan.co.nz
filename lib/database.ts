import mysql, {
  type Pool,
  type PoolConnection,
  type RowDataPacket,
} from "mysql2/promise";
import type {
  AdminOrder,
  CartItem,
  CheckoutDetails,
  MenuCategory,
  MenuProduct,
  MenuStore,
  RestaurantSettings,
  SizeOption,
} from "./menu-types";
import { seedCategories, seedProducts, seedSettings } from "./seed-data";

const databaseName = process.env.DB_NAME || "meharbaan";
if (!/^[a-zA-Z0-9_]+$/.test(databaseName)) {
  throw new Error("DB_NAME may contain only letters, numbers and underscores.");
}

const baseConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD ?? "",
};

const globalMysql = globalThis as unknown as {
  meharbaanPool?: Pool;
  meharbaanReady?: Promise<Pool>;
};

async function createReadyPool() {
  const setupConnection = await mysql.createConnection(baseConfig);
  try {
    await setupConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${databaseName}\`
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
  } finally {
    await setupConnection.end();
  }

  const pool = mysql.createPool({
    ...baseConfig,
    database: databaseName,
    waitForConnections: true,
    connectionLimit: 8,
    queueLimit: 0,
    charset: "utf8mb4",
  });
  await initializeSchema(pool);
  return pool;
}

async function database(): Promise<Pool> {
  if (!globalMysql.meharbaanReady) {
    globalMysql.meharbaanReady = createReadyPool().catch((error) => {
      globalMysql.meharbaanReady = undefined;
      throw error;
    });
  }
  const pool = await globalMysql.meharbaanReady;
  globalMysql.meharbaanPool = pool;
  return pool;
}

async function initializeSchema(pool: Pool) {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS menu_categories (
      id VARCHAR(128) PRIMARY KEY,
      name VARCHAR(191) NOT NULL,
      sort_order INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  );
  await pool.query(
    `CREATE TABLE IF NOT EXISTS menu_products (
      id VARCHAR(191) PRIMARY KEY,
      category_id VARCHAR(128) NOT NULL,
      name VARCHAR(191) NOT NULL,
      description TEXT NOT NULL,
      price DECIMAL(10,2) NOT NULL DEFAULT 0,
      image VARCHAR(500) NOT NULL DEFAULT '/butter-chicken.webp',
      size_options JSON NOT NULL,
      spice_options JSON NOT NULL,
      active TINYINT(1) NOT NULL DEFAULT 1,
      INDEX menu_products_category_idx (category_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  );
  await pool.query(
    `CREATE TABLE IF NOT EXISTS restaurant_settings (
      setting_key VARCHAR(128) PRIMARY KEY,
      setting_value JSON NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  );
  await pool.query(
    `CREATE TABLE IF NOT EXISTS customer_orders (
      id VARCHAR(64) PRIMARY KEY,
      status VARCHAR(32) NOT NULL DEFAULT 'new',
      created_at DATETIME(3) NOT NULL,
      customer_name VARCHAR(191) NOT NULL,
      phone VARCHAR(64) NOT NULL,
      email VARCHAR(191) NOT NULL DEFAULT '',
      mode VARCHAR(32) NOT NULL,
      address VARCHAR(500) NOT NULL DEFAULT '',
      suburb VARCHAR(191) NOT NULL DEFAULT '',
      pickup_time VARCHAR(32) NOT NULL DEFAULT '',
      notes TEXT NOT NULL,
      items JSON NOT NULL,
      total DECIMAL(10,2) NOT NULL DEFAULT 0,
      INDEX customer_orders_created_idx (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  );

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS count FROM menu_categories",
  );
  if (!Number(rows[0]?.count ?? 0)) {
    await seedDatabase(pool);
  }
}

async function seedDatabase(pool: Pool) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    for (const category of seedCategories) {
      await connection.execute(
        `INSERT IGNORE INTO menu_categories (id, name, sort_order)
         VALUES (?, ?, ?)`,
        [category.id, category.name, category.sortOrder],
      );
    }
    for (const product of seedProducts) {
      await insertProduct(connection, product);
    }
    await connection.execute(
      `INSERT IGNORE INTO restaurant_settings (setting_key, setting_value)
       VALUES ('site', ?)`,
      [JSON.stringify(seedSettings)],
    );
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function insertProduct(
  connection: PoolConnection,
  product: MenuProduct,
) {
  await connection.execute(
    `INSERT IGNORE INTO menu_products
    (id, category_id, name, description, price, image, size_options, spice_options, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      product.id,
      product.categoryId,
      product.name,
      product.description,
      product.price,
      product.image,
      JSON.stringify(product.sizeOptions),
      JSON.stringify(product.spiceOptions),
      product.active ? 1 : 0,
    ],
  );
}

type CategoryRow = RowDataPacket & {
  id: string;
  name: string;
  sort_order: number;
};

type ProductRow = RowDataPacket & {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: string | number;
  image: string;
  size_options: string | SizeOption[];
  spice_options: string | string[];
  active: number;
};

function parseJsonArray<T>(value: string | T[]): T[] {
  if (Array.isArray(value)) return value;
  return JSON.parse(value) as T[];
}

export async function readSettings(): Promise<RestaurantSettings> {
  const pool = await database();
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT setting_value FROM restaurant_settings WHERE setting_key = 'site' LIMIT 1",
  );
  const value = rows[0]?.setting_value as string | RestaurantSettings | undefined;
  if (!value) return seedSettings;
  return typeof value === "string"
    ? (JSON.parse(value) as RestaurantSettings)
    : value;
}

export async function writeSettings(settings: RestaurantSettings) {
  const pool = await database();
  await pool.execute(
    `INSERT INTO restaurant_settings (setting_key, setting_value)
     VALUES ('site', ?)
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
    [JSON.stringify(settings)],
  );
}

export async function readMenu(): Promise<MenuStore> {
  const pool = await database();
  const [categoryRows, productRows, settings] = await Promise.all([
    pool.execute<CategoryRow[]>(
      "SELECT id, name, sort_order FROM menu_categories ORDER BY sort_order, name",
    ),
    pool.execute<ProductRow[]>(
      `SELECT id, category_id, name, description, price, image,
       size_options, spice_options, active
       FROM menu_products ORDER BY category_id, name`,
    ),
    readSettings(),
  ]);

  const categories = categoryRows[0].map((row) => ({
    id: row.id,
    name: row.name,
    sortOrder: row.sort_order,
  }));
  const products = productRows[0].map((row) => ({
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    image: row.image,
    sizeOptions: parseJsonArray<SizeOption>(row.size_options),
    spiceOptions: parseJsonArray<string>(row.spice_options),
    active: Boolean(row.active),
  }));

  return {
    categories,
    products,
    suburbs: settings.suburbs,
    timeSlots: settings.timeSlots,
    orderOptions: {
      delivery: settings.delivery,
      pickup: settings.pickup,
    },
  };
}

export async function replaceMenu(
  categories: MenuCategory[],
  products: MenuProduct[],
) {
  const pool = await database();
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query("DELETE FROM menu_products");
    await connection.query("DELETE FROM menu_categories");
    for (const category of categories) {
      await connection.execute(
        "INSERT INTO menu_categories (id, name, sort_order) VALUES (?, ?, ?)",
        [category.id, category.name, category.sortOrder],
      );
    }
    for (const product of products) {
      await connection.execute(
        `INSERT INTO menu_products
        (id, category_id, name, description, price, image, size_options, spice_options, active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.id,
          product.categoryId,
          product.name,
          product.description,
          product.price,
          product.image,
          JSON.stringify(product.sizeOptions ?? []),
          JSON.stringify(product.spiceOptions ?? []),
          product.active ? 1 : 0,
        ],
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function createOrder(
  details: CheckoutDetails,
  items: CartItem[],
) {
  const pool = await database();
  const id = `MB${Date.now().toString(36).toUpperCase()}`;
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const createdAt = new Date();
  await pool.execute(
    `INSERT INTO customer_orders
    (id, status, created_at, customer_name, phone, email, mode, address, suburb, pickup_time, notes, items, total)
    VALUES (?, 'new', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      createdAt,
      details.name,
      details.phone,
      details.email ?? "",
      details.mode,
      details.address ?? "",
      details.suburb ?? "",
      details.time,
      details.notes ?? "",
      JSON.stringify(items),
      total,
    ],
  );
  return { id, total, createdAt: createdAt.toISOString() };
}

type OrderRow = RowDataPacket & {
  id: string;
  status: string;
  created_at: Date | string;
  customer_name: string;
  phone: string;
  email: string;
  mode: "delivery" | "pickup";
  address: string;
  suburb: string;
  pickup_time: string;
  notes: string;
  items: string | CartItem[];
  total: string | number;
};

export async function readOrders(): Promise<AdminOrder[]> {
  const pool = await database();
  const [rows] = await pool.execute<OrderRow[]>(
    `SELECT id, status, created_at, customer_name, phone, email, mode,
     address, suburb, pickup_time, notes, items, total
     FROM customer_orders ORDER BY created_at DESC`,
  );
  return rows.map((row) => ({
    id: row.id,
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
    details: {
      mode: row.mode,
      name: row.customer_name,
      phone: row.phone,
      email: row.email,
      address: row.address,
      suburb: row.suburb,
      time: row.pickup_time,
      notes: row.notes,
    },
    items:
      typeof row.items === "string"
        ? (JSON.parse(row.items) as CartItem[])
        : row.items,
    total: Number(row.total),
  }));
}

export async function updateOrderStatus(id: string, status: string) {
  const pool = await database();
  await pool.execute(
    "UPDATE customer_orders SET status = ? WHERE id = ?",
    [status, id],
  );
}

export async function databaseHealth() {
  const pool = await database();
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT DATABASE() AS database_name, VERSION() AS version",
  );
  return {
    database: String(rows[0]?.database_name ?? ""),
    version: String(rows[0]?.version ?? ""),
  };
}
