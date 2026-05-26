"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getFeaturedProjects } from "@/lib/portfolio";
import { getFeaturedTestimonials } from "@/lib/testimonials";
import { submitInquiry } from "@/lib/inquiries";
import { PROJECT_CATEGORIES, type Project, type Testimonial } from "@/lib/types";

const services = [
  {
    tag: "01",
    title: "Brand & Creative",
    description:
      "Identity systems, logos, visual language, and brand strategy that signal authority from first impression.",
  },
  {
    tag: "02",
    title: "AI Content & Media",
    description:
      "AI-powered UGC, influencer models, product videos, book trailers, music videos, and cinematic content.",
  },
  {
    tag: "03",
    title: "Web & App Development",
    description:
      "Custom websites and web apps built with modern stacks. Owned, scalable, and built for performance.",
  },
  {
    tag: "04",
    title: "Digital Marketing",
    description:
      "Email campaigns, social media strategy, content marketing, and paid ads that convert ambition into revenue.",
  },
  {
    tag: "05",
    title: "Publishing & Books",
    description:
      "Writing, editing, formatting, interior design, publishing, and sales optimization for authors and brands.",
  },
  {
    tag: "06",
    title: "Apps & Games",
    description:
      "Native and web-based apps, plus original games. From MVP to launch, ready for app stores.",
  },
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
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [featuredTestimonials, setFeaturedTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

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
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-navy/70 border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <a href="#" className="font-[family-name:var(--font-playfair)] text-xl tracking-wider text-gold">MW</a>
          <div className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] text-pearl/80">
            <a href="#services" className="hover:text-gold transition-colors">Services</a>
            <a href="#about" className="hover:text-gold transition-colors">About</a>
            <a href="#work" className="hover:text-gold transition-colors">Work</a>
            <a href="#contact" className="hover:text-gold transition-colors">Contact</a>
          </div>
          <a href="#contact" className="text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] bg-gold text-navy px-5 py-2.5 rounded hover:bg-gold/90 transition-colors">Start a project</a>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="font-[family-name:var(--font-playfair)] text-xs tracking-[0.4em] uppercase text-gold mb-8">Millennia Works</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-normal leading-tight tracking-tight mb-6">
            From Idea<br />
            <span className="text-gold italic">To Empire.</span>
          </h1>
          <p className="text-base md:text-lg text-champagne max-w-xl mx-auto mb-10 leading-relaxed">
            Premium brand, content, and digital agency for founders building what lasts.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#contact" className="bg-gold text-navy text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-7 py-3.5 rounded hover:bg-gold/90 transition-colors">Start a project</a>
            <a href="#work" className="border border-gold text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-7 py-3.5 rounded hover:bg-gold hover:text-navy transition-colors">View our work</a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute bottom-12 left-0 right-0 px-6"
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/10">
            {services.map((service, i) => (
              <motion.div
                key={service.tag}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-navy p-8 md:p-10 hover:bg-graphite transition-colors group cursor-pointer"
              >
                <p className="text-gold text-xs tracking-widest mb-6 font-[family-name:var(--font-montserrat)]">{service.tag}</p>
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl mb-4 group-hover:text-gold transition-colors">{service.title}</h3>
                <p className="text-champagne/80 text-sm leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-24 px-6 border-t border-gold/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-6 font-[family-name:var(--font-montserrat)]">Who we are</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal mb-8 leading-tight">
              We build the digital infrastructure<br />
              <span className="text-gold italic">behind ambitious brands.</span>
            </h2>
            <p className="text-champagne/80 text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Millennia Works is a full-service creative and digital agency built for founders who refuse to compete on price. We combine brand strategy, AI-powered content, world-class development, and sharp marketing into a single, integrated practice — so every piece of your empire moves in the same direction.
            </p>
            <a href="#contact" className="inline-block text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] border-b border-gold pb-1 hover:text-pearl hover:border-pearl transition-colors">Learn more →</a>
          </motion.div>
        </div>
      </section>

      <section id="work" className="py-24 px-6 border-t border-gold/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-[family-name:var(--font-montserrat)]">Selected work</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal">
              Work that speaks<br />
              <span className="text-gold italic">for itself.</span>
            </h2>
          </motion.div>

          {projectsLoading ? (
  <p className="text-taupe text-sm text-center py-12">Loading work...</p>
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
      const card = (
        <div className="aspect-[4/5] bg-graphite border border-gold/10 relative overflow-hidden hover:border-gold/40 transition-colors cursor-pointer group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.imageUrl} alt={p.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="text-xs tracking-widest text-gold mb-2 font-[family-name:var(--font-montserrat)]">{p.category}</p>
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-pearl mb-1">{p.title}</h3>
            {p.client && <p className="text-taupe text-xs">{p.client} · {p.year}</p>}
          </div>
        </div>
      );
      return (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.15 }}
        >
          {p.projectUrl ? <a href={p.projectUrl} target="_blank" rel="noopener noreferrer">{card}</a> : card}
        </motion.div>
      );
    })}
  </div>
)}
        </div>
      </section>

      <section className="py-24 px-6 border-t border-gold/10 bg-graphite/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-[family-name:var(--font-montserrat)]">In their words</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal">What clients say.</h2>
          </motion.div>

          {testimonialsLoading ? (
            <p className="text-taupe text-sm text-center py-12">Loading testimonials...</p>
          ) : featuredTestimonials.length === 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {testimonialPlaceholders.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="border border-gold/20 p-8 md:p-10"
                >
                  <p className="text-gold text-3xl font-[family-name:var(--font-playfair)] mb-4">&ldquo;</p>
                  <p className="text-champagne text-base md:text-lg leading-relaxed italic font-[family-name:var(--font-playfair)] mb-6">{t.quote}</p>
                  <div>
                    <p className="text-pearl text-sm font-medium">{t.name}</p>
                    <p className="text-taupe text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] mt-1">{t.role}</p>
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
                  className="border border-gold/20 p-8 md:p-10"
                >
                  <div className="flex items-start gap-4 mb-4">
                    {t.photoUrl && (
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-graphite flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={t.photoUrl} alt={t.clientName} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <p className="text-gold text-3xl font-[family-name:var(--font-playfair)]">&ldquo;</p>
                  </div>
                  <p className="text-champagne text-base md:text-lg leading-relaxed italic font-[family-name:var(--font-playfair)] mb-6">{t.quote}</p>
                  <div>
                    <p className="text-pearl text-sm font-medium">{t.clientName}</p>
                    <p className="text-taupe text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] mt-1">{t.role}{t.role && t.company && " · "}{t.company}</p>
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
              Ready to build<br />
              <span className="text-gold italic">your empire?</span>
            </h2>
            <p className="text-champagne/80 text-base md:text-lg max-w-xl mx-auto">
              Tell us about what you&apos;re building. We respond within 24 hours.
            </p>
          </div>

          {inquirySent ? (
            <div className="border border-gold/30 bg-gold/5 p-8 md:p-10 text-center">
              <p className="text-gold text-3xl font-[family-name:var(--font-playfair)] mb-4">Thank you.</p>
              <p className="text-champagne/80 text-base mb-6">Got it — we&apos;ll respond within 24 hours.</p>
              <button onClick={() => setInquirySent(false)} className="text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] border-b border-gold pb-1 hover:text-pearl hover:border-pearl transition-colors">Send another</button>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="border border-gold/20 p-6 md:p-8 space-y-5">
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
                  <select value={inquiryForm.projectType} onChange={(e) => setInquiryForm({ ...inquiryForm, projectType: e.target.value })} className="w-full bg-navy border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold">
                    <option value="">Select one...</option>
                    {PROJECT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
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
                  {inquirySubmitting ? "Sending..." : "Send inquiry"}
                </button>
                <a href="mailto:david@millenniaworks.com" className="text-taupe text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] hover:text-gold transition-colors">or email david@millenniaworks.com</a>
              </div>
            </form>
          )}
        </motion.div>
      </section>

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