"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getPublishedPosts } from "@/lib/blog";
import { useReveal } from "@/lib/motion";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import type { BlogPost } from "@/lib/types";

function formatDate(ms?: number) {
  if (!ms) return "";
  return new Date(ms).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function readingTime(content: string): number {
  return Math.max(1, Math.round(content.trim().split(/\s+/).length / 200));
}

export default function BlogIndex() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const reveal = useReveal();

  useEffect(() => {
    async function load() {
      try {
        const data = await getPublishedPosts();
        setPosts(data);
      } catch (err) {
        console.error("Failed to load posts:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-navy text-pearl">
      <SiteNav activeLink="blog" />

      <section className="pt-44 pb-26 md:pt-64 md:pb-42 px-6 border-b border-gold/10">
        <motion.div
          {...reveal.onMount()}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-xs tracking-[0.2em] uppercase text-gold mb-6 font-[family-name:var(--font-montserrat)]">Field notes</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-display font-normal mb-10">
            From the <span className="text-gold italic">studio.</span>
          </h1>
          <p className="text-champagne/80 text-[17px] md:text-[19px] leading-[1.7] max-w-[65ch] mx-auto">
            Thinking on brand, craft, and the work of building things that last.
          </p>
        </motion.div>
      </section>

      <section className="py-26 md:py-42 px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col border border-gold/10">
                  <div className="aspect-[16/10] skeleton" />
                  <div className="p-6 space-y-3">
                    <div className="skeleton h-2.5 w-20 rounded" />
                    <div className="skeleton h-7 w-4/5 rounded" />
                    <div className="space-y-2">
                      <div className="skeleton h-3 w-full rounded" />
                      <div className="skeleton h-3 w-5/6 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="border border-gold/20 p-12 text-center max-w-2xl mx-auto">
              <p className="text-champagne/70 mb-2">No posts yet.</p>
              <p className="text-taupe text-sm">The first essays are in the works. Check back soon.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((p, i) => (
                <motion.a
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  {...reveal.props(i)}
                  whileHover={reveal.cardHover()}
                  className="group flex flex-col border border-gold/10 hover:border-gold/40 transition-colors duration-[500ms]"
                >
                  {p.coverImageUrl ? (
                    <div className="aspect-[16/10] bg-graphite overflow-hidden">
                      <motion.div {...reveal.imageSettle()} className="w-full h-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.coverImageUrl} alt={p.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.03] transition-[transform,opacity] duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:group-hover:scale-100" />
                      </motion.div>
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-graphite" />
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-gold text-[10px] tracking-widest uppercase mb-3 font-[family-name:var(--font-montserrat)]">{p.category}</p>
                    <h2 className="font-[family-name:var(--font-playfair)] text-2xl mb-3 group-hover:text-gold transition-colors leading-tight">{p.title}</h2>
                    <p className="text-champagne/70 text-sm leading-relaxed mb-4 line-clamp-3">{p.excerpt}</p>
                    <div className="flex items-center gap-2 text-taupe text-[10px] tracking-widest uppercase font-[family-name:var(--font-montserrat)] mt-auto">
                      <span>{formatDate(p.publishedAt)}</span>
                      {p.content && <><span>·</span><span>{readingTime(p.content)} min read</span></>}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
