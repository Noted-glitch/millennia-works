import type { Metadata } from "next";
import { getAllProjectsServer } from "@/lib/server/portfolio";
import { getSettingsServer } from "@/lib/server/settings";
import { slugify } from "@/lib/slug";
import { WorkContent } from "./WorkContent";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [projects, settings] = await Promise.all([
    getAllProjectsServer(),
    getSettingsServer(),
  ]);

  const project = projects.find((p) => slugify(p.title) === slug);

  if (!project) {
    return {
      title: `Project not found — ${settings.metaTitle}`,
      robots: { index: false, follow: true },
    };
  }

  const ogImage = project.imageUrl || settings.ogImageUrl;
  const images = ogImage ? [{ url: ogImage }] : [];
  const description = project.description || settings.metaDescription;

  return {
    title: `${project.title} — Millennia Works`,
    description,
    openGraph: {
      title: project.title,
      description,
      type: "website",
      url: `https://millenniaworks.com/work/${slug}`,
      siteName: "Millennia Works",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
      images,
    },
  };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <WorkContent slug={slug} />;
}
