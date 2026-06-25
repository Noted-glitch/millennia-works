import type { Metadata } from "next";
import { getPostBySlugServer } from "@/lib/server/blog";
import { getSettingsServer } from "@/lib/server/settings";
import { BlogPostContent } from "./BlogPostContent";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [post, settings] = await Promise.all([
    getPostBySlugServer(slug),
    getSettingsServer(),
  ]);

  if (!post) {
    return {
      title: `Post not found — ${settings.metaTitle}`,
      description: settings.metaDescription,
      robots: { index: false, follow: true },
    };
  }

  const ogImage = post.coverImageUrl || settings.ogImageUrl;
  const images = ogImage ? [{ url: ogImage }] : [];

  return {
    title: `${post.title} — Millennia Works`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `https://millenniaworks.com/blog/${post.slug}`,
      siteName: "Millennia Works",
      images,
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      authors: post.author ? [post.author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlugServer(slug);

  const jsonLd = post
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        ...(post.coverImageUrl && { image: post.coverImageUrl }),
        datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
        dateModified: post.updatedAt
          ? new Date(post.updatedAt).toISOString()
          : post.publishedAt
          ? new Date(post.publishedAt).toISOString()
          : undefined,
        author: {
          "@type": "Organization",
          name: post.author || "Millennia Works",
          url: "https://millenniaworks.com",
        },
        publisher: {
          "@type": "Organization",
          name: "Millennia Works",
          url: "https://millenniaworks.com",
          logo: {
            "@type": "ImageObject",
            url: "https://millenniaworks.com/brand/logo-icon-gold.png",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://millenniaworks.com/blog/${post.slug}`,
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <BlogPostContent slug={slug} />
    </>
  );
}
