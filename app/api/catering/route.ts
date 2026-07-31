import { NextResponse } from "next/server";
import { sendCateringEmail } from "@/lib/mail";
import { getRemoteIp, verifyRecaptcha } from "@/lib/recaptcha";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function redirectBack(request: Request, status: "sent" | "error", message = "") {
  const url = new URL("/catering-booking", request.url);
  url.searchParams.set(status === "sent" ? "sent" : "error", "1");
  if (message) url.searchParams.set("mailError", message);
  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const payload = {
    name: String(form.get("name") ?? "").trim(),
    address: String(form.get("address") ?? "").trim(),
    email: String(form.get("email") ?? "").trim(),
    phone: String(form.get("phone") ?? "").trim(),
    date: String(form.get("date") ?? "").trim(),
    service: String(form.get("service") ?? "").trim(),
    message: String(form.get("message") ?? "").trim(),
  };

  if (!payload.name || !payload.email || !payload.phone) {
    return redirectBack(request, "error", "Name, email and phone are required.");
  }

  const captcha = await verifyRecaptcha(
    String(form.get("g-recaptcha-response") ?? ""),
    getRemoteIp(request),
  );
  if (!captcha.ok) return redirectBack(request, "error", captcha.error);

  const mail = await sendCateringEmail(payload);
  if (!mail.ok) {
    console.error("Catering email failed", mail.error);
    return redirectBack(request, "error", mail.error);
  }

  return redirectBack(request, "sent");
}
