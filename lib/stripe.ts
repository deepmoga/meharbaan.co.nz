import { createHmac, timingSafeEqual } from "node:crypto";

export type StripeCheckoutSession = {
  id: string;
  url?: string | null;
  payment_status?: "paid" | "unpaid" | "no_payment_required";
  metadata?: Record<string, string>;
};

type StripeErrorResponse = {
  error?: {
    message?: string;
  };
};

export async function stripeRequest<T>(
  secretKey: string,
  path: string,
  init?: RequestInit,
) {
  const response = await fetch(`https://api.stripe.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      ...(init?.body
        ? { "Content-Type": "application/x-www-form-urlencoded" }
        : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });

  const data = (await response.json()) as T & StripeErrorResponse;
  if (!response.ok) {
    throw new Error(data.error?.message || `Stripe returned ${response.status}.`);
  }
  return data as T;
}

export function verifyStripeSignature(
  payload: string,
  signatureHeader: string,
  webhookSecret: string,
) {
  const values = signatureHeader.split(",").map((part) => part.trim());
  const timestamp = values
    .find((part) => part.startsWith("t="))
    ?.slice(2);
  const signatures = values
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.slice(3));

  if (!timestamp || !signatures.length) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

  const expected = createHmac("sha256", webhookSecret)
    .update(`${timestamp}.${payload}`)
    .digest();

  return signatures.some((signature) => {
    try {
      const supplied = Buffer.from(signature, "hex");
      return (
        supplied.length === expected.length &&
        timingSafeEqual(supplied, expected)
      );
    } catch {
      return false;
    }
  });
}
