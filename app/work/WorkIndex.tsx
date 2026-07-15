"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllProjects } from "@/lib/portfolio";
import { slugify } from "@/lib/slug";
import { useReveal } from "@/lib/motion";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import type { Project } from "@/lib/types";

export default function WorkIndex() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const reveal = useReveal();

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
      <section className="pt-44 pb-26 md:pt-64 md:pb-42 px-6 border-b border-gold/10">
        <motion.div
          {...reveal.onMount()}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-xs tracking-[0.2em] uppercase text-gold mb-6 font-[family-name:var(--font-montserrat)]">Selected work</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-display font-normal mb-10">
            Work that speaks<br />
            <span className="text-gold italic">for itself.</span>
          </h1>
          <p className="text-champagne/80 text-[17px] md:text-[19px] leading-[1.7] max-w-[65ch] mx-auto">
            A selection of brand, digital, and creative projects built for founders who mean business.
          </p>
        </motion.div>
      </section>

      {/* Full-bleed featured piece (design system §6.1) */}
      {!loading && projects.length > 0 && (
        <motion.a
          href={`/work/${projects[0].slug || slugify(projects[0].title)}`}
          {...reveal.onMount()}
          className="group relative block w-full h-[60vh] min-h-[380px] md:h-[72vh] overflow-hidden border-b border-gold/10"
        >
          {projects[0].imageUrl && (
            <motion.div {...reveal.imageSettle()} className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={projects[0].imageUrl}
                alt={projects[0].title}
                className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-[1.02] transition-[transform,opacity] duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:group-hover:scale-100"
              />
            </motion.div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-12 md:pb-16">
            <div className="max-w-7xl mx-auto">
              <p className="text-xs tracking-[0.2em] uppercase text-gold mb-3 font-[family-name:var(--font-montserrat)]">Featured · {projects[0].category}</p>
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl text-pearl leading-[1.05] mb-3 max-w-3xl">{projects[0].title}</h2>
              {projects[0].description && <p className="text-champagne/80 text-sm md:text-base max-w-xl line-clamp-1">{projects[0].description}</p>}
            </div>
          </div>
        </motion.a>
      )}

      {/* Grid */}
      <section className="py-26 md:py-42 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] skeleton" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="border border-gold/20 p-12 text-center max-w-2xl mx-auto">
              <p className="text-champagne/70 mb-2">No projects yet.</p>
              <p className="text-taupe text-sm">Work is in production. Check back soon.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(1).map((p, i) => (
                <motion.a
                  key={p.id}
                  href={`/work/${p.slug || slugify(p.title)}`}
                  {...reveal.props(i % 6)}
                  whileHover={reveal.cardHover()}
                  className="group aspect-[4/3] bg-graphite border border-gold/10 relative overflow-hidden hover:border-gold/40 transition-colors duration-[500ms] block"
                >
                  {p.imageUrl && (
                    <motion.div {...reveal.imageSettle()} className="absolute inset-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-[1.03] transition-[transform,opacity] duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:group-hover:scale-100"
                      />
                    </motion.div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <p className="text-xs tracking-[0.2em] uppercase text-gold mb-2 font-[family-name:var(--font-montserrat)]">{p.category}</p>
                    <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-pearl mb-1.5 leading-tight">{p.title}</h2>
                    {p.description && <p className="text-taupe text-sm leading-relaxed line-clamp-1">{p.description}</p>}
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
