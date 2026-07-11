"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getServiceBySlug } from "@/lib/services";
import { getAllProjects } from "@/lib/portfolio";
import { slugify } from "@/lib/slug";
import { getAllTestimonials } from "@/lib/testimonials";
import { getPublishedPosts } from "@/lib/blog";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import type { Service, Project, Testimonial, BlogPost } from "@/lib/types";

function formatDate(ms?: number) {
  if (!ms) return "";
  return new Date(ms).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export function ServiceContent({ slug }: { slug: string }) {
  const [service, setService] = useState<Service | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const svc = await getServiceBySlug(slug);
        if (cancelled) return;
        if (!svc) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setService(svc);
        const [allProjects, allTestimonials, allPosts] = await Promise.all([
          getAllProjects(),
          getAllTestimonials(),
          getPublishedPosts(),
        ]);
        if (cancelled) return;
        setProjects(allProjects.filter((p) => p.category === svc.category).slice(0, 3));
        setTestimonials(allTestimonials.filter((t) => t.category === svc.category).slice(0, 2));
        setPosts(allPosts.filter((p) => p.category === svc.category).slice(0, 3));
      } catch (err) {
        console.error("Failed to load service page:", err);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [slug]);

  return (
    <main className="min-h-screen bg-navy text-pearl">
      <SiteNav activeLink="services" />

      {loading ? (
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            <div className="skeleton h-3 w-32 mx-auto rounded" />
            <div className="skeleton h-16 w-3/4 mx-auto rounded" />
            <div className="space-y-2 max-w-xl mx-auto">
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-5/6 rounded" />
            </div>
          </div>
        </div>
      ) : notFound || !service ? (
        <section className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="text-center max-w-md">
            <p className="text-xs tracking-[0.4em] uppercase text-accent mb-6 font-[family-name:var(--font-montserrat)]">Not found</p>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal mb-6">Service not found.</h1>
            <p className="text-champagne/70 mb-8">This service may have been moved or removed.</p>
            <a href="/#services" className="inline-block text-accent text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] border-b border-accent pb-1 hover:text-pearl hover:border-pearl transition-colors">← All services</a>
          </div>
        </section>
      ) : (
        <>
          <section className="pt-32 pb-16 px-6 border-b border-accent/10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <p className="text-xs tracking-[0.4em] uppercase text-accent mb-6 font-[family-name:var(--font-montserrat)]">{service.tag} · {service.category}</p>
              <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-normal leading-tight mb-8">{service.title}</h1>
              <p className="text-champagne/80 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">{service.longDescription}</p>
            </motion.div>
          </section>

          {service.coverImageUrl && (
            <section className="px-6 py-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="max-w-5xl mx-auto"
              >
                <div className="aspect-[16/9] bg-graphite overflow-hidden border border-accent/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={service.coverImageUrl} alt={service.title} className="w-full h-full object-cover" />
                </div>
              </motion.div>
            </section>
          )}

          {service.bullets.length > 0 && (
            <section className="py-20 px-6 border-t border-accent/10">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-12"
                >
                  <p className="text-xs tracking-[0.4em] uppercase text-accent mb-4 font-[family-name:var(--font-montserrat)]">What&apos;s included</p>
                  <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-normal">Inside this <span className="text-accent italic">engagement.</span></h2>
                </motion.div>
                <ul className="grid md:grid-cols-2 gap-x-8 gap-y-4 max-w-3xl mx-auto">
                  {service.bullets.map((b, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className="flex items-start gap-3 text-champagne text-base leading-relaxed"
                    >
                      <span className="text-accent text-sm mt-1.5 shrink-0">◆</span>
                      <span>{b}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section className="py-20 px-6 border-t border-accent/10">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-12"
                >
                  <p className="text-xs tracking-[0.4em] uppercase text-accent mb-4 font-[family-name:var(--font-montserrat)]">Selected work</p>
                  <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-normal">In this <span className="text-accent italic">discipline.</span></h2>
                </motion.div>
                <div className="grid md:grid-cols-3 gap-6">
                  {projects.map((p, i) => {
                    const card = (
                      <div className="aspect-[4/5] bg-graphite border border-accent/10 relative overflow-hidden hover:border-accent/40 transition-colors cursor-pointer group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <p className="text-xs tracking-widest text-accent mb-2 font-[family-name:var(--font-montserrat)]">{p.category}</p>
                          <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-pearl mb-1">{p.title}</h3>
                          {p.client && <p className="text-taupe text-xs">{p.client} · {p.year}</p>}
                        </div>
                      </div>
                    );
                    return (
                      <motion.a
                        key={p.id}
                        href={`/work/${p.slug || slugify(p.title)}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.15 }}
                      >
                        {card}
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {testimonials.length > 0 && (
            <section className="py-20 px-6 border-t border-accent/10 bg-graphite/30">
              <div className="max-w-5xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-12"
                >
                  <p className="text-xs tracking-[0.4em] uppercase text-accent mb-4 font-[family-name:var(--font-montserrat)]">In their words</p>
                  <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-normal">Trusted by <span className="text-accent italic">founders.</span></h2>
                </motion.div>
                <div className="grid md:grid-cols-2 gap-8">
                  {testimonials.map((t, i) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.15 }}
                      className="relative bg-graphite/20 border border-accent/20 p-8 md:p-10 overflow-hidden"
                    >
                      <span className="absolute top-4 right-6 text-accent/10 font-[family-name:var(--font-playfair)] leading-none select-none pointer-events-none" style={{ fontSize: "8rem" }}>&ldquo;</span>
                      <div className="relative">
                        <p className="text-champagne text-base md:text-lg leading-relaxed italic font-[family-name:var(--font-playfair)] mb-8">{t.quote}</p>
                        <div className="border-t border-accent/20 pt-5">
                          <p className="text-pearl text-sm font-medium">{t.clientName}</p>
                          <p className="text-taupe text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] mt-1">{t.role}{t.role && t.company && " · "}{t.company}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {posts.length > 0 && (
            <section className="py-20 px-6 border-t border-accent/10">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-12"
                >
                  <p className="text-xs tracking-[0.4em] uppercase text-accent mb-4 font-[family-name:var(--font-montserrat)]">Field notes</p>
                  <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-normal">Further <span className="text-accent italic">reading.</span></h2>
                </motion.div>
                <div className="grid md:grid-cols-3 gap-8">
                  {posts.map((p, i) => (
                    <motion.a
                      key={p.id}
                      href={`/blog/${p.slug}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      className="group flex flex-col border border-accent/10 hover:border-accent/40 transition-colors"
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
                        <h3 className="font-[family-name:var(--font-playfair)] text-xl mb-3 group-hover:text-accent transition-colors leading-tight">{p.title}</h3>
                        <p className="text-champagne/70 text-sm leading-relaxed mb-4 line-clamp-3">{p.excerpt}</p>
                        <p className="text-taupe text-[10px] tracking-widest uppercase font-[family-name:var(--font-montserrat)] mt-auto">{formatDate(p.publishedAt)}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="py-24 px-6 border-t border-accent/10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center"
            >
              <p className="text-xs tracking-[0.4em] uppercase text-accent mb-6 font-[family-name:var(--font-montserrat)]">Let&apos;s build</p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-normal mb-8 leading-tight">
                Ready for <span className="text-accent italic">{service.title.toLowerCase()}?</span>
              </h2>
              <a href="/#contact" className="inline-block bg-accent text-navy text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-10 py-4 rounded hover:bg-pearl transition-colors">Start a project</a>
            </motion.div>
          </section>
        </>
      )}

      <SiteFooter />
    </main>
  );
}
