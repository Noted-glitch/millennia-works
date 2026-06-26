import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-navy text-pearl">
      <SiteNav />

      <section className="min-h-[85vh] flex items-center justify-center px-6 pt-20">
        <div className="text-center max-w-lg">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-6 font-[family-name:var(--font-montserrat)]">404</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-normal leading-tight mb-6">
            Lost in the <span className="text-gold italic">empire.</span>
          </h1>
          <p className="text-champagne/70 text-base md:text-lg mb-12 max-w-sm mx-auto leading-relaxed">
            This page doesn&apos;t exist — but your next breakthrough might.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="inline-flex items-center justify-center text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] bg-gold text-navy px-8 py-4 rounded hover:bg-pearl transition-colors"
            >
              Back to home
            </a>
            <a
              href="/#contact"
              className="inline-flex items-center justify-center text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] border border-gold/30 text-gold px-8 py-4 rounded hover:bg-gold/10 transition-colors"
            >
              Start a project
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
