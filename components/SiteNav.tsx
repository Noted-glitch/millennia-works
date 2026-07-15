"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useSettings } from "@/lib/settings-context";

export type SiteNavActiveLink = "home" | "services" | "about" | "work" | "blog" | "contact" | null;

const LINKS: { key: Exclude<SiteNavActiveLink, null>; label: string; href: string }[] = [
  { key: "services", label: "Services", href: "/services" },
  { key: "about", label: "About", href: "/#about" },
  { key: "work", label: "Work", href: "/#work" },
  { key: "blog", label: "Blog", href: "/blog" },
  { key: "contact", label: "Contact", href: "/#contact" },
];

export function SiteNav({ activeLink = null }: { activeLink?: SiteNavActiveLink } = {}) {
  const { settings } = useSettings();
  const bar = settings.announcementBar;
  const [mobileOpen, setMobileOpen] = useState(false);

  const hasBar = bar.enabled && bar.text;

  // Transparent over the hero; solid navy + hairline border once scrolled (§7.3).
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent body scroll while mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close menu on resize to desktop.
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* ── Announcement bar ── */}
      {hasBar && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-graphite border-b border-gold/20 px-6 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] text-gold text-center flex-wrap">
            <span>{bar.text}</span>
            {bar.linkUrl && bar.linkLabel && (
              <a href={bar.linkUrl} className="underline decoration-gold/40 hover:decoration-gold transition-colors">{bar.linkLabel} →</a>
            )}
          </div>
        </div>
      )}

      {/* ── Nav bar ── */}
      <nav className={`fixed left-0 right-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${scrolled ? "bg-navy/95 backdrop-blur-md border-b border-gold/10" : "bg-transparent border-b border-transparent"} ${hasBar ? "top-[42px]" : "top-0"}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <a href="/" onClick={() => setMobileOpen(false)} className="inline-flex items-center" aria-label="Millennia Works home">
            <Image
              src="/brand/logo-icon-gold.png"
              alt="Millennia Works"
              width={64}
              height={64}
              priority
              className="h-10 md:h-12 w-auto"
            />
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 text-[13px] tracking-[0.15em] uppercase font-[family-name:var(--font-montserrat)] text-pearl/80">
            {LINKS.map((l) => (
              <a key={l.key} href={l.href} className={`link-underline [--underline-color:var(--color-gold)] transition-colors ${activeLink === l.key ? "text-gold" : "hover:text-gold"}`}>{l.label}</a>
            ))}
          </div>

          {/* Right side: CTA (desktop) + hamburger (mobile) */}
          <div className="flex items-center gap-4">
            <a href="/#contact" className="hidden md:inline-flex items-center text-[13px] tracking-[0.15em] uppercase font-[family-name:var(--font-montserrat)] bg-gold text-navy px-6 py-2.5 rounded-[3px] hover:bg-gold/90 transition-colors duration-[400ms]">
              Start a project
            </a>

            {/* Hamburger / close button */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden relative flex items-center justify-center w-8 h-8"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <span className={`absolute h-px w-6 bg-gold transition-all duration-300 origin-center ${mobileOpen ? "rotate-45" : "-translate-y-[7px]"}`} />
              <span className={`absolute h-px w-6 bg-gold transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"}`} />
              <span className={`absolute h-px w-6 bg-gold transition-all duration-300 origin-center ${mobileOpen ? "-rotate-45" : "translate-y-[7px]"}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`fixed inset-0 z-40 bg-navy flex flex-col px-8 pb-12 md:hidden overflow-auto ${hasBar ? "pt-[122px]" : "pt-[80px]"}`}
          >
            {/* Nav links */}
            <nav className="flex flex-col flex-1 mt-6">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.key}
                  href={l.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.05 + i * 0.06 }}
                  onClick={() => setMobileOpen(false)}
                  className={`font-[family-name:var(--font-playfair)] text-4xl py-5 border-b border-gold/10 transition-colors ${
                    activeLink === l.key ? "text-gold" : "text-pearl hover:text-gold"
                  }`}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.38 }}
              className="mt-10 space-y-3"
            >
              <a
                href="/#contact"
                onClick={() => setMobileOpen(false)}
                className="block text-center bg-gold text-navy text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-6 py-4 rounded hover:bg-pearl transition-colors"
              >
                Start a project
              </a>
              {settings.contactEmail && (
                <p className="text-center text-taupe text-xs tracking-widest font-[family-name:var(--font-montserrat)]">
                  {settings.contactEmail}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
