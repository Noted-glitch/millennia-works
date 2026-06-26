import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { slugify } from "@/lib/slug";
import type { Project } from "@/lib/types";

const COLLECTION = "projects";

export async function getAllProjects(): Promise<Project[]> {
  const q = query(collection(db, COLLECTION), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Project[];
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((p) => p.featured);
}

export async function createProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...project,
    createdAt: Timestamp.now().toMillis(),
    updatedAt: Timestamp.now().toMillis(),
  });
  return docRef.id;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now().toMillis(),
  });
}

export async function deleteProject(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Look up a project by its URL slug.
 * Checks the stored `slug` field first; falls back to matching
 * slugify(title) for projects created before the slug field existed.
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  // 1. Try stored slug field (O(1) indexed query).
  const q = query(collection(db, COLLECTION), where("slug", "==", slug), limit(1));
  const snap = await getDocs(q);
  if (!snap.empty) {
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as Project;
  }
  // 2. Fallback: scan for title-derived slug (for pre-existing projects).
  const all = await getAllProjects();
  return all.find((p) => slugify(p.title) === slug) ?? null;
}