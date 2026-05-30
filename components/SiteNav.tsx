"use client";

import Image from "next/image";
import { useSettings } from "@/lib/settings-context";

export type SiteNavActiveLink = "home" | "services" | "about" | "work" | "blog" | "contact" | null;

const LINKS: { key: Exclude<SiteNavActiveLink, null>; label: string; href: string }[] = [
  { key: "services", label: "Services", href: "/#services" },
  { key: "about", label: "About", href: "/#about" },
  { key: "work", label: "Work", href: "/#work" },
  { key: "blog", label: "Blog", href: "/blog" },
  { key: "contact", label: "Contact", href: "/#contact" },
];

export function SiteNav({ activeLink = null }: { activeLink?: SiteNavActiveLink } = {}) {
  const { settings } = useSettings();
  const bar = settings.announcementBar;

  return (
    <>
      {bar.enabled && bar.text && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-graphite border-b border-gold/20 px-6 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] text-gold text-center flex-wrap">
            <span>{bar.text}</span>
            {bar.linkUrl && bar.linkLabel && (
              <a href={bar.linkUrl} className="underline decoration-gold/40 hover:decoration-gold transition-colors">{bar.linkLabel} →</a>
            )}
          </div>
        </div>
      )}

      <nav className={`fixed left-0 right-0 z-50 backdrop-blur-md bg-navy/70 border-b border-gold/10 ${bar.enabled && bar.text ? "top-[42px]" : "top-0"}`}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <a href="/" className="inline-flex items-center" aria-label="Millennia Works home">
            <Image
              src="/brand/logo-icon-gold.png"
              alt="Millennia Works"
              width={64}
              height={64}
              priority
              className="h-10 md:h-12 w-auto"
            />
          </a>
          <div className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] text-pearl/80">
            {LINKS.map((l) => (
              <a key={l.key} href={l.href} className={`transition-colors ${activeLink === l.key ? "text-gold" : "hover:text-gold"}`}>{l.label}</a>
            ))}
          </div>
          <a href="/#contact" className="text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] bg-gold text-navy px-5 py-2.5 rounded hover:bg-gold/90 transition-colors">Start a project</a>
        </div>
      </nav>
    </>
  );
}
