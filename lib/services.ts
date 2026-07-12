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
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { slugify } from "@/lib/slug";
import type { Service } from "@/lib/types";

const COLLECTION = "services";

export async function getAllServices(): Promise<Service[]> {
  const q = query(collection(db, COLLECTION), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Service[];
}

export async function getFeaturedServices(): Promise<Service[]> {
  const all = await getAllServices();
  return all.filter((s) => s.featured);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const q = query(collection(db, COLLECTION), where("slug", "==", slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Service;
}

export async function createService(service: Omit<Service, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const now = Timestamp.now().toMillis();
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...service,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function updateService(id: string, updates: Partial<Service>): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now().toMillis(),
  });
}

export async function deleteService(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
}

const DEFAULT_SERVICES: Omit<Service, "id" | "createdAt" | "updatedAt">[] = [
  {
    title: "Brand & Creative",
    category: "Brand & Creative",
    tag: "01",
    shortDescription: "Identity, design, and the visual language that makes a brand recognizable.",
    longDescription: "We craft brand identities that don't just look good — they earn trust on sight. From the typographic system to the smallest interaction detail, every choice reinforces the same promise.",
    bullets: [],
    order: 0,
    featured: true,
    slug: "brand-creative",
  },
  {
    title: "AI Content & Media",
    category: "AI Content & Media",
    tag: "02",
    shortDescription: "AI-generated personas, imagery, and media, built for consistency and scale.",
    longDescription: "Cinematic-grade content at a fraction of the traditional cost and timeline. We pair AI tooling with human direction to produce media that converts.",
    bullets: [],
    order: 1,
    featured: true,
    slug: "ai-content-media",
  },
  {
    title: "Publishing & Books",
    category: "Publishing & Books",
    tag: "03",
    shortDescription: "Cover design, interior layout, and full production for print and digital.",
    longDescription: "From manuscript to bestseller list. Full-service publishing for authors who treat their book like a product, not a hobby.",
    bullets: [],
    order: 2,
    featured: true,
    slug: "publishing-books",
  },
  {
    title: "Web & App Development",
    category: "Web & App Development",
    tag: "04",
    shortDescription: "Sites and applications built to perform and to last.",
    longDescription: "We build software you own — no platform lock-in, no monthly per-seat tax. Built on modern stacks, optimized for speed, designed to scale with your business.",
    bullets: [],
    order: 3,
    featured: true,
    slug: "web-app-development",
  },
  {
    title: "Digital Marketing",
    category: "Digital Marketing",
    tag: "05",
    shortDescription: "Reaching the right audience and turning attention into growth.",
    longDescription: "Marketing that pulls its weight. We build acquisition systems that compound — not one-off campaigns that fizzle.",
    bullets: [],
    order: 4,
    featured: true,
    slug: "digital-marketing",
  },
  {
    title: "Apps & Games",
    category: "Apps & Games",
    tag: "06",
    shortDescription: "Interactive products from concept to launch.",
    longDescription: "End-to-end app and game development. We ship to the App Store, Google Play, and the web — handling the messy parts so you can focus on what makes your product different.",
    bullets: [],
    order: 5,
    featured: true,
    slug: "apps-games",
  },
  {
    title: "3D & Motion",
    category: "3D & Motion",
    tag: "07",
    shortDescription: "3D design, animation, and motion graphics that bring a brand to life.",
    longDescription: "From product renders and 3D scenes to animated logos and motion graphics — visuals with depth and movement, built to hold attention across every screen.",
    bullets: [],
    order: 6,
    featured: true,
    slug: "3d-motion",
  },
];

export async function seedDefaultServices(): Promise<number> {
  const existing = await getDocs(query(collection(db, COLLECTION), limit(1)));
  if (!existing.empty) return 0;
  const now = Timestamp.now().toMillis();
  const batch = writeBatch(db);
  for (const service of DEFAULT_SERVICES) {
    const ref = doc(collection(db, COLLECTION));
    batch.set(ref, { ...service, slug: service.slug || slugify(service.title), createdAt: now, updatedAt: now });
  }
  await batch.commit();
  return DEFAULT_SERVICES.length;
}
