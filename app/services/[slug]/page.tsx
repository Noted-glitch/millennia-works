import type { Metadata } from "next";
import { getServiceBySlugServer } from "@/lib/server/services";
import { getSettingsServer } from "@/lib/server/settings";
import { ServiceContent } from "./ServiceContent";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [service, settings] = await Promise.all([
    getServiceBySlugServer(slug),
    getSettingsServer(),
  ]);

  if (!service) {
    return {
      title: `Service not found — ${settings.metaTitle}`,
      description: settings.metaDescription,
      robots: { index: false, follow: true },
    };
  }

  const ogImage = service.coverImageUrl || settings.ogImageUrl;
  const images = ogImage ? [{ url: ogImage }] : [];

  return {
    title: `${service.title} — Millennia Works`,
    description: service.longDescription,
    openGraph: {
      title: service.title,
      description: service.longDescription,
      type: "website",
      url: `https://millenniaworks.com/services/${service.slug}`,
      siteName: "Millennia Works",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: service.title,
      description: service.longDescription,
      images,
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ServiceContent slug={slug} />;
}
