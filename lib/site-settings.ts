import { readFile } from "node:fs/promises";
import path from "node:path";
import { query } from "@/lib/db";

export type SiteSettings = {
  branding: {
    siteName: string;
    logo: string;
    footerLogo: string;
    favicon: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    facebook: string;
    instagram: string;
  };
  mail: {
    enabled: boolean;
    host: string;
    port: number;
    secure: boolean;
    username: string;
    password: string;
    passwordEnvKey?: string;
    fromEmail: string;
    adminEmail: string;
  };
  stripe: {
    enabled: boolean;
    mode: "live" | "test";
    publishableKey: string;
    secretKey: string;
    testPublishableKey: string;
    testSecretKey: string;
    webhookSecret: string;
    currency: string;
  };
  recaptcha: {
    siteKey: string;
    secretKey: string;
  };
  restaurant: {
    open: boolean;
  };
  admin: {
    email: string;
    passwordHash: string;
  };
};

const dataDirectory = path.join(process.cwd(), "data");
const settingsFile = path.join(dataDirectory, "site-settings.json");

function normalizeSettings(settings: SiteSettings): SiteSettings {
  const gmailStartTls =
    settings.mail.host?.toLowerCase().includes("gmail.com") &&
    settings.mail.port === 465;
  return {
    ...settings,
    mail: {
      ...settings.mail,
      port: gmailStartTls ? 587 : settings.mail.port,
      secure: gmailStartTls ? false : settings.mail.secure,
      password: settings.mail.password || settings.mail.passwordEnvKey || "",
      passwordEnvKey: undefined
    },
    stripe: {
      enabled: settings.stripe?.enabled ?? false,
      mode: settings.stripe?.mode ?? "live",
      publishableKey: settings.stripe?.publishableKey ?? "",
      secretKey: settings.stripe?.secretKey ?? "",
      testPublishableKey: settings.stripe?.testPublishableKey ?? "",
      testSecretKey: settings.stripe?.testSecretKey ?? "",
      webhookSecret: settings.stripe?.webhookSecret ?? "",
      currency: settings.stripe?.currency?.toLowerCase() || "nzd"
    },
    recaptcha: {
      siteKey: (settings as any).recaptcha?.siteKey ?? "",
      secretKey: (settings as any).recaptcha?.secretKey ?? "",
    },
    restaurant: {
      open: (settings as any).restaurant?.open !== false,
    }
  };
}

export async function readSiteSettings(): Promise<SiteSettings> {
  const rows = await query<{ setting_value: string }>(
    "SELECT setting_value FROM app_settings WHERE setting_key = 'site' LIMIT 1"
  ).catch(async () => []);

  if (rows[0]?.setting_value) {
    const value = rows[0].setting_value;
    return normalizeSettings(
      (typeof value === "string" ? JSON.parse(value) : value) as SiteSettings
    );
  }

  const contents = await readFile(settingsFile, "utf8");
  return normalizeSettings(JSON.parse(contents) as SiteSettings);
}

export async function writeSiteSettings(settings: SiteSettings) {
  await query(
    `INSERT INTO app_settings (setting_key, setting_value)
     VALUES ('site', ?)
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
    [JSON.stringify(settings)]
  );
}
