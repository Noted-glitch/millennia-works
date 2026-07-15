/**
 * GhostWord — a very large, faint Playfair word that sits behind a section
 * heading as a quiet backdrop anchor (per the editorial luxury system).
 *
 * Rules baked in:
 * - Non-interactive: pointer-events-none, select-none, aria-hidden (invisible
 *   to assistive tech — it's decoration, the real heading carries the meaning).
 * - Legibility-safe: z-0 with ~6% gold on navy; the real heading is rendered
 *   above it at z-10 by the caller.
 * - Overflow-safe: the host section must be overflow-hidden — an oversized word
 *   is then clipped at the section box and never widens the document.
 * - Desktop-only: hidden below md, where it would just be clutter.
 *
 * Place inside a `relative` ancestor; it centres on that ancestor's box.
 */
export function GhostWord({ children }: { children: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none select-none hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 whitespace-nowrap font-[family-name:var(--font-playfair)] font-normal leading-none tracking-tight text-gold/[0.06] text-[clamp(5rem,13vw,13rem)]"
    >
      {children}
    </span>
  );
}
