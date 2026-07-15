"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getServiceBySlug } from "@/lib/services";
import { getAllProjects } from "@/lib/portfolio";
import { slugify } from "@/lib/slug";
import { getAllTestimonials } from "@/lib/testimonials";
import { getPublishedPosts } from "@/lib/blog";
import { useReveal } from "@/lib/motion";
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
  const reveal = useReveal();

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
        <div className="pt-44 md:pt-64 pb-26 md:pb-42 px-6">
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
            <p className="text-xs tracking-[0.2em] uppercase text-accent mb-6 font-[family-name:var(--font-montserrat)]">Not found</p>
            <h1 className="font-[family-name:var(--font-playfair)] text-display font-normal mb-6">Service not found.</h1>
            <p className="text-champagne/70 mb-8">This service may have been moved or removed.</p>
            <a href="/services" className="link-underline inline-block text-accent text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] hover:text-pearl transition-colors">← All services</a>
          </div>
        </section>
      ) : (
        <>
          <section className="pt-44 pb-26 md:pt-64 md:pb-42 px-6 border-b border-accent/10">
            <motion.div
              {...reveal.onMount()}
              className="max-w-4xl mx-auto text-center"
            >
              <p className="text-xs tracking-[0.2em] uppercase text-accent mb-6 font-[family-name:var(--font-montserrat)]">{service.tag} · {service.category}</p>
              <h1 className="font-[family-name:var(--font-playfair)] text-display font-normal mb-10">{service.title}</h1>
              <p className="text-champagne/80 text-[17px] md:text-[19px] max-w-[65ch] mx-auto leading-[1.7]">{service.longDescription}</p>
            </motion.div>
          </section>

          {service.coverImageUrl && (
            <section className="px-6 py-16 md:py-26">
              <div className="max-w-5xl mx-auto">
                <motion.div {...reveal.mountImage()} className="aspect-[16/9] bg-graphite overflow-hidden border border-accent/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={service.coverImageUrl} alt={service.title} className="w-full h-full object-cover" />
                </motion.div>
              </div>
            </section>
          )}

          {service.bullets.length > 0 && (
            <section className="py-26 md:py-42 px-6 border-t border-accent/10">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  {...reveal.props()}
                  className="text-center mb-16"
                >
                  <p className="text-xs tracking-[0.2em] uppercase text-accent mb-6 font-[family-name:var(--font-montserrat)]">What&apos;s included</p>
                  <h2 className="font-[family-name:var(--font-playfair)] text-display font-normal">Inside this <span className="text-accent italic">engagement.</span></h2>
                </motion.div>
                <ul className="grid md:grid-cols-2 gap-x-8 gap-y-4 max-w-3xl mx-auto">
                  {service.bullets.map((b, i) => (
                    <motion.li
                      key={i}
                      {...reveal.props(i)}
                      className="flex items-start gap-3 text-champagne text-base leading-relaxed"
                    >
                      <span aria-hidden="true" className="w-4 h-px bg-accent/60 mt-3 shrink-0" />
                      <span>{b}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section className="py-26 md:py-42 px-6 border-t border-accent/10">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  {...reveal.props()}
                  className="text-center mb-16"
                >
                  <p className="text-xs tracking-[0.2em] uppercase text-accent mb-6 font-[family-name:var(--font-montserrat)]">Selected work</p>
                  <h2 className="font-[family-name:var(--font-playfair)] text-display font-normal">In this <span className="text-accent italic">discipline.</span></h2>
                </motion.div>
                <div className="grid md:grid-cols-3 gap-6">
                  {projects.map((p, i) => {
                    const card = (
                      <div className="aspect-[4/3] bg-graphite border border-accent/10 relative overflow-hidden hover:border-accent/40 transition-colors duration-[500ms] cursor-pointer group">
                        {p.imageUrl && (
                          <motion.div {...reveal.imageSettle()} className="absolute inset-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-[1.03] transition-[transform,opacity] duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:group-hover:scale-100" />
                          </motion.div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                          <p className="text-xs tracking-[0.2em] uppercase text-accent mb-2 font-[family-name:var(--font-montserrat)]">{p.category}</p>
                          <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-pearl mb-1.5 leading-tight">{p.title}</h3>
                          {p.description && <p className="text-taupe text-sm leading-relaxed line-clamp-1">{p.description}</p>}
                        </div>
                      </div>
                    );
                    return (
                      <motion.a
                        key={p.id}
                        href={`/work/${p.slug || slugify(p.title)}`}
                        {...reveal.props(i)}
                        whileHover={reveal.cardHover()}
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
            <section className="py-26 md:py-42 px-6 border-t border-accent/10 bg-graphite/30">
              <div className="max-w-5xl mx-auto">
                <motion.div
                  {...reveal.props()}
                  className="text-center mb-16"
                >
                  <p className="text-xs tracking-[0.2em] uppercase text-accent mb-6 font-[family-name:var(--font-montserrat)]">In their words</p>
                  <h2 className="font-[family-name:var(--font-playfair)] text-display font-normal">Trusted by <span className="text-accent italic">founders.</span></h2>
                </motion.div>
                <div className="grid md:grid-cols-2 gap-10">
                  {testimonials.map((t, i) => (
                    <motion.div
                      key={t.id}
                      {...reveal.props(i)}
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
            <section className="py-26 md:py-42 px-6 border-t border-accent/10">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  {...reveal.props()}
                  className="text-center mb-16"
                >
                  <p className="text-xs tracking-[0.2em] uppercase text-accent mb-6 font-[family-name:var(--font-montserrat)]">Field notes</p>
                  <h2 className="font-[family-name:var(--font-playfair)] text-display font-normal">Further <span className="text-accent italic">reading.</span></h2>
                </motion.div>
                <div className="grid md:grid-cols-3 gap-10">
                  {posts.map((p, i) => (
                    <motion.a
                      key={p.id}
                      href={`/blog/${p.slug}`}
                      {...reveal.props(i)}
                      whileHover={reveal.cardHover()}
                      className="group flex flex-col border border-accent/10 hover:border-accent/40 transition-colors duration-[500ms]"
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

          <section className="py-26 md:py-42 px-6 border-t border-accent/10">
            <motion.div
              {...reveal.props()}
              className="max-w-3xl mx-auto text-center"
            >
              <p className="text-xs tracking-[0.2em] uppercase text-accent mb-6 font-[family-name:var(--font-montserrat)]">Let&apos;s build</p>
              <h2 className="font-[family-name:var(--font-playfair)] text-display font-normal mb-10">
                Ready for <span className="text-accent italic">{service.title.toLowerCase()}?</span>
              </h2>
              <a href="/#contact" className="btn btn-primary">Start a project</a>
            </motion.div>
          </section>
        </>
      )}

      <SiteFooter />
    </main>
  );
}
