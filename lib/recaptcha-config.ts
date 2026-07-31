import { readSiteSettings } from "@/lib/site-settings";

export const recaptchaSiteKey =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LcOAUctAAAAAGHVdQ_yd0__80tqIDVOAjSST5x8";

export async function getRecaptchaSiteKey() {
  try {
    const settings = await readSiteSettings();
    return settings.recaptcha?.siteKey || recaptchaSiteKey;
  } catch {
    return recaptchaSiteKey;
  }
}
