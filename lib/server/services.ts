import { getAdminDb } from "@/lib/firebase-admin";
import type { Service } from "@/lib/types";

export async function getServiceBySlugServer(slug: string): Promise<Service | null> {
  const db = getAdminDb();
  if (!db) return null;
  try {
    const snapshot = await db.collection("services").where("slug", "==", slug).limit(1).get();
    if (snapshot.empty) return null;
    const docSnap = snapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as Service;
  } catch (err) {
    console.error("getServiceBySlugServer failed —", err);
    return null;
  }
}
