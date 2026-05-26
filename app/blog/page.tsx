"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getPublishedPosts } from "@/lib/blog";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import type { BlogPost } from "@/lib/types";

function formatDate(ms?: number) {
  if (!ms) return "";
  return new Date(ms).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogIndex() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

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

      <section className="pt-32 pb-16 px-6 border-b border-gold/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-6 font-[family-name:var(--font-montserrat)]">Field notes</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-normal leading-tight mb-6">
            From the <span className="text-gold italic">studio.</span>
          </h1>
          <p className="text-champagne/80 text-base md:text-lg max-w-2xl mx-auto">
            Thinking on brand, craft, and the work of building things that last.
          </p>
        </motion.div>
      </section>

      <section className="py-16 md:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <p className="text-taupe text-sm text-center py-12">Loading posts...</p>
          ) : posts.length === 0 ? (
            <div className="border border-gold/20 p-12 text-center max-w-2xl mx-auto">
              <p className="text-champagne/70 mb-2">No posts yet.</p>
              <p className="text-taupe text-sm">The first essays are in the works. Check back soon.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((p, i) => (
                <motion.a
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group flex flex-col border border-gold/10 hover:border-gold/40 transition-colors"
                >
                  {p.coverImageUrl ? (
                    <div className="aspect-[16/10] bg-graphite overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.coverImageUrl} alt={p.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-graphite" />
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-gold text-[10px] tracking-widest uppercase mb-3 font-[family-name:var(--font-montserrat)]">{p.category}</p>
                    <h2 className="font-[family-name:var(--font-playfair)] text-2xl mb-3 group-hover:text-gold transition-colors leading-tight">{p.title}</h2>
                    <p className="text-champagne/70 text-sm leading-relaxed mb-4 line-clamp-3">{p.excerpt}</p>
                    <p className="text-taupe text-[10px] tracking-widest uppercase font-[family-name:var(--font-montserrat)] mt-auto">{formatDate(p.publishedAt)}</p>
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
