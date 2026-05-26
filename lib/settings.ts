import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DEFAULT_SETTINGS } from "@/lib/settings-defaults";
import type { SiteSettings } from "@/lib/types";

export { DEFAULT_SETTINGS };

const SETTINGS_DOC_PATH = ["settings", "site"] as const;

export async function getSettings(): Promise<SiteSettings> {
  try {
    const snapshot = await getDoc(doc(db, ...SETTINGS_DOC_PATH));
    if (!snapshot.exists()) return DEFAULT_SETTINGS;
    const data = snapshot.data() as Partial<SiteSettings>;
    return {
      ...DEFAULT_SETTINGS,
      ...data,
      announcementBar: { ...DEFAULT_SETTINGS.announcementBar, ...(data.announcementBar || {}) },
      servicesEnabled: { ...DEFAULT_SETTINGS.servicesEnabled, ...(data.servicesEnabled || {}) },
      socialLinks: data.socialLinks ?? DEFAULT_SETTINGS.socialLinks,
    };
  } catch (err) {
    console.error("Failed to load settings, using defaults:", err);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(updates: Partial<SiteSettings>): Promise<void> {
  const docRef = doc(db, ...SETTINGS_DOC_PATH);
  await setDoc(
    docRef,
    {
      ...updates,
      updatedAt: Timestamp.now().toMillis(),
    },
    { merge: true }
  );
}
