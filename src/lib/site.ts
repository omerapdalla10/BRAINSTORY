import { getDb } from "@/lib/db/mongodb";
import { CONTACT_FALLBACK, siteKeys, type SiteSettings } from "@/lib/site-config";
import { localized, type Lang } from "@/lib/i18n";

const SITE_ID = "site";

/** The organization settings document, with every known key present (empty string when unset). */
export async function getSiteSettings(): Promise<SiteSettings> {
  const db = await getDb();
  const doc = await db.collection("site_settings").findOne({ _id: SITE_ID as never });
  const settings: SiteSettings = {};
  for (const key of siteKeys()) {
    settings[key] = String(doc?.[key] ?? "");
  }
  return settings;
}

export type ContactInfo = { email: string; phone: string; address: string };

export function getContact(settings: SiteSettings, lang: Lang): ContactInfo {
  return {
    email: settings.contact_email.trim() || CONTACT_FALLBACK.email,
    phone: settings.contact_phone.trim() || CONTACT_FALLBACK.phone,
    address: localized(settings, "contact_address", lang) || CONTACT_FALLBACK.address,
  };
}
