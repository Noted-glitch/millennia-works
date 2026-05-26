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
import type { BlogPost } from "@/lib/types";

const COLLECTION = "posts";

export async function getAllPosts(): Promise<BlogPost[]> {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as BlogPost[];
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const q = query(collection(db, COLLECTION), where("status", "==", "published"));
  const snapshot = await getDocs(q);
  const posts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as BlogPost[];
  return posts.sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
}

export async function getPostBySlug(
  slug: string,
  options: { includeDrafts?: boolean } = {}
): Promise<BlogPost | null> {
  const q = query(collection(db, COLLECTION), where("slug", "==", slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const post = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as BlogPost;
  if (post.status === "draft" && !options.includeDrafts) return null;
  return post;
}

export async function createPost(
  post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const now = Timestamp.now().toMillis();
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...post,
    publishedAt: post.status === "published" ? (post.publishedAt || now) : null,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function updatePost(id: string, updates: Partial<BlogPost>, currentStatus?: BlogPost["status"], currentPublishedAt?: number): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  const patch: Partial<BlogPost> & { updatedAt: number; publishedAt?: number } = {
    ...updates,
    updatedAt: Timestamp.now().toMillis(),
  };
  if (updates.status === "published" && currentStatus !== "published" && !currentPublishedAt) {
    patch.publishedAt = Timestamp.now().toMillis();
  }
  await updateDoc(docRef, patch);
}

export async function deletePost(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
}
