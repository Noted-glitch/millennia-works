import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Testimonial } from "@/lib/types";

const COLLECTION = "testimonials";

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const q = query(collection(db, COLLECTION), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Testimonial[];
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const all = await getAllTestimonials();
  return all.filter((t) => t.featured);
}

export async function createTestimonial(testimonial: Omit<Testimonial, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...testimonial,
    createdAt: Timestamp.now().toMillis(),
    updatedAt: Timestamp.now().toMillis(),
  });
  return docRef.id;
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now().toMillis(),
  });
}

export async function deleteTestimonial(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
}
