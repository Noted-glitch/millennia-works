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
import type { Inquiry } from "@/lib/types";

const COLLECTION = "inquiries";

export async function getAllInquiries(): Promise<Inquiry[]> {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Inquiry[];
}

export async function submitInquiry(
  data: Pick<Inquiry, "name" | "email" | "message"> & Partial<Pick<Inquiry, "company" | "projectType">>
): Promise<string> {
  const now = Timestamp.now().toMillis();
  const docRef = await addDoc(collection(db, COLLECTION), {
    name: data.name,
    email: data.email,
    message: data.message,
    company: data.company || "",
    projectType: data.projectType || "",
    status: "new",
    notes: "",
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function updateInquiry(id: string, updates: Partial<Inquiry>): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now().toMillis(),
  });
}

export async function deleteInquiry(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
}
