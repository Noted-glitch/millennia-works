"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getFeaturedProjects } from "@/lib/portfolio";
import { getFeaturedTestimonials } from "@/lib/testimonials";
import { getFeaturedServices } from "@/lib/services";
import { submitInquiry } from "@/lib/inquiries";
import { useSettings } from "@/lib/settings-context";
import { PROJECT_CATEGORIES, type Project, type Testimonial, type Service } from "@/lib/types";
import { slugify } from "@/lib/slug";
import Select from "@/components/Select";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

const servicePlaceholders = [
  { tag: "01", title: "Brand & Creative", shortDescription: "Identity systems, logos, visual language, and brand strategy that signal authority from first impression." },
  { tag: "02", title: "AI Content & Media", shortDescription: "AI-powered UGC, influencer models, product videos, book trailers, music videos, and cinematic content." },
  { tag: "03", title: "Web & App Development", shortDescription: "Custom websites and web apps built with modern stacks. Owned, scalable, and built for performance." },
  { tag: "04", title: "Digital Marketing", shortDescription: "Email campaigns, social media strategy, content marketing, and paid ads that convert ambition into revenue." },
  { tag: "05", title: "Publishing & Books", shortDescription: "Writing, editing, formatting, interior design, publishing, and sales optimization for authors and brands." },
  { tag: "06", title: "Apps & Games", shortDescription: "Native and web-based apps, plus original games. From MVP to launch, ready for app stores." },
];

const testimonialPlaceholders = [
  {
    quote: "Working with Millennia Works elevated our brand beyond what we thought possible.",
    name: "Client Name",
    role: "Founder, Coming Soon",
  },
  {
    quote: "The level of craft and strategic thinking we received was second to none.",
    name: "Client Name",
    role: "CEO, Coming Soon",
  },
];

export default function Home() {
  const { settings } = useSettings();
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [featuredTestimonials, setFeaturedTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const projects = await getFeaturedProjects();
        setFeaturedProjects(projects);
      } catch (err) {
        console.error("Failed to load featured projects:", err);
      } finally {
        setProjectsLoading(false);
      }
    }
    loadFeatured();
  }, []);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const testimonials = await getFeaturedTestimonials();
        setFeaturedTestimonials(testimonials);
      } catch (err) {
        console.error("Failed to load featured testimonials:", err);
      } finally {
        setTestimonialsLoading(false);
      }
    }
    loadTestimonials();
  }, []);

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getFeaturedServices();
        setServices(data);
      } catch (err) {
        console.error("Failed to load services:", err);
      } finally {
        setServicesLoading(false);
      }
    }
    loadServices();
  }, []);

  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", company: "", projectType: "", message: "" });
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryError, setInquiryError] = useState("");

  async function handleInquirySubmit(e: React.FormEvent) {
    e.preventDefault();
    setInquirySubmitting(true);
    setInquiryError("");
    try {
      await submitInquiry({
        name: inquiryForm.name,
        email: inquiryForm.email,
        message: inquiryForm.message,
        company: inquiryForm.company || undefined,
        projectType: inquiryForm.projectType || undefined,
      });
      setInquirySent(true);
      setInquiryForm({ name: "", email: "", company: "", projectType: "", message: "" });
    } catch (err) {
      console.error("Failed to submit inquiry:", err);
      setInquiryError("Something went wrong. Please email us directly.");
    } finally {
      setInquirySubmitting(false);
    }
  }
  return (
    <main className="min-h-screen bg-navy text-pearl">
      <SiteNav activeLink="home" />

      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
        {settings.heroMediaType === "video" && settings.heroVideoUrl && (
          <>
            <video
              className="hidden md:block absolute inset-0 w-full h-full object-cover z-0"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={settings.heroVideoPoster || undefined}
            >
              <source src={settings.heroVideoUrl} type="video/mp4" />
            </video>
            {settings.heroVideoPoster && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={settings.heroVideoPoster} alt="" className="md:hidden absolute inset-0 w-full h-full object-cover z-0" />
            )}
            <div className="absolute inset-0 bg-navy z-[1]" style={{ opacity: settings.heroOverlayOpacity / 100 }} />
          </>
        )}
        {settings.heroMediaType === "image" && settings.heroImageUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={settings.heroImageUrl} alt="" className="absolute inset-0 w-full h-full object-cover z-0" />
            <div className="absolute inset-0 bg-navy z-[1]" style={{ opacity: settings.heroOverlayOpacity / 100 }} />
          </>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-center max-w-3xl mx-auto"
        >
          <p className="font-[family-name:var(--font-playfair)] text-xs tracking-[0.4em] uppercase text-gold mb-8">{settings.heroEyebrow}</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-normal leading-tight tracking-tight mb-6">
            {settings.heroTitleLine1}<br />
            <span className="text-gold italic">{settings.heroTitleLine2}</span>
          </h1>
          <p className="text-base md:text-lg text-champagne max-w-xl mx-auto mb-10 leading-relaxed">
            {settings.heroSubtitle}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#contact" className="bg-gold text-navy text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-7 py-3.5 rounded hover:bg-gold/90 transition-colors">{settings.heroCtaPrimaryLabel}</a>
            <a href="#work" className="border border-gold text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-7 py-3.5 rounded hover:bg-gold hover:text-navy transition-colors">{settings.heroCtaSecondaryLabel}</a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute bottom-12 left-0 right-0 px-6 z-10"
        >
          <div className="max-w-5xl mx-auto pt-6 border-t border-gold/20 flex justify-center gap-6 md:gap-10 flex-wrap text-[10px] tracking-[0.3em] text-taupe font-[family-name:var(--font-montserrat)]">
            <span>BRAND</span>
            <span>AI MEDIA</span>
            <span>WEB</span>
            <span>MARKETING</span>
            <span>PUBLISHING</span>
            <span>APPS</span>
          </div>
        </motion.div>
      </section>

      <section id="services" className="py-24 px-6 border-t border-gold/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-[family-name:var(--font-montserrat)]">What we do</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal">
              Six disciplines.<br />
              <span className="text-gold italic">One vision.</span>
            </h2>
          </motion.div>

          {servicesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/10">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-navy p-8 md:p-10 space-y-4">
                  <div className="skeleton h-3 w-20 rounded" />
                  <div className="skeleton h-7 w-3/4 rounded" />
                  <div className="space-y-2">
                    <div className="skeleton h-3 w-full rounded" />
                    <div className="skeleton h-3 w-5/6 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/10">
              {servicePlaceholders.map((service, i) => (
                <motion.div
                  key={service.tag}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="bg-navy p-8 md:p-10 hover:bg-graphite transition-colors group"
                >
                  <p className="text-gold text-xs tracking-widest mb-6 font-[family-name:var(--font-montserrat)]">{service.tag}</p>
                  <h3 className="font-[family-name:var(--font-playfair)] text-2xl mb-4 group-hover:text-gold transition-colors">{service.title}</h3>
                  <p className="text-champagne/80 text-sm leading-relaxed">{service.shortDescription}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/10">
              {services
                .filter((s) => settings.servicesEnabled[s.category] !== false)
                .map((service, i) => (
                <motion.a
                  key={service.id}
                  href={`/${service.slug}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="bg-navy p-8 md:p-10 hover:bg-graphite transition-colors group cursor-pointer block"
                >
                  <p className="text-gold text-xs tracking-widest mb-6 font-[family-name:var(--font-montserrat)]">{service.tag}</p>
                  <h3 className="font-[family-name:var(--font-playfair)] text-2xl mb-4 group-hover:text-gold transition-colors">{service.title}</h3>
                  <p className="text-champagne/80 text-sm leading-relaxed mb-4">{service.shortDescription}</p>
                  <p className="text-gold text-[10px] tracking-widest uppercase font-[family-name:var(--font-montserrat)] opacity-0 group-hover:opacity-100 transition-opacity">Explore →</p>
                </motion.a>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="about" className="py-24 px-6 border-t border-gold/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-6 font-[family-name:var(--font-montserrat)]">{settings.aboutEyebrow}</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal mb-8 leading-tight">
              {settings.aboutTitle}
            </h2>
            <p className="text-champagne/80 text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              {settings.aboutBody}
            </p>
            <a href="#contact" className="inline-block text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] border-b border-gold pb-1 hover:text-pearl hover:border-pearl transition-colors">Learn more →</a>
          </motion.div>
        </div>
      </section>

      <section id="work" className="py-24 px-6 border-t border-gold/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-[family-name:var(--font-montserrat)]">Selected work</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal">
              Work that speaks<br />
              <span className="text-gold italic">for itself.</span>
            </h2>
          </motion.div>

          {projectsLoading ? (
  <div className="grid md:grid-cols-3 gap-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="aspect-[4/5] skeleton rounded" />
    ))}
  </div>
) : featuredProjects.length === 0 ? (
  <div className="grid md:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="aspect-[4/5] bg-graphite border border-gold/10 flex flex-col justify-end p-6">
        <p className="text-xs tracking-widest text-gold mb-2 font-[family-name:var(--font-montserrat)]">Coming Soon</p>
        <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-champagne/60">In production</h3>
      </div>
    ))}
  </div>
) : (
  <div className="grid md:grid-cols-3 gap-6">
    {featuredProjects.map((p, i) => {
      return (
        <motion.a
          key={p.id}
          href={`/work/${slugify(p.title)}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.15 }}
          className="aspect-[4/5] bg-graphite border border-gold/10 relative overflow-hidden hover:border-gold/40 transition-colors cursor-pointer group block"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.imageUrl} alt={p.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="text-xs tracking-widest text-gold mb-2 font-[family-name:var(--font-montserrat)]">{p.category}</p>
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-pearl mb-1">{p.title}</h3>
            {p.client && <p className="text-taupe text-xs">{p.client} · {p.year}</p>}
          </div>
        </motion.a>
      );
    })}
  </div>
)}
        </div>
      </section>

      <section className="py-24 px-6 border-t border-gold/10 bg-graphite/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-[family-name:var(--font-montserrat)]">In their words</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal">What clients say.</h2>
          </motion.div>

          {testimonialsLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="border border-gold/10 p-8 md:p-10 space-y-4">
                  <div className="skeleton h-8 w-8 rounded" />
                  <div className="space-y-2">
                    <div className="skeleton h-4 w-full rounded" />
                    <div className="skeleton h-4 w-full rounded" />
                    <div className="skeleton h-4 w-3/4 rounded" />
                  </div>
                  <div className="space-y-1 pt-2">
                    <div className="skeleton h-3 w-32 rounded" />
                    <div className="skeleton h-3 w-24 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredTestimonials.length === 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {testimonialPlaceholders.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="relative bg-graphite/20 border border-gold/20 p-8 md:p-10 overflow-hidden"
                >
                  <span className="absolute top-4 right-6 text-gold/10 font-[family-name:var(--font-playfair)] leading-none select-none pointer-events-none" style={{ fontSize: "8rem" }}>&ldquo;</span>
                  <div className="relative">
                    <p className="text-champagne text-base md:text-lg leading-relaxed italic font-[family-name:var(--font-playfair)] mb-8">{t.quote}</p>
                    <div className="border-t border-gold/20 pt-5">
                      <p className="text-pearl text-sm font-medium">{t.name}</p>
                      <p className="text-taupe text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] mt-1">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {featuredTestimonials.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="relative bg-graphite/20 border border-gold/20 p-8 md:p-10 overflow-hidden"
                >
                  <span className="absolute top-4 right-6 text-gold/10 font-[family-name:var(--font-playfair)] leading-none select-none pointer-events-none" style={{ fontSize: "8rem" }}>&ldquo;</span>
                  <div className="relative">
                    {t.photoUrl && (
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-graphite mb-6 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={t.photoUrl} alt={t.clientName} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <p className="text-champagne text-base md:text-lg leading-relaxed italic font-[family-name:var(--font-playfair)] mb-8">{t.quote}</p>
                    <div className="border-t border-gold/20 pt-5">
                      <p className="text-pearl text-sm font-medium">{t.clientName}</p>
                      <p className="text-taupe text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] mt-1">{t.role}{t.role && t.company && " · "}{t.company}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="contact" className="py-32 px-6 border-t border-gold/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-6 font-[family-name:var(--font-montserrat)]">Let&apos;s build</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-normal mb-8 leading-tight">
              {settings.contactCtaHeadline}
            </h2>
            <p className="text-champagne/80 text-base md:text-lg max-w-xl mx-auto">
              {settings.contactCtaSubhead} {settings.responseTimePromise}
            </p>
          </div>

          <AnimatePresence mode="wait">
          {inquirySent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="border border-gold/30 bg-gold/5 p-10 md:p-14 text-center"
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="text-gold text-5xl font-[family-name:var(--font-playfair)] mb-4"
              >✦</motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="font-[family-name:var(--font-playfair)] text-3xl text-pearl mb-3"
              >Thank you.</motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-champagne/70 text-base mb-8"
              >Got it — {settings.responseTimePromise.toLowerCase()}</motion.p>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.4 }}
                onClick={() => setInquirySent(false)}
                className="text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] border-b border-gold pb-1 hover:text-pearl hover:border-pearl transition-colors"
              >Send another</motion.button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleInquirySubmit}
              className="border border-gold/20 p-6 md:p-8 space-y-5"
            >
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Name *</label>
                  <input type="text" required value={inquiryForm.name} onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold" />
                </div>

                <div>
                  <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Email *</label>
                  <input type="email" required value={inquiryForm.email} onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold" />
                </div>

                <div>
                  <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Company</label>
                  <input type="text" value={inquiryForm.company} onChange={(e) => setInquiryForm({ ...inquiryForm, company: e.target.value })} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold" />
                </div>

                <div>
                  <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Project type</label>
                  <Select
                    value={inquiryForm.projectType}
                    onChange={(v) => setInquiryForm({ ...inquiryForm, projectType: v })}
                    options={PROJECT_CATEGORIES.map((c) => ({ value: c, label: c }))}
                    placeholder="Select one..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Message *</label>
                <textarea required rows={5} value={inquiryForm.message} onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold resize-none" placeholder="Tell us about what you're building..." />
              </div>

              {inquiryError && (
                <p className="border border-red-400/30 bg-red-400/10 text-red-400 text-sm px-4 py-3">{inquiryError}</p>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                <button type="submit" disabled={inquirySubmitting} className="bg-gold text-navy text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-8 py-4 rounded hover:bg-pearl transition-colors disabled:opacity-50">
                  {inquirySubmitting ? "Sending..." : settings.contactCtaButtonLabel}
                </button>
                <a href={`mailto:${settings.contactEmail}`} className="text-taupe text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] hover:text-gold transition-colors">or email {settings.contactEmail}</a>
              </div>
            </motion.form>
          )}
          </AnimatePresence>

          {(settings.whatsappNumber || settings.bookingLink) && !inquirySent && (
            <div className="flex justify-center gap-3 flex-wrap mt-6">
              {settings.whatsappNumber && (
                <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="border border-gold/30 text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-5 py-2.5 rounded hover:bg-gold/10 transition-colors">WhatsApp →</a>
              )}
              {settings.bookingLink && (
                <a href={settings.bookingLink} target="_blank" rel="noopener noreferrer" className="border border-gold/30 text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-5 py-2.5 rounded hover:bg-gold/10 transition-colors">Book a call →</a>
              )}
            </div>
          )}
        </motion.div>
      </section>

      <SiteFooter />
    </main>
  );
}