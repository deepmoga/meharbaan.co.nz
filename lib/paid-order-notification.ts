import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getDb } from "@/lib/db";
import { sendOrderEmails, type MailResult } from "@/lib/mail";
import type { CartItem, CheckoutDetails } from "@/lib/menu-types";

type OrderSnapshot = {
  details?: CheckoutDetails;
  items?: CartItem[];
};

type OrderRow = RowDataPacket & {
  mode: "delivery" | "pickup";
  customer_name: string;
  phone: string;
  address: string;
  zipcode: string;
  suburb: string | null;
  delivery_time: string | null;
  notes: string | null;
  items: unknown;
  order_snapshot: unknown;
};

function parseJson<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "string") return JSON.parse(value) as T;
  return value as T;
}

function claimKey(orderId: string) {
  return `stripe_order_mail_${orderId}`;
}

/**
 * Sends the paid Stripe order email once. Both Stripe's webhook and the success
 * page call this, so the database claim prevents duplicate messages.
 */
export async function sendPaidOrderEmailsOnce(
  orderId: string,
): Promise<MailResult & { skipped?: boolean }> {
  const connection = await getDb();
  const key = claimKey(orderId);
  let claimed = false;

  try {
    const [claim] = await connection.execute<ResultSetHeader>(
      `INSERT IGNORE INTO app_settings (setting_key, setting_value)
       VALUES (?, JSON_OBJECT('state', 'sending'))`,
      [key],
    );
    claimed = claim.affectedRows === 1;
    if (!claimed) return { ok: true, skipped: true };

    const [rows] = await connection.execute<OrderRow[]>(
      `SELECT mode, customer_name, phone, address, zipcode, suburb,
              delivery_time, notes, items, order_snapshot
       FROM orders WHERE id = ? LIMIT 1`,
      [orderId],
    );
    const row = rows[0];
    if (!row) {
      await connection.execute("DELETE FROM app_settings WHERE setting_key = ?", [key]);
      return { ok: false, error: "Paid order could not be found." };
    }

    const snapshot = parseJson<OrderSnapshot>(row.order_snapshot, {});
    const details: CheckoutDetails = snapshot.details ?? {
      mode: row.mode,
      name: row.customer_name,
      phone: row.phone,
      address: row.address,
      zipcode: row.zipcode,
      suburb: row.suburb ?? "",
      time: row.delivery_time ?? "",
      notes: row.notes ?? "",
    };
    const items = snapshot.items ?? parseJson<CartItem[]>(row.items, []);

    await connection.execute("UPDATE orders SET status = 'paid' WHERE id = ?", [orderId]);
    const mail = await sendOrderEmails({ orderId, details, items });
    if (!mail.ok) {
      await connection.execute("DELETE FROM app_settings WHERE setting_key = ?", [key]);
      return mail;
    }

    await connection.execute(
      `UPDATE app_settings
       SET setting_value = JSON_OBJECT('state', 'sent', 'sentAt', UTC_TIMESTAMP())
       WHERE setting_key = ?`,
      [key],
    );
    return mail;
  } catch (error) {
    if (claimed) {
      await connection.execute("DELETE FROM app_settings WHERE setting_key = ?", [key]).catch(() => undefined);
    }
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Paid order email failed.",
    };
  } finally {
    await connection.end();
  }
}
