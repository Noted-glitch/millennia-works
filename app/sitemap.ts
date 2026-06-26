import type { MetadataRoute } from "next";
import { getPublishedPostsServer } from "@/lib/server/blog";
import { getAllServicesServer } from "@/lib/server/services";
import { getAllProjectsServer } from "@/lib/server/portfolio";
import { slugify } from "@/lib/slug";

export const revalidate = 3600;

const BASE_URL = "https://millenniaworks.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, services, projects] = await Promise.all([
    getPublishedPostsServer(),
    getAllServicesServer(),
    getAllProjectsServer(),
  ]);

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/work`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : (p.publishedAt ? new Date(p.publishedAt) : now),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${BASE_URL}/${s.slug}`,
    lastModified: s.updatedAt ? new Date(s.updatedAt) : now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE_URL}/work/${p.slug || slugify(p.title)}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...postEntries, ...serviceEntries, ...projectEntries];
}
