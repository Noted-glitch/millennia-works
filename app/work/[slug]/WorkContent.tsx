"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllProjects } from "@/lib/portfolio";
import { slugify } from "@/lib/slug";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import type { Project } from "@/lib/types";

export function WorkContent({ slug }: { slug: string }) {
  const [project, setProject]   = useState<Project | null>(null);
  const [related, setRelated]   = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const all = await getAllProjects();
        const match = all.find((p) => slugify(p.title) === slug);
        if (!match) { setNotFound(true); return; }
        setProject(match);
        setRelated(all.filter((p) => p.id !== match.id && p.imageUrl).slice(0, 3));
      } catch (err) {
        console.error("Failed to load project:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  return (
    <main className="min-h-screen bg-navy text-pearl">
      <SiteNav activeLink="work" />

      {loading ? (
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="skeleton h-3 w-24 rounded" />
            <div className="skeleton h-14 w-3/4 rounded" />
            <div className="skeleton h-3 w-48 rounded" />
            <div className="aspect-[16/9] skeleton mt-8" />
            <div className="max-w-2xl mt-12 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`skeleton h-4 rounded ${i % 4 === 3 ? "w-2/3" : "w-full"}`} />
              ))}
            </div>
          </div>
        </div>
      ) : notFound || !project ? (
        <section className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="text-center max-w-md">
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-6 font-[family-name:var(--font-montserrat)]">Not found</p>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal mb-6">Project not found.</h1>
            <p className="text-champagne/70 mb-8">This project may have been moved or removed.</p>
            <a href="/#work" className="inline-block text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] border-b border-gold pb-1 hover:text-pearl hover:border-pearl transition-colors">← Back to work</a>
          </div>
        </section>
      ) : (
        <>
          {/* ── Hero ── */}
          <section className="pt-32 pb-0 px-6">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-10"
              >
                <p className="text-xs tracking-[0.4em] uppercase text-gold mb-5 font-[family-name:var(--font-montserrat)]">{project.category}</p>
                <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-normal leading-tight mb-6">
                  {project.title}
                </h1>
                <div className="flex items-center gap-3 text-taupe text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] flex-wrap">
                  {project.client && <span>{project.client}</span>}
                  {project.client && project.year && <span>·</span>}
                  {project.year && <span>{project.year}</span>}
                </div>
              </motion.div>

              {project.imageUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="aspect-[16/9] bg-graphite overflow-hidden border border-gold/10"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                </motion.div>
              )}
            </div>
          </section>

          {/* ── Content ── */}
          <section className="py-20 px-6">
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-16">

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="md:col-span-2"
              >
                <p className="text-xs tracking-[0.4em] uppercase text-gold mb-6 font-[family-name:var(--font-montserrat)]">About the project</p>
                <p className="text-champagne text-base md:text-lg leading-relaxed">{project.description}</p>

                {project.projectUrl && (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-10 text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] bg-gold text-navy px-7 py-3.5 rounded hover:bg-pearl transition-colors"
                  >
                    View live project ↗
                  </a>
                )}
              </motion.div>

              {/* Metadata sidebar */}
              <motion.aside
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-8 border-t md:border-t-0 md:border-l border-gold/10 pt-10 md:pt-0 md:pl-10"
              >
                {project.client && (
                  <div>
                    <p className="text-[10px] tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Client</p>
                    <p className="text-pearl text-sm">{project.client}</p>
                  </div>
                )}
                {project.year && (
                  <div>
                    <p className="text-[10px] tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Year</p>
                    <p className="text-pearl text-sm">{project.year}</p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Discipline</p>
                  <p className="text-pearl text-sm">{project.category}</p>
                </div>
              </motion.aside>
            </div>
          </section>

          {/* ── More work ── */}
          {related.length > 0 && (
            <section className="py-20 px-6 border-t border-gold/10">
              <div className="max-w-5xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="mb-10"
                >
                  <p className="text-xs tracking-[0.4em] uppercase text-gold mb-2 font-[family-name:var(--font-montserrat)]">More work</p>
                  <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-normal">Other projects.</h2>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                  {related.map((p, i) => (
                    <motion.a
                      key={p.id}
                      href={`/work/${slugify(p.title)}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      className="group aspect-[4/3] bg-graphite border border-gold/10 relative overflow-hidden hover:border-gold/40 transition-colors"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.imageUrl} alt={p.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <p className="text-[10px] tracking-widest text-gold mb-1 font-[family-name:var(--font-montserrat)]">{p.category}</p>
                        <h3 className="font-[family-name:var(--font-playfair)] text-lg text-pearl leading-tight">{p.title}</h3>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── CTA ── */}
          <section className="py-24 px-6 border-t border-gold/10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl mx-auto text-center"
            >
              <p className="text-xs tracking-[0.4em] uppercase text-gold mb-6 font-[family-name:var(--font-montserrat)]">Start a project</p>
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal mb-8 leading-tight">
                Want results<br /><span className="text-gold italic">like this?</span>
              </h2>
              <a
                href="/#contact"
                className="inline-flex text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] bg-gold text-navy px-8 py-4 rounded hover:bg-pearl transition-colors"
              >
                Let&apos;s talk
              </a>
            </motion.div>
          </section>
        </>
      )}

      <SiteFooter />
    </main>
  );
}
