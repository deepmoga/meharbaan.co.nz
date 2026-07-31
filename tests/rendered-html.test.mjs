import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("includes the complete spreadsheet menu", async () => {
  const contents = await source("lib/excel-menu-data.ts");
  const json = contents
    .slice(contents.indexOf("= [") + 2)
    .replace(/;\s*$/, "");
  const rows = JSON.parse(json);

  assert.equal(rows.length, 172);
  assert.equal(new Set(rows.map((row) => row.category)).size, 17);
  assert.ok(rows.every((row) => row.name && Number.isFinite(row.price)));
});

test("uses compact three-column cards and a non-overlapping cart", async () => {
  const [menu, css] = await Promise.all([
    source("app/order-online/menu-client.tsx"),
    source("app/commerce.css"),
  ]);

  assert.doesNotMatch(menu, /online-product-image/);
  assert.match(css, /\.online-product-grid[\s\S]*repeat\(3,\s*minmax/);
  assert.match(css, /\.order-cart\s*\{[\s\S]*position:\s*sticky/);
  assert.match(
    css,
    /@media \(max-width: 1180px\)[\s\S]*\.order-cart\s*\{[\s\S]*position:\s*static/,
  );
});

test("includes About, Catering and Stripe administration", async () => {
  const [about, catering, admin] = await Promise.all([
    source("app/about-us/page.tsx"),
    source("app/catering-booking/page.tsx"),
    source("app/admin/admin-client.tsx"),
  ]);

  assert.match(about, /rich heritage of Indian/);
  assert.match(catering, /Reserve your catering/);
  assert.match(catering, /action="\/api\/catering"/);
  assert.match(admin, /Stripe Payment Settings/);
  assert.match(admin, /Webhook Signing Secret/);
});
