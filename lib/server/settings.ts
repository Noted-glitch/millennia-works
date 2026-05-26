import { getAdminDb } from "@/lib/firebase-admin";
import { DEFAULT_SETTINGS } from "@/lib/settings-defaults";
import type { SiteSettings } from "@/lib/types";

export async function getSettingsServer(): Promise<SiteSettings> {
  const db = getAdminDb();
  if (!db) return DEFAULT_SETTINGS;
  try {
    const snapshot = await db.collection("settings").doc("site").get();
    if (!snapshot.exists) return DEFAULT_SETTINGS;
    const data = snapshot.data() as Partial<SiteSettings> | undefined;
    if (!data) return DEFAULT_SETTINGS;
    return {
      ...DEFAULT_SETTINGS,
      ...data,
      announcementBar: { ...DEFAULT_SETTINGS.announcementBar, ...(data.announcementBar || {}) },
      servicesEnabled: { ...DEFAULT_SETTINGS.servicesEnabled, ...(data.servicesEnabled || {}) },
      socialLinks: data.socialLinks ?? DEFAULT_SETTINGS.socialLinks,
    };
  } catch (err) {
    console.error("getSettingsServer failed —", err);
    return DEFAULT_SETTINGS;
  }
}
