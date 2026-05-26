"use client";

import { useSettings } from "@/lib/settings-context";

export function SiteFooter() {
  const { settings } = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="py-12 px-6 border-t border-gold/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="font-[family-name:var(--font-playfair)] text-xl tracking-wider text-gold mb-1">Millennia Works</p>
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
