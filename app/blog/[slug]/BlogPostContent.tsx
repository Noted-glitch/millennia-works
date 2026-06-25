"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getPostBySlug } from "@/lib/blog";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import type { BlogPost } from "@/lib/types";

function formatDate(ms?: number) {
  if (!ms) return "";
  return new Date(ms).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function BlogPostContent({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        const result = await getPostBySlug(slug, { includeDrafts: !!user });
        if (cancelled) return;
        if (!result) {
          setNotFound(true);
        } else {
          setPost(result);
        }
      } catch (err) {
        console.error("Failed to load post:", err);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [slug]);

  useEffect(() => {
    function handleScroll() {
      const el = document.documentElement;
      const progress = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setScrollProgress(Math.min(1, Math.max(0, progress)));
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-navy text-pearl">
      <SiteNav activeLink="blog" />

      {/* Reading progress bar — fixed just below the nav */}
      {!loading && post && (
        <div className="fixed top-[80px] left-0 right-0 z-40 h-px bg-gold/10">
          <div
            className="h-full bg-gold"
            style={{ width: `${scrollProgress * 100}%`, transition: "width 0.1s linear" }}
          />
        </div>
      )}

      {loading ? (
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-3xl mx-auto text-center mb-14 space-y-5">
            <div className="skeleton h-3 w-20 mx-auto rounded" />
            <div className="skeleton h-12 w-3/4 mx-auto rounded" />
            <div className="skeleton h-3 w-56 mx-auto rounded" />
          </div>
          <div className="max-w-5xl mx-auto mb-16">
            <div className="aspect-[16/9] skeleton" />
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className={`skeleton h-4 rounded ${i % 5 === 4 ? "w-2/3" : "w-full"}`} />
            ))}
          </div>
        </div>
      ) : notFound || !post ? (
        <section className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="text-center max-w-md">
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-6 font-[family-name:var(--font-montserrat)]">Not found</p>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal mb-6">Post not found.</h1>
            <p className="text-champagne/70 mb-8">This post may have been moved or unpublished.</p>
            <a href="/blog" className="inline-block text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] border-b border-gold pb-1 hover:text-pearl hover:border-pearl transition-colors">← Back to all posts</a>
          </div>
        </section>
      ) : (
        <>
          {post.status === "draft" && (
            <div className="bg-gold/10 border-b border-gold/30 px-6 py-3 mt-20 text-center">
              <p className="text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)]">Draft preview · only visible to signed-in admin</p>
            </div>
          )}

          <article className={`px-6 ${post.status === "draft" ? "pt-12" : "pt-32"} pb-20`}>
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center mb-12"
            >
              <p className="text-xs tracking-[0.4em] uppercase text-gold mb-6 font-[family-name:var(--font-montserrat)]">{post.category}</p>
              <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-normal leading-tight mb-8">{post.title}</h1>
              <div className="flex items-center justify-center gap-3 text-taupe text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] flex-wrap">
                <span>{post.author}</span>
                {post.publishedAt && <><span>·</span><span>{formatDate(post.publishedAt)}</span></>}
                <span>·</span>
                <span>{readingTime(post.content)} min read</span>
              </div>
            </motion.header>

            {post.coverImageUrl && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="max-w-5xl mx-auto mb-16"
              >
                <div className="aspect-[16/9] bg-graphite overflow-hidden border border-gold/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" />
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <div className="prose-content text-champagne text-base md:text-lg leading-relaxed">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-pearl mt-12 mb-6 leading-tight">{children}</h1>,
                    h2: ({ children }) => <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-pearl mt-10 mb-5 leading-tight">{children}</h2>,
                    h3: ({ children }) => <h3 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl text-pearl mt-8 mb-4 leading-tight">{children}</h3>,
                    p: ({ children }) => <p className="mb-6">{children}</p>,
                    a: ({ href, children }) => <a href={href} className="text-gold underline decoration-gold/40 hover:decoration-gold transition-colors">{children}</a>,
                    ul: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>,
                    li: ({ children }) => <li className="pl-1">{children}</li>,
                    blockquote: ({ children }) => <blockquote className="border-l-2 border-gold/40 pl-6 italic text-champagne/90 font-[family-name:var(--font-playfair)] my-8">{children}</blockquote>,
                    code: ({ children }) => <code className="bg-graphite text-gold px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
                    pre: ({ children }) => <pre className="bg-graphite border border-gold/10 p-4 rounded overflow-x-auto mb-6 text-sm">{children}</pre>,
                    hr: () => <hr className="border-gold/20 my-12" />,
                    strong: ({ children }) => <strong className="text-pearl font-medium">{children}</strong>,
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              <div className="mt-16 pt-8 border-t border-gold/10 text-center">
                <a href="/blog" className="inline-block text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] border-b border-gold pb-1 hover:text-pearl hover:border-pearl transition-colors">← Back to all posts</a>
              </div>
            </motion.div>
          </article>
        </>
      )}

      <SiteFooter />
    </main>
  );
}
