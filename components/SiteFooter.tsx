"use client";

import Image from "next/image";
import { useSettings } from "@/lib/settings-context";

export function SiteFooter() {
  const { settings } = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="py-12 px-6 border-t border-gold/10">
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
              <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">{s.label}</a>
            ))}
          </div>
        )}

        <p className="text-taupe text-xs">© {year} Millennia Works. All rights reserved.</p>
      </div>
    </footer>
  );
}
