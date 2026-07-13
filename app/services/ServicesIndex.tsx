"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getAllServices } from "@/lib/services";
import { useSettings } from "@/lib/settings-context";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import type { Service } from "@/lib/types";

export default function ServicesIndex() {
  const { settings } = useSettings();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllServices();
        setServices(data);
      } catch (err) {
        console.error("Failed to load services:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const visibleServices = services.filter((s) => settings.servicesEnabled[s.category] !== false);

  return (
    <main className="min-h-screen bg-navy text-pearl">
      <SiteNav activeLink="services" />

      {/* Header */}
      <section className="pt-32 pb-16 px-6 border-b border-gold/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-6 font-[family-name:var(--font-montserrat)]">What we do</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-normal leading-tight mb-6">
            Every discipline,<br />
            <span className="text-gold italic">one studio.</span>
          </h1>
          <p className="text-champagne/80 text-base md:text-lg max-w-2xl mx-auto">
            From brand identity to apps, books, and 3D — the full range of what Millennia Works delivers, end to end.
          </p>
        </motion.div>
      </section>

      {/* Grid */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border border-gold/10 p-8 md:p-10 space-y-4">
                  <div className="skeleton h-3 w-20 rounded" />
                  <div className="skeleton h-7 w-3/4 rounded" />
                  <div className="space-y-2">
                    <div className="skeleton h-3 w-full rounded" />
                    <div className="skeleton h-3 w-5/6 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : visibleServices.length === 0 ? (
            <div className="border border-gold/20 p-12 text-center max-w-2xl mx-auto">
              <p className="text-champagne/70 mb-2">No services listed yet.</p>
              <p className="text-taupe text-sm">The full offering is being written up. Check back soon.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleServices.map((service, i) => (
                <motion.a
                  key={service.id}
                  href={`/${service.slug}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (i % 6) * 0.08 }}
                  className="border border-gold/10 bg-graphite/20 p-8 md:p-10 hover:border-gold/40 transition-colors group block"
                >
                  <p className="text-gold text-xs tracking-widest mb-6 font-[family-name:var(--font-montserrat)]">{service.tag}</p>
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl mb-4 group-hover:text-gold transition-colors">{service.title}</h2>
                  <p className="text-champagne/80 text-sm leading-relaxed mb-4">{service.shortDescription}</p>
                  <p className="text-gold text-[10px] tracking-widest uppercase font-[family-name:var(--font-montserrat)] opacity-0 group-hover:opacity-100 transition-opacity">Explore →</p>
                </motion.a>
              ))}
            </div>
          )}

          {!loading && visibleServices.length > 0 && (
            <div className="text-center mt-16">
              <p className="text-champagne/70 text-base mb-6">Not sure which one fits? Tell us what you&apos;re building.</p>
              <Link
                href="/#contact"
                className="inline-flex text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] bg-gold text-navy px-8 py-3.5 rounded hover:bg-gold/90 transition-colors"
              >
                Start a project →
              </Link>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
