"use client";

import { motion } from "framer-motion";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useReveal } from "@/lib/motion";

export default function NotFound() {
  const reveal = useReveal();
  return (
    <main className="min-h-screen bg-navy text-pearl">
      <SiteNav />

      <section className="min-h-[85vh] flex items-center justify-center px-6 pt-20">
        <motion.div {...reveal.onMount()} className="text-center max-w-lg">
          <p className="text-xs tracking-[0.2em] uppercase text-gold mb-6 font-[family-name:var(--font-montserrat)]">404</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-display font-normal mb-6">
            Lost in the <span className="text-gold italic">empire.</span>
          </h1>
          <p className="text-champagne/70 text-[17px] md:text-[19px] mb-16 max-w-sm mx-auto leading-[1.7]">
            This page doesn&apos;t exist — but your next breakthrough might.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="btn btn-primary"
            >
              Back to home
            </a>
            <a
              href="/#contact"
              className="btn btn-secondary"
            >
              Start a project
            </a>
          </div>
        </motion.div>
      </section>

      <SiteFooter />
    </main>
  );
}
