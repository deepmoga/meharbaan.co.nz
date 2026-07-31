import mysql, {
  type Connection,
  type RowDataPacket,
} from "mysql2/promise";
import { seedCategories, seedProducts, seedSettings } from "@/lib/seed-data";

export type SqlValue = string | number | boolean | Date | null;

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

export const dbConfig = {
  ...baseConfig,
  database: databaseName,
  multipleStatements: false,
};

const globalDatabase = globalThis as unknown as {
  meharbaanSchemaReady?: Promise<void>;
};

async function tableCount(connection: Connection, table: string) {
  const [rows] = await connection.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS count FROM \`${table}\``,
  );
  return Number(rows[0]?.count ?? 0);
}

async function initializeDatabase() {
  const setup = await mysql.createConnection(baseConfig);
  try {
    await setup.query(
      `CREATE DATABASE IF NOT EXISTS \`${databaseName}\`
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
  } finally {
    await setup.end();
  }

  const connection = await mysql.createConnection(dbConfig);
  try {
    await connection.query(
      `CREATE TABLE IF NOT EXISTS menu_categories (
        id VARCHAR(128) PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        sort_order INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    );
    await connection.query(
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
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX menu_products_category_idx (category_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    );

    const [activeColumn] = await connection.query<RowDataPacket[]>(
      "SHOW COLUMNS FROM menu_products LIKE 'active'",
    );
    if (!activeColumn.length) {
      await connection.query(
        "ALTER TABLE menu_products ADD COLUMN active TINYINT(1) NOT NULL DEFAULT 1",
      );
    }
    const [isActiveColumn] = await connection.query<RowDataPacket[]>(
      "SHOW COLUMNS FROM menu_products LIKE 'is_active'",
    );
    if (!isActiveColumn.length) {
      await connection.query(
        "ALTER TABLE menu_products ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1",
      );
    }
    await connection.query(
      "UPDATE menu_products SET is_active = active WHERE is_active <> active",
    );

    await connection.query(
      `CREATE TABLE IF NOT EXISTS app_settings (
        setting_key VARCHAR(80) PRIMARY KEY,
        setting_value JSON NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    );
    await connection.query(
      `CREATE TABLE IF NOT EXISTS delivery_settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        suburbs JSON NOT NULL,
        time_slots JSON NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    );
    await connection.query(
      `CREATE TABLE IF NOT EXISTS orders (
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    );

    const menuCatalogVersion = "excel-2026-07-29";
    const [catalogRows] = await connection.query<RowDataPacket[]>(
      `SELECT JSON_UNQUOTE(setting_value) AS version
       FROM app_settings WHERE setting_key = 'menu_catalog_version' LIMIT 1`,
    );
    if (
      !(await tableCount(connection, "menu_categories")) ||
      String(catalogRows[0]?.version ?? "") !== menuCatalogVersion
    ) {
      await connection.beginTransaction();
      try {
        await connection.query("DELETE FROM menu_products");
        await connection.query("DELETE FROM menu_categories");
        for (const category of seedCategories) {
          await connection.execute(
            "INSERT INTO menu_categories (id, name, sort_order) VALUES (?, ?, ?)",
            [category.id, category.name, category.sortOrder],
          );
        }
        for (const product of seedProducts) {
          await connection.execute(
            `INSERT INTO menu_products
              (id, category_id, name, description, price, image, size_options,
               spice_options, active, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
              product.active ? 1 : 0,
            ],
          );
        }
        await connection.execute(
          `INSERT INTO app_settings (setting_key, setting_value)
           VALUES ('menu_catalog_version', ?)
           ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
          [JSON.stringify(menuCatalogVersion)],
        );
        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      }
    }

    if (!(await tableCount(connection, "delivery_settings"))) {
      const daySlots = Object.fromEntries(
        [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].map((day) => [day, seedSettings.timeSlots]),
      );
      await connection.execute(
        "INSERT INTO delivery_settings (suburbs, time_slots) VALUES (?, ?)",
        [JSON.stringify(seedSettings.suburbs), JSON.stringify(daySlots)],
      );
    }

    await connection.execute(
      `INSERT INTO app_settings (setting_key, setting_value)
       VALUES ('order_options', ?)
       ON DUPLICATE KEY UPDATE setting_key = setting_key`,
      [
        JSON.stringify({
          delivery: seedSettings.delivery,
          pickup: seedSettings.pickup,
        }),
      ],
    );
  } finally {
    await connection.end();
  }
}

async function ensureDatabase() {
  if (!globalDatabase.meharbaanSchemaReady) {
    globalDatabase.meharbaanSchemaReady = initializeDatabase().catch((error) => {
      globalDatabase.meharbaanSchemaReady = undefined;
      throw error;
    });
  }
  await globalDatabase.meharbaanSchemaReady;
}

export async function getDb() {
  await ensureDatabase();
  return mysql.createConnection(dbConfig);
}

export async function query<T>(sql: string, params: SqlValue[] = []) {
  const connection = await getDb();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows as T[];
  } finally {
    await connection.end();
  }
}
