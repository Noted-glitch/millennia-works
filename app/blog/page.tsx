import type { Metadata } from "next";
import BlogIndex from "./BlogIndex";

export const metadata: Metadata = {
  title: "Studio Notes — Millennia Works",
  description: "Thinking on brand, craft, and the work of building things that last.",
  openGraph: {
    title: "Studio Notes — Millennia Works",
    description: "Thinking on brand, craft, and the work of building things that last.",
    type: "website",
    url: "https://millenniaworks.com/blog",
    siteName: "Millennia Works",
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Notes — Millennia Works",
    description: "Thinking on brand, craft, and the work of building things that last.",
  },
};

export default function BlogPage() {
  return <BlogIndex />;
}
