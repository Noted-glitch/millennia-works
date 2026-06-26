import { getAdminDb } from "@/lib/firebase-admin";
import { slugify } from "@/lib/slug";
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

/**
 * Server-side slug lookup — stored slug first, then title fallback.
 */
export async function getProjectBySlugServer(slug: string): Promise<Project | null> {
  const db = getAdminDb();
  if (!db) return null;
  try {
    // 1. Stored slug field.
    const snap = await db.collection("projects").where("slug", "==", slug).limit(1).get();
    if (!snap.empty) {
      return { id: snap.docs[0].id, ...snap.docs[0].data() } as Project;
    }
    // 2. Title-derived fallback for legacy projects.
    const all = await getAllProjectsServer();
    return all.find((p) => slugify(p.title) === slug) ?? null;
  } catch (err) {
    console.error("getProjectBySlugServer failed —", err);
    return null;
  }
}
