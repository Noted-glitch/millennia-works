import { getAdminDb } from "@/lib/firebase-admin";
import type { BlogPost } from "@/lib/types";

export async function getPostBySlugServer(slug: string): Promise<BlogPost | null> {
  const db = getAdminDb();
  if (!db) return null;
  try {
    const snapshot = await db.collection("posts").where("slug", "==", slug).limit(1).get();
    if (snapshot.empty) return null;
    const docSnap = snapshot.docs[0];
    const post = { id: docSnap.id, ...docSnap.data() } as BlogPost;
    if (post.status === "draft") return null;
    return post;
  } catch (err) {
    console.error("getPostBySlugServer failed —", err);
    return null;
  }
}

export async function getPublishedPostsServer(): Promise<BlogPost[]> {
  const db = getAdminDb();
  if (!db) return [];
  try {
    const snapshot = await db.collection("posts").where("status", "==", "published").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as BlogPost[];
  } catch (err) {
    console.error("getPublishedPostsServer failed —", err);
    return [];
  }
}
