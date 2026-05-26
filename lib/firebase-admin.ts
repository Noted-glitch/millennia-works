import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let cachedApp: App | null = null;
let initAttempted = false;
let initError: string | null = null;

function initAdmin(): App | null {
  if (cachedApp) return cachedApp;
  if (initAttempted) return null;
  initAttempted = true;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

  const missing: string[] = [];
  if (!projectId) missing.push("FIREBASE_PROJECT_ID");
  if (!clientEmail) missing.push("FIREBASE_CLIENT_EMAIL");
  if (!rawPrivateKey) missing.push("FIREBASE_PRIVATE_KEY");
  if (missing.length > 0) {
    initError = `firebase-admin: missing env vars [${missing.join(", ")}]. Server-side metadata will fall back to defaults.`;
    console.warn(initError);
    return null;
  }

  const privateKey = rawPrivateKey!.replace(/\\n/g, "\n");

  try {
    const existing = getApps();
    cachedApp = existing.length > 0 ? existing[0] : initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
    return cachedApp;
  } catch (err) {
    initError = `firebase-admin: init failed — ${err instanceof Error ? err.message : String(err)}`;
    console.error(initError);
    return null;
  }
}

export function getAdminDb(): Firestore | null {
  const app = initAdmin();
  if (!app) return null;
  try {
    return getFirestore(app);
  } catch (err) {
    console.error("firebase-admin: getFirestore failed —", err);
    return null;
  }
}
