import { getAdminDb } from "@/lib/firebase-admin";
import type { Project } from "@/lib/types";

export async function getAllProjectsServer(): Promise<Project[]> {
  const db = getAdminDb();
  if (!db) return [];
  try {
    const snapshot = await db.collection("projects").orderBy("order", "asc").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Project[];
  } catch (err) {
    console.error("getAllProjectsServer failed —", err);
    return [];
  }
}
