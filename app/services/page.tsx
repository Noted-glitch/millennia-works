import type { Metadata } from "next";
import ServicesIndex from "./ServicesIndex";

export const metadata: Metadata = {
  title: "Services — Millennia Works",
  description: "Brand, AI media, publishing, web, marketing, apps, and 3D — every discipline under one studio.",
  openGraph: {
    title: "Services — Millennia Works",
    description: "Brand, AI media, publishing, web, marketing, apps, and 3D — every discipline under one studio.",
    type: "website",
    url: "https://millenniaworks.com/services",
    siteName: "Millennia Works",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services — Millennia Works",
    description: "Brand, AI media, publishing, web, marketing, apps, and 3D — every discipline under one studio.",
  },
};

export default function ServicesPage() {
  return <ServicesIndex />;
}
