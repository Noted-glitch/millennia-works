"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllProjects } from "@/lib/portfolio";
import { slugify } from "@/lib/slug";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import type { Project } from "@/lib/types";

export default function WorkIndex() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllProjects();
        setProjects(data);
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-navy text-pearl">
      <SiteNav activeLink="work" />

      {/* Header */}
      <section className="pt-32 pb-16 px-6 border-b border-gold/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-6 font-[family-name:var(--font-montserrat)]">Selected work</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-normal leading-tight mb-6">
            Work that speaks<br />
            <span className="text-gold italic">for itself.</span>
          </h1>
          <p className="text-champagne/80 text-base md:text-lg max-w-2xl mx-auto">
            A selection of brand, digital, and creative projects built for founders who mean business.
          </p>
        </motion.div>
      </section>

      {/* Grid */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] skeleton" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="border border-gold/20 p-12 text-center max-w-2xl mx-auto">
              <p className="text-champagne/70 mb-2">No projects yet.</p>
              <p className="text-taupe text-sm">Work is in production. Check back soon.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p, i) => (
                <motion.a
                  key={p.id}
                  href={`/work/${slugify(p.title)}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (i % 6) * 0.08 }}
                  className="group aspect-[4/5] bg-graphite border border-gold/10 relative overflow-hidden hover:border-gold/40 transition-colors block"
                >
                  {p.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-xs tracking-widest text-gold mb-2 font-[family-name:var(--font-montserrat)]">{p.category}</p>
                    <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-pearl mb-1 leading-tight">{p.title}</h2>
                    {p.client && (
                      <p className="text-taupe text-xs">{p.client}{p.year ? ` · ${p.year}` : ""}</p>
                    )}
                  </div>
                  {p.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="text-[10px] bg-gold text-navy px-2 py-1 tracking-widest uppercase font-[family-name:var(--font-montserrat)]">Featured</span>
                    </div>
                  )}
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
