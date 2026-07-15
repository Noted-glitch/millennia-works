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
import { useReveal } from "@/lib/motion";
import Select from "@/components/Select";
import { HeroMedia } from "@/components/HeroMedia";
import { GhostWord } from "@/components/GhostWord";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

const servicePlaceholders = [
  { tag: "01", title: "Brand & Creative", shortDescription: "Identity, design, and the visual language that makes a brand recognizable." },
  { tag: "02", title: "AI Content & Media", shortDescription: "AI-generated personas, imagery, and media, built for consistency and scale." },
  { tag: "03", title: "Publishing & Books", shortDescription: "Cover design, interior layout, and full production for print and digital." },
  { tag: "04", title: "Web & App Development", shortDescription: "Sites and applications built to perform and to last." },
  { tag: "05", title: "Digital Marketing", shortDescription: "Reaching the right audience and turning attention into growth." },
  { tag: "06", title: "Apps & Games", shortDescription: "Interactive products from concept to launch." },
];

// "The Studio" credibility strip — team depth first, single-contact simplicity last.
const STUDIO_STATS = [
  { figure: "8", label: "Specialists" },
  { figure: "7", label: "Core services" },
  { figure: "∞", label: "Concepts per brief" },
  { figure: "1", label: "Point of contact" },
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

  const reveal = useReveal();

  const visibleServices = services.filter((s) => settings.servicesEnabled[s.category] !== false);
  // The CTA tile spans whatever cells remain in the last row so the hairline grid always closes cleanly.
  const ctaTileSpan = `${visibleServices.length % 2 === 0 ? "md:col-span-2" : ""} ${["lg:col-span-3", "lg:col-span-2", ""][visibleServices.length % 3]}`;

  return (
    <main className="min-h-screen bg-navy text-pearl">
      <SiteNav activeLink="home" />

      <section className="relative min-h-screen flex flex-col px-6 pt-28 pb-12 overflow-hidden">
        <HeroMedia
          mediaType={settings.heroMediaType}
          videoUrl={settings.heroVideoUrl}
          videoPoster={settings.heroVideoPoster}
          imageUrl={settings.heroImageUrl}
          overlayOpacity={settings.heroOverlayOpacity}
        />
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="text-center max-w-6xl mx-auto">
          {/* Hero headline — masked line-by-line reveal (design system §5.2). */}
          <h1 className="font-[family-name:var(--font-playfair)] text-display-hero font-normal tracking-tight mb-10">
            <span className="block overflow-hidden py-[0.08em] -my-[0.08em]">
              <motion.span {...reveal.line(0.1)} className="block">{settings.heroTitleLine1}</motion.span>
            </span>
            <span className="block overflow-hidden py-[0.08em] -my-[0.08em]">
              <motion.span {...reveal.line(0.2)} className="block text-gold italic">{settings.heroTitleLine2}</motion.span>
            </span>
          </h1>
          <motion.p {...reveal.onMount(3)} className="text-[17px] md:text-[19px] text-champagne max-w-[60ch] mx-auto mb-10 leading-[1.7]">
            {settings.heroSubtitle}
          </motion.p>
          <motion.div {...reveal.onMount(4)} className="flex gap-4 justify-center flex-wrap">
            <a href="#contact" className="btn btn-primary">{settings.heroCtaPrimaryLabel}</a>
            <a href="#work" className="btn btn-secondary">{settings.heroCtaSecondaryLabel}</a>
          </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="relative z-10 mt-10"
        >
          <div className="max-w-5xl mx-auto pt-6 border-t border-gold/20 flex justify-center gap-6 md:gap-10 flex-wrap text-[10px] tracking-[0.3em] text-taupe font-[family-name:var(--font-montserrat)]">
            <span>BRAND</span>
            <span>AI MEDIA</span>
            <span>PUBLISHING</span>
            <span>WEB</span>
            <span>MARKETING</span>
            <span>APPS</span>
            <span>3D &amp; MOTION</span>
          </div>
        </motion.div>
      </section>

      <section id="positioning" className="py-26 md:py-42 px-6 border-t border-gold/10">
        <motion.div
          {...reveal.props()}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-[family-name:var(--font-playfair)] text-display font-normal mb-10">
            One team. <span className="text-gold italic">Every discipline.</span>
          </h2>
          <p className="text-champagne/80 text-[17px] md:text-[19px] leading-[1.7] max-w-[65ch] mx-auto">
            Most projects don&apos;t fit neatly into one skill set. A book needs a cover, an interior, and a launch. A brand needs an identity, a website, and content that carries it. Millennia Works brings the specialists for each of those under one roof — so you brief one team, not five freelancers, and everything moves in the same direction.
          </p>
        </motion.div>
      </section>

      <section id="services" className="relative overflow-hidden py-26 md:py-42 px-6 border-t border-gold/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            {...reveal.props()}
            className="relative text-center mb-16"
          >
            <GhostWord>SERVICES</GhostWord>
            <div className="relative z-10">
              <p className="text-xs tracking-[0.2em] uppercase text-gold mb-6 font-[family-name:var(--font-montserrat)]">What we do</p>
              <h2 className="font-[family-name:var(--font-playfair)] text-display font-normal">
                Every discipline,<br />
                <span className="text-gold italic">one studio.</span>
              </h2>
            </div>
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
                  {...reveal.props(i)}
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
              {visibleServices.map((service, i) => (
                <motion.a
                  key={service.id}
                  href={`/${service.slug}`}
                  {...reveal.props(i)}
                  className="bg-navy p-8 md:p-10 hover:bg-graphite transition-colors group cursor-pointer block"
                >
                  <p className="text-gold text-xs tracking-widest mb-6 font-[family-name:var(--font-montserrat)]">{service.tag}</p>
                  <h3 className="font-[family-name:var(--font-playfair)] text-2xl mb-4 group-hover:text-gold transition-colors">{service.title}</h3>
                  <p className="text-champagne/80 text-sm leading-relaxed mb-4">{service.shortDescription}</p>
                  <p className="text-gold text-[10px] tracking-widest uppercase font-[family-name:var(--font-montserrat)] opacity-0 group-hover:opacity-100 transition-opacity">Explore →</p>
                </motion.a>
              ))}
              <motion.a
                href="/services"
                {...reveal.props(visibleServices.length)}
                className={`bg-navy p-8 md:p-10 flex items-center justify-center group cursor-pointer ${ctaTileSpan}`}
              >
                <span className="inline-flex items-center gap-3 border border-gold/30 rounded px-7 py-3.5 text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] group-hover:bg-gold group-hover:text-navy transition-colors">
                  View all services
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </motion.a>
            </div>
          )}
        </div>
      </section>

      {(projectsLoading || featuredProjects.length > 0) && (
      <section id="work" className="relative overflow-hidden py-26 md:py-42 px-6 border-t border-gold/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            {...reveal.props()}
            className="relative text-center mb-16"
          >
            <GhostWord>WORK</GhostWord>
            <div className="relative z-10">
              <p className="text-xs tracking-[0.2em] uppercase text-gold mb-6 font-[family-name:var(--font-montserrat)]">Selected work</p>
              <h2 className="font-[family-name:var(--font-playfair)] text-display font-normal mb-6">
                Selected work.
              </h2>
              <p className="text-champagne/80 text-[17px] md:text-[19px] leading-[1.7]">Real projects, delivered end to end.</p>
            </div>
          </motion.div>

          {projectsLoading ? (
  <div className="grid md:grid-cols-3 gap-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="aspect-[4/3] skeleton rounded" />
    ))}
  </div>
) : (
  <div className="grid md:grid-cols-3 gap-6">
    {featuredProjects.map((p, i) => {
      return (
        <motion.a
          key={p.id}
          href={`/work/${p.slug || slugify(p.title)}`}
          {...reveal.props(i)}
          whileHover={reveal.cardHover()}
          className="aspect-[4/3] bg-graphite border border-gold/10 relative overflow-hidden hover:border-gold/40 transition-colors duration-[500ms] cursor-pointer group block"
        >
          <motion.div {...reveal.imageSettle()} className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-[1.03] transition-[transform,opacity] duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:group-hover:scale-100" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <p className="text-xs tracking-[0.2em] uppercase text-gold mb-2 font-[family-name:var(--font-montserrat)]">{p.category}</p>
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-pearl mb-1.5 leading-tight">{p.title}</h3>
            {p.description && <p className="text-taupe text-sm leading-relaxed line-clamp-1">{p.description}</p>}
          </div>
        </motion.a>
      );
    })}
  </div>
)}
          {!projectsLoading && featuredProjects.length > 0 && (
            <div className="text-center mt-12">
              <a href="/work" className="btn btn-secondary">
                View all work →
              </a>
            </div>
          )}
        </div>
      </section>
      )}

      <section id="why" className="py-26 md:py-42 px-6 border-t border-gold/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...reveal.props()}>
            <p className="text-xs tracking-[0.2em] uppercase text-gold mb-6 font-[family-name:var(--font-montserrat)]">Why one team</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-display font-normal mb-10">
              Why a studio, not a<br />
              <span className="text-gold italic">scatter of freelancers.</span>
            </h2>
            <p className="text-champagne/80 text-[17px] md:text-[19px] leading-[1.7] max-w-[65ch] mx-auto">
              Hiring separate specialists means managing separate people, timelines, and standards — and hoping they add up to something coherent. With Millennia Works, the specialists already work together. The person designing your cover talks to the person formatting your interior. The brand designer and the developer share one vision. You get the depth of a full team with the simplicity of a single point of contact.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Studio — credibility strip */}
      <section id="studio" className="relative overflow-hidden py-26 md:py-42 px-6 border-t border-gold/10">
        <div className="relative max-w-6xl mx-auto">
          <GhostWord>STUDIO</GhostWord>
          <motion.p {...reveal.props()} className="relative z-10 text-xs tracking-[0.2em] uppercase text-gold mb-16 text-center font-[family-name:var(--font-montserrat)]">The studio</motion.p>
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-14 md:gap-x-0 md:gap-y-0 md:divide-x md:divide-gold/15">
            {STUDIO_STATS.map((s, i) => (
              <motion.div key={s.label} {...reveal.props(i)} className="text-center px-4 md:px-8">
                <p className="font-[family-name:var(--font-playfair)] text-6xl md:text-7xl text-gold leading-none mb-5">{s.figure}</p>
                <p className="text-[11px] md:text-xs tracking-[0.2em] uppercase text-taupe font-[family-name:var(--font-montserrat)]">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-26 md:py-42 px-6 border-t border-gold/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...reveal.props()}>
            <p className="text-xs tracking-[0.2em] uppercase text-gold mb-6 font-[family-name:var(--font-montserrat)]">{settings.aboutEyebrow}</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-display font-normal mb-10">
              {settings.aboutTitle}
            </h2>
            <p className="text-champagne/80 text-[17px] md:text-[19px] leading-[1.7] mb-10 max-w-[65ch] mx-auto">
              {settings.aboutBody}
            </p>
            <a href="#contact" className="link-underline inline-block text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] hover:text-pearl transition-colors">Start a project →</a>
          </motion.div>
        </div>
      </section>

      {(testimonialsLoading || featuredTestimonials.length > 0) && (
      <section className="py-26 md:py-42 px-6 border-t border-gold/10 bg-graphite/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            {...reveal.props()}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.2em] uppercase text-gold mb-6 font-[family-name:var(--font-montserrat)]">In their words</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-display font-normal">What clients say.</h2>
          </motion.div>

          {testimonialsLoading ? (
            <div className="grid md:grid-cols-2 gap-10">
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
          ) : (
            <div className="grid md:grid-cols-2 gap-10">
              {featuredTestimonials.map((t, i) => (
                <motion.div
                  key={t.id}
                  {...reveal.props(i)}
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
      )}

      <section id="contact" className="py-26 md:py-42 px-6 border-t border-gold/10">
        <motion.div
          {...reveal.props()}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.2em] uppercase text-gold mb-6 font-[family-name:var(--font-montserrat)]">Let&apos;s build</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-display font-normal mb-10">
              {settings.contactCtaHeadline}
            </h2>
            <p className="text-champagne/80 text-[17px] md:text-[19px] leading-[1.7] max-w-[65ch] mx-auto">
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
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="w-12 h-px bg-gold/60 mx-auto mb-6"
              />
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
                  <input type="text" required value={inquiryForm.name} onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })} className="field w-full bg-transparent border border-gold/30 text-pearl px-4 py-3" />
                </div>

                <div>
                  <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Email *</label>
                  <input type="email" required value={inquiryForm.email} onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })} className="field w-full bg-transparent border border-gold/30 text-pearl px-4 py-3" />
                </div>

                <div>
                  <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Company</label>
                  <input type="text" value={inquiryForm.company} onChange={(e) => setInquiryForm({ ...inquiryForm, company: e.target.value })} className="field w-full bg-transparent border border-gold/30 text-pearl px-4 py-3" />
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
                <textarea required rows={5} value={inquiryForm.message} onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })} className="field w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 resize-none" placeholder="Tell us about what you're building..." />
              </div>

              {inquiryError && (
                <p className="border border-red-400/30 bg-red-400/10 text-red-400 text-sm px-4 py-3">{inquiryError}</p>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                <button type="submit" disabled={inquirySubmitting} className="btn btn-primary">
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