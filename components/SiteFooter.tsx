"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useSettings } from "@/lib/settings-context";
import { useReveal } from "@/lib/motion";

export function SiteFooter() {
  const { settings } = useSettings();
  const reveal = useReveal();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gold/10">
      {/* CTA strip */}
      <motion.div {...reveal.props()} className="py-26 md:py-42 px-6 text-center border-b border-gold/10">
        <p className="text-xs tracking-[0.2em] uppercase text-gold mb-6 font-[family-name:var(--font-montserrat)]">Ready to begin?</p>
        <h2 className="font-[family-name:var(--font-playfair)] text-display font-normal mb-10">
          Let&apos;s build something<br />
          <span className="text-gold italic">worth remembering.</span>
        </h2>
        <a href="/#contact" className="btn btn-primary">
          Start a project
        </a>
      </motion.div>

      {/* Sign-off — the closing moment (§7.4) */}
      <motion.div {...reveal.props()} className="py-24 md:py-36 px-6 text-center">
        <div className="w-12 h-px bg-gold/60 mx-auto mb-10" />
        <p className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl lg:text-7xl font-normal leading-[1.05]">
          From Idea to <span className="text-gold italic">Empire.</span>
        </p>
      </motion.div>

      {/* Bottom bar */}
      <div className="py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-3">
            <a href="/" className="inline-flex" aria-label="Millennia Works home">
              <Image
                src="/brand/logo-icon-gold.png"
                alt="Millennia Works"
                width={80}
                height={80}
                className="h-14 w-auto"
              />
            </a>
            <p className="text-taupe text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)]">{settings.tagline}</p>
          </div>

          {settings.socialLinks.length > 0 && (
            <div className="flex items-center gap-5 text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] text-taupe">
              {settings.socialLinks.map((s) => (
                <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-gold transition-colors">{s.label}</a>
              ))}
            </div>
          )}

          <p className="text-taupe text-xs">© {year} Millennia Works. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
