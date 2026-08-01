import nodemailer from "nodemailer";
import type { CartItem, CheckoutDetails } from "@/lib/menu-types";
import { readSiteSettings, type SiteSettings } from "@/lib/site-settings";

export type MailResult = {
  ok: boolean;
  messageId?: string;
  error?: string;
};

function money(value: number) {
  return `$${value.toFixed(2)}`;
}

function orderTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function shortOrderId(orderId: string) {
  return orderId.slice(0, 8).toUpperCase();
}

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatMailError(error: unknown) {
  if (!(error instanceof Error)) {
    return String(error);
  }

  const details = error as Error & {
    code?: string;
    command?: string;
    response?: string;
    responseCode?: number;
  };
  const parts = [error.message];
  if (details.code) parts.push(`code: ${details.code}`);
  if (details.command) parts.push(`command: ${details.command}`);
  if (details.responseCode) parts.push(`responseCode: ${details.responseCode}`);
  if (details.response) parts.push(`response: ${details.response}`);
  if (details.code === "EACCES") {
    parts.push(
      "The server blocked this SMTP connection. Use port 587 with Secure set to No, then confirm outbound SMTP is allowed by the host.",
    );
  }
  return parts.join(" | ");
}

function normalizeSmtpPassword(password: string, host: string) {
  if (host.toLowerCase().includes("gmail.com")) {
    return password.replace(/\s+/g, "");
  }
  return password;
}

function getPassword(settings: SiteSettings) {
  if (!settings.mail.enabled) {
    throw new Error("Email is disabled in Mail Settings.");
  }

  const localSmtp = ["127.0.0.1", "localhost", "::1"].includes(
    settings.mail.host.toLowerCase(),
  );
  if (localSmtp) return "";

  const password = settings.mail.password?.trim();
  if (!password) {
    throw new Error("SMTP app password is missing. Add the Gmail app password in Admin > Settings.");
  }

  return normalizeSmtpPassword(password, settings.mail.host);
}

function createTransport(settings: SiteSettings) {
  const password = getPassword(settings);
  const normalizedHost = settings.mail.host.toLowerCase();
  const gmail = normalizedHost.includes("gmail.com");
  const localSmtp = ["127.0.0.1", "localhost", "::1"].includes(normalizedHost);

  // Gmail on port 587 → STARTTLS (secure must be false)
  // Gmail on port 465 → SSL (secure must be true)
  // For non-Gmail, respect the user's Secure setting
  let port = settings.mail.port;
  let secure = settings.mail.secure;
  if (gmail) {
    if (port === 465) {
      secure = true; // SSL
    } else {
      port = 587;    // force STARTTLS port
      secure = false; // STARTTLS requires secure=false
    }
  }

  return nodemailer.createTransport({
    host: settings.mail.host,
    port,
    secure,
    requireTLS: !secure && !localSmtp,
    ignoreTLS: localSmtp,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
    auth:
      settings.mail.username && password
        ? {
            user: settings.mail.username,
            pass: password,
          }
        : undefined,
  });
}

function senderAddress(settings: SiteSettings) {
  return settings.mail.username || settings.mail.fromEmail;
}

function fromHeader(settings: SiteSettings) {
  return `"${settings.branding.siteName}" <${senderAddress(settings)}>`;
}

function renderOrderRows(items: CartItem[]) {
  return items
    .map((item) => {
      const options = [item.size?.name, item.spice].filter(Boolean).join(", ");
      return `<tr>
        <td style="padding:8px;border-bottom:1px solid #ddd">${item.name}${options ? `<br><small>${options}</small>` : ""}</td>
        <td style="padding:8px;border-bottom:1px solid #ddd">${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #ddd">${money(item.price)}</td>
        <td style="padding:8px;border-bottom:1px solid #ddd">${money(item.price * item.quantity)}</td>
      </tr>`;
    })
    .join("");
}

function renderOrderText({
  orderId,
  details,
  items,
  total
}: {
  orderId: string;
  details: CheckoutDetails;
  items: CartItem[];
  total: number;
}) {
  const itemLines = items
    .map((item) => {
      const options = [item.size?.name, item.spice].filter(Boolean).join(", ");
      return `- ${item.quantity} x ${item.name}${options ? ` (${options})` : ""}: ${money(item.price * item.quantity)}`;
    })
    .join("\n");

  return [
    `New ${details.mode} order #${shortOrderId(orderId)}`,
    `Order ID: ${orderId}`,
    `Time: ${details.time || "Not selected"}`,
    `Customer: ${details.name}`,
    `Phone: ${details.phone}`,
    `Address: ${[details.address, details.suburb, details.zipcode].filter(Boolean).join(", ")}`,
    details.notes ? `Notes: ${details.notes}` : "",
    "",
    itemLines,
    "",
    `Total: ${money(total)}`
  ]
    .filter((line) => line !== "")
    .join("\n");
}

export async function sendOrderEmails({
  orderId,
  details,
  items
}: {
  orderId: string;
  details: CheckoutDetails;
  items: CartItem[];
}): Promise<MailResult> {
  const settings = await readSiteSettings();

  const total = orderTotal(items);
  const adminHtml = `
    <div style="font-family:Arial,sans-serif;color:#14251d">
      <h2>New Meharbaan Indian Cuisine Order</h2>
      <p><strong>Order:</strong> ${orderId}</p>
      <p><strong>Type:</strong> ${details.mode}</p>
      <p><strong>Time:</strong> ${details.time || "Not selected"}</p>
      <p><strong>Customer:</strong> ${details.name}<br>
      <strong>Phone:</strong> ${details.phone}<br>
      <strong>Address:</strong> ${details.address}, ${details.zipcode}<br>
      <strong>Suburb:</strong> ${details.suburb || ""}</p>
      <table style="border-collapse:collapse;width:100%;max-width:700px">
        <thead>
          <tr>
            <th align="left" style="padding:8px;border-bottom:2px solid #085a34">Item</th>
            <th align="left" style="padding:8px;border-bottom:2px solid #085a34">Qty</th>
            <th align="left" style="padding:8px;border-bottom:2px solid #085a34">Price</th>
            <th align="left" style="padding:8px;border-bottom:2px solid #085a34">Total</th>
          </tr>
        </thead>
        <tbody>${renderOrderRows(items)}</tbody>
      </table>
      <h3>Total: ${money(total)}</h3>
      ${details.notes ? `<p><strong>Notes:</strong> ${details.notes}</p>` : ""}
    </div>`;

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;color:#14251d;max-width:600px">
      <h2 style="color:#c99836">Thank you for your order, ${escapeHtml(details.name)}!</h2>
      <p>We've received your order and the Meharbaan kitchen is on it.</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Type:</strong> ${details.mode}</p>
      <p><strong>Time:</strong> ${details.time || "Not selected"}</p>
      <table style="border-collapse:collapse;width:100%;max-width:600px">
        <thead>
          <tr>
            <th align="left" style="padding:8px;border-bottom:2px solid #c99836">Item</th>
            <th align="left" style="padding:8px;border-bottom:2px solid #c99836">Qty</th>
            <th align="left" style="padding:8px;border-bottom:2px solid #c99836">Price</th>
            <th align="left" style="padding:8px;border-bottom:2px solid #c99836">Total</th>
          </tr>
        </thead>
        <tbody>${renderOrderRows(items)}</tbody>
      </table>
      <h3>Total: ${money(total)}</h3>
      ${details.notes ? `<p><strong>Your notes:</strong> ${escapeHtml(details.notes)}</p>` : ""}
      <p style="margin-top:24px;color:#72717a">Questions? Call us or reply to this email. We look forward to serving you!</p>
    </div>`;

  const transport = createTransport(settings);

  try {
    // Send to admin
    const info = await transport.sendMail({
      from: fromHeader(settings),
      sender: senderAddress(settings),
      envelope: {
        from: senderAddress(settings),
        to: settings.mail.adminEmail
      },
      to: settings.mail.adminEmail,
      replyTo:
        settings.mail.fromEmail && settings.mail.fromEmail !== senderAddress(settings)
          ? settings.mail.fromEmail
          : undefined,
      subject: `${settings.branding.siteName}: New ${details.mode} order #${shortOrderId(orderId)} (${money(total)})`,
      text: renderOrderText({ orderId, details, items, total }),
      html: adminHtml,
      headers: {
        "X-Entity-Ref-ID": orderId
      }
    });

    // Send confirmation to customer if they provided an email
    if (details.email) {
      try {
        await transport.sendMail({
          from: fromHeader(settings),
          sender: senderAddress(settings),
          envelope: {
            from: senderAddress(settings),
            to: details.email
          },
          to: details.email,
          replyTo: settings.mail.adminEmail || undefined,
          subject: `Your Meharbaan order #${shortOrderId(orderId)} is confirmed!`,
          html: customerHtml
        });
      } catch (customerError) {
        console.error("Customer confirmation email failed", customerError);
      }
    }

    return { ok: true, messageId: info.messageId };
  } catch (error) {
    return { ok: false, error: formatMailError(error) };
  }
}

export async function sendReservationEmail({
  name,
  phone,
  email,
  date,
  time,
  people,
  message
}: {
  name: string;
  phone: string;
  email?: string;
  date?: string;
  time?: string;
  people?: string;
  message?: string;
}): Promise<MailResult> {
  const settings = await readSiteSettings();

  const html = `
    <div style="font-family:Arial,sans-serif;color:#14251d">
      <h2>New Meharbaan Indian Cuisine Enquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      ${email ? `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` : ""}
      ${date ? `<p><strong>Date:</strong> ${escapeHtml(date)}</p>` : ""}
      ${time ? `<p><strong>Time:</strong> ${escapeHtml(time)}</p>` : ""}
      ${people ? `<p><strong>Person(s):</strong> ${escapeHtml(people)}</p>` : ""}
      ${message ? `<p><strong>Message:</strong><br>${escapeHtml(message)}</p>` : ""}
    </div>`;

  try {
    const info = await createTransport(settings).sendMail({
      from: fromHeader(settings),
      sender: senderAddress(settings),
      envelope: {
        from: senderAddress(settings),
        to: settings.mail.adminEmail
      },
      to: settings.mail.adminEmail,
      replyTo: email || undefined,
      subject: `New enquiry from ${name}`,
      html
    });
    return { ok: true, messageId: info.messageId };
  } catch (error) {
    return { ok: false, error: formatMailError(error) };
  }
}

export async function sendCateringEmail({
  name,
  address,
  phone,
  email,
  date,
  service,
  message,
}: {
  name: string;
  address?: string;
  phone: string;
  email: string;
  date?: string;
  service?: string;
  message?: string;
}): Promise<MailResult> {
  const settings = await readSiteSettings();
  const html = `
    <div style="font-family:Arial,sans-serif;color:#14251d">
      <h2>New Meharbaan Catering Enquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${address ? `<p><strong>Address:</strong> ${escapeHtml(address)}</p>` : ""}
      ${date ? `<p><strong>Event date:</strong> ${escapeHtml(date)}</p>` : ""}
      ${service ? `<p><strong>Service:</strong> ${escapeHtml(service)}</p>` : ""}
      ${message ? `<p><strong>Message:</strong><br>${escapeHtml(message)}</p>` : ""}
    </div>`;

  try {
    const info = await createTransport(settings).sendMail({
      from: fromHeader(settings),
      sender: senderAddress(settings),
      envelope: {
        from: senderAddress(settings),
        to: settings.mail.adminEmail,
      },
      to: settings.mail.adminEmail,
      replyTo: email,
      subject: `Catering enquiry from ${name}${date ? ` for ${date}` : ""}`,
      html,
    });
    return { ok: true, messageId: info.messageId };
  } catch (error) {
    return { ok: false, error: formatMailError(error) };
  }
}

export async function sendTestEmail(): Promise<MailResult> {
  const settings = await readSiteSettings();
  const html = `
    <div style="font-family:Arial,sans-serif;color:#14251d">
      <h2>Meharbaan Indian Cuisine Test Email</h2>
      <p>This confirms your website SMTP settings can send email.</p>
      <p><strong>Host:</strong> ${escapeHtml(settings.mail.host)}</p>
      <p><strong>From:</strong> ${escapeHtml(settings.mail.fromEmail)}</p>
      <p><strong>To:</strong> ${escapeHtml(settings.mail.adminEmail)}</p>
    </div>`;

  try {
    const transporter = createTransport(settings);
    await transporter.verify();
    const info = await transporter.sendMail({
      from: fromHeader(settings),
      sender: senderAddress(settings),
      envelope: {
        from: senderAddress(settings),
        to: settings.mail.adminEmail
      },
      to: settings.mail.adminEmail,
      subject: "Meharbaan Indian Cuisine test email",
      html
    });
    return { ok: true, messageId: info.messageId };
  } catch (error) {
    return { ok: false, error: formatMailError(error) };
  }
}
