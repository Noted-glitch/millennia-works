"use client";

import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getPostBySlug } from "@/lib/blog";
import type { BlogPost } from "@/lib/types";

function formatDate(ms?: number) {
  if (!ms) return "";
  return new Date(ms).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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

  return (
    <main className="min-h-screen bg-navy text-pearl">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-navy/70 border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <a href="/" className="font-[family-name:var(--font-playfair)] text-xl tracking-wider text-gold">MW</a>
          <div className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] text-pearl/80">
            <a href="/" className="hover:text-gold transition-colors">Home</a>
            <a href="/blog" className="hover:text-gold transition-colors">Blog</a>
            <a href="/#contact" className="hover:text-gold transition-colors">Contact</a>
          </div>
          <a href="/#contact" className="text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] bg-gold text-navy px-5 py-2.5 rounded hover:bg-gold/90 transition-colors">Start a project</a>
        </div>
      </nav>

      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-taupe text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)]">Loading...</p>
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
              <div className="flex items-center justify-center gap-4 text-taupe text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)]">
                <span>{post.author}</span>
                {post.publishedAt && <><span>·</span><span>{formatDate(post.publishedAt)}</span></>}
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

      <footer className="py-12 px-6 border-t border-gold/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-[family-name:var(--font-playfair)] text-xl tracking-wider text-gold mb-1">Millennia Works</p>
            <p className="text-taupe text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)]">From Idea To Empire</p>
          </div>
          <p className="text-taupe text-xs">© {new Date().getFullYear()} Millennia Works. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
