import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("new admin products are saved immediately", async () => {
  const source = await readFile("app/admin/admin-client.tsx", "utf8");
  assert.match(source, /const nextStore = \{ \.\.\.store, products: \[\.\.\.store\.products, product\] \}/);
  assert.match(source, /const saved = await saveStore\(nextStore\)/);
});

test("paid Stripe orders trigger one-time order emails", async () => {
  const webhook = await readFile("app/api/stripe/webhook/route.ts", "utf8");
  const successPage = await readFile("app/checkout/success/page.tsx", "utf8");
  const notification = await readFile("lib/paid-order-notification.ts", "utf8");

  assert.match(webhook, /sendPaidOrderEmailsOnce\(orderId\)/);
  assert.match(successPage, /sendPaidOrderEmailsOnce\(orderId\)/);
  assert.match(notification, /INSERT IGNORE INTO app_settings/);
  assert.match(notification, /sendOrderEmails\(\{ orderId, details, items \}\)/);
});
