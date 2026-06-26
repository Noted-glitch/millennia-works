import type { Metadata } from "next";
import WorkIndex from "./WorkIndex";

export const metadata: Metadata = {
  title: "Portfolio — Millennia Works",
  description: "Brand, digital, and creative projects built for ambitious founders.",
  openGraph: {
    title: "Portfolio — Millennia Works",
    description: "Brand, digital, and creative projects built for ambitious founders.",
    type: "website",
    url: "https://millenniaworks.com/work",
    siteName: "Millennia Works",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio — Millennia Works",
    description: "Brand, digital, and creative projects built for ambitious founders.",
  },
};

export default function WorkPage() {
  return <WorkIndex />;
}
