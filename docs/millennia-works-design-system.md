# Millennia Works — Design System & Premium Edge
### A synthesis of top-agency and luxury-brand web craft, applied to the Millennia Works brand

**How to use this document:** This is the master reference for elevating the site. It is grounded in the shared principles of the world's leading creative agencies (Pentagram, Collins, Instrument, MetaLab, Locomotive, Buck) and luxury houses (Aesop, Hermès, Aman, Rolex, Celine). Each section states the principle, why it works, and the exact implementation for Millennia Works. Hand sections of this to Claude Code as individual tasks — do not implement it all at once.

**The core thesis:** Millennia Works' existing foundation (deep navy, gold, Playfair Display, editorial restraint) is already the *correct* luxury system. The edge comes from executing it at the level the references do: scale, space, motion, and discipline. Do not change the brand. Sharpen it.

---

## 1. The Positioning Truth (read first)

What separates the top agencies from the up-and-comers is not decoration — it is **confidence expressed through restraint**:

- Luxury brands show *less* per screen, not more. Aesop's product pages are practically empty. Aman shows one image at a time.
- Top agencies let the *work* carry the site. Pentagram's site is almost brutally plain — the portfolio is everything.
- Nobody premium looks busy. Busy = trying. Calm = knowing.

**The single biggest edge for Millennia Works:** be the calmest, most confident site in the "up-and-coming creative agency" space, while everyone else chases gradients and effects. In a sea of kybridia-style energy, restrained authority *stands out*.

---

## 2. Color System (locked)

The existing palette is correct. Formalize it into exact tokens and rules:

| Token | Value | Use |
|---|---|---|
| `navy-950` | `#0D1830` | Page background (deepest sections, footer) |
| `navy-900` | `#12203D` | Primary canvas |
| `navy-800` | `#1A2C50` | Elevated surfaces, cards |
| `gold-500` | `#D4AF37` | Primary accent (existing site gold) — CTAs, key highlights |
| `gold-400` | `#E0C35C` | Hover/lift state of gold |
| `champagne` | `#E8E0D0` | Light text on navy, soft dividers |
| `cream` | `#F5F1E8` | Rare light-section background (use sparingly, 1–2 sections max) |
| `taupe` | `#8B7355` | Muted secondary text, captions |
| `ink` | `#0A0F1E` | Near-black for rare darkest moments |

**Rules (this is what luxury brands enforce):**
1. **Gold is scarce.** The #1 luxury color rule: the accent appears in small, deliberate doses — a button, a thin rule, an italic word. If gold covers more than ~5% of any screen, it's devalued. Scarcity = preciousness.
2. **Navy is constant.** One canvas. Light (cream) sections are a rare pacing device — like a breath — used at most twice per page.
3. **No gradients as decoration.** Flat, deep, confident color. A barely-perceptible navy-to-darker-navy vertical wash is acceptable; visible decorative gradients are not.
4. **Photography carries color.** The portfolio imagery (the gold lamp, the book covers) provides warmth and variety. The UI itself stays disciplined.

---

## 3. Typography (the biggest single upgrade available)

Luxury is typographic. Aesop, Celine, The Row — their sites are almost *only* typography. The current fonts are right; the **scale and space** are what to change.

**Faces (keep):**
- **Playfair Display** — display headlines only. Its high-contrast serifs are the brand's voice.
- **Montserrat / Inter** — UI, body, navigation.

**The upgrade — scale and air:**

| Element | Current tendency | Target |
|---|---|---|
| Hero headline | ~64–80px | **clamp(72px, 10vw, 160px)** — let it dominate the viewport |
| Section headlines | ~36–48px | **clamp(40px, 5vw, 88px)** |
| Body copy | ~16–18px | Keep 17–19px, but **max-width 60–68ch** and line-height 1.7 |
| Eyebrows/labels | small caps | 12–13px, letter-spacing 0.2em, taupe or gold |

**Rules:**
1. **One display moment per section.** A huge Playfair headline, then quiet body text. Contrast in scale = hierarchy = confidence.
2. **Italic as jewelry.** The existing pattern (*"offerings"*, *"Every discipline."*) is excellent — one italic gold word per headline, never more.
3. **Fewer words everywhere.** Every top-agency site says less than you'd expect. Cut body copy by a third. Short lines read as certainty.
4. **Generous line-height on body (1.6–1.8), tight on display (0.95–1.05).** This contrast is a signature of editorial luxury.

---

## 4. Space & Layout System

The most measurable difference between premium and average sites is **vertical space**. Aman and Aesop use section paddings that feel almost wasteful. That waste *is* the luxury.

**Spacing scale:** base-8 system — 8 / 16 / 24 / 40 / 64 / 104 / 168 / 272px.

**Rules:**
1. **Section padding: 160–240px top and bottom on desktop** (currently likely ~80–100). Mobile: 96–128px. This alone transforms perceived quality.
2. **One idea per viewport.** When the user stops scrolling anywhere, they should see one section, one message. If two sections crowd one screen, add space.
3. **12-column grid, wide gutters (32–40px), max content width ~1280–1360px,** with text blocks much narrower (60–68ch).
4. **Asymmetry as sophistication.** Not everything centered: alternate left-aligned and offset layouts between sections (headline left / supporting text right-offset). Top agencies use editorial asymmetry; template sites center everything.
5. **Thin gold rules (1px) as section punctuation** — a 40–64px wide hairline, not full-width dividers.

---

## 5. Motion System (the "alive" factor — what kybridia had, done luxuriously)

Motion is what made kybridia feel alive. Luxury motion is **slow, small, and eased** — Locomotive and Aman feel like silk, not bounce.

**The motion constitution:**

| Property | Value |
|---|---|
| Reveal animation | Fade + rise 24–32px |
| Duration | 0.8–1.2s (slow = expensive; fast = cheap) |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) everywhere |
| Stagger | 80–120ms between sibling elements |
| Hover transitions | 0.4–0.5s |
| Never | Bounce, elastic, spin, parallax deeper than ~10%, anything that draws attention to itself |

**Signature moves to implement:**
1. **Scroll reveals on everything** — headlines, cards, images fade-rise into view once, gently staggered.
2. **Line-reveal headlines** for hero + section titles: text masked and rising line by line (the single most "top agency" motion pattern; Locomotive's signature).
3. **Image scale-settle:** portfolio images load at scale(1.06) and settle to 1.0 over ~1.2s as they enter view.
4. **Hover lift on cards:** translateY(-6px) + deepen shadow + image scale(1.03), 0.45s.
5. **Underline draw on links:** gold underline animates left→right on hover.
6. **Page-level fade transitions** between routes (0.4–0.6s) if feasible.
7. **Respect `prefers-reduced-motion`** — all motion collapses to simple fades.

**One optional signature element:** a subtle custom cursor (small gold dot that scales up over links/portfolio items). Common on Awwwards-level agency sites; instantly signals craft. Desktop only. Skippable if it feels like too much.

---

## 6. Imagery & Portfolio Presentation

Top agencies are portfolio-first: the work IS the site.

1. **Full-bleed moments.** At least one portfolio image or reel presented full-viewport-width per page. Small contained thumbnails read as directory; huge images read as gallery.
2. **The hero should carry a visual.** The current text-only hero is the safest place to add impact: a slow, muted, looping background reel of the best work (lamp render, book, influencer) at ~20–30% opacity behind the headline — or a large offset hero image. Luxury sites almost never open with text alone.
3. **Consistent art direction on thumbnails:** uniform aspect ratio (4:3 or 3:2), consistent color grading toward warm/navy tones, generous padding within cards.
4. **Motion work shows motion:** video thumbnails auto-play muted on hover (or show a minimal gold play indicator).
5. **Captions in the editorial style:** small caps category label (gold), title in Playfair, one-line description in taupe. Never paragraphs on cards.

---

## 7. Component Details (the craft layer)

What separates handmade from template is detail discipline:

1. **Buttons:** rectangular or barely-rounded (2–4px radius). Pill buttons read consumer/playful; sharp corners read editorial/serious. Generous padding (18px 36px), letter-spaced uppercase 13px labels. Primary = gold fill/navy text; secondary = 1px gold outline, fills gold on hover (0.4s).
2. **Cards:** navy-800 surface, 1px champagne/10% border, no heavy shadows at rest — shadow appears only on hover-lift.
3. **Navigation:** slim (72–80px), transparent over hero, gains navy-950 background + hairline border on scroll. Links: 13px uppercase letterspaced with the gold underline-draw hover.
4. **Footer as a designed moment:** large Playfair sign-off line ("From Idea to Empire."), generous space, thin gold rule — top agencies treat footers as the closing page of a book, not a dumping ground.
5. **Forms:** the existing gold-bordered inputs are good; ensure focus states glow gold subtly (0.3s) and the dropdown matches (already planned).
6. **Iconography: almost none.** Luxury brands barely use icons — words and numbers ("01", "02" eyebrows — already in use, keep) do the work. Delete decorative icons wherever they exist.

---

## 8. What NOT to do (the discipline list)

The references are defined as much by what they refuse:

- No bright gradients, blobs, or playful illustration (the kybridia trap)
- No more than one accent color in the UI (gold stays alone)
- No emoji, no decorative icons, no badges
- No dense sections — when in doubt, split and add space
- No fast/bouncy animation — nothing under 0.4s except micro-feedback
- No stock photography — only real work and real renders
- No carousels that auto-rotate; user controls everything
- No shouting: minimal exclamation marks, no ALL-CAPS body copy, no "🔥 amazing"
- No fake urgency, counters, or popups — nothing that begs

---

## 9. Implementation Order (hand to Claude Code as separate tasks)

Sequenced by impact-per-effort. One task per Claude Code session; verify each visually before the next.

**Phase 1 — Space & Type (biggest visible upgrade, no new tech):**
Increase section paddings to the new scale; enlarge display type to the clamp() values; tighten body copy widths to 60–68ch; enforce the whitespace rules. *Prompt scope: global spacing + typography scale only. Zero structural change.*

**Phase 2 — Motion foundation:**
Add the scroll-reveal system (fade-rise, stagger, expo-out easing, reduced-motion support) and hover transitions (card lift, underline draw, image settle). *Prompt scope: motion only, using the exact values in §5.*

**Phase 3 — Hero impact:**
Add the visual hero (muted background reel or large offset image) with line-reveal headline animation. *Needs: your chosen hero media.*

**Phase 4 — Portfolio presentation:**
Full-bleed work moments, uniform thumbnail ratios, video-hover previews, editorial captions. 

**Phase 5 — Component polish:**
Buttons, nav scroll behavior, footer moment, form focus states, icon removal.

**Phase 6 (optional) — Signature details:**
Custom cursor, page transitions.

---

## 10. The one-line brief (if everything else is forgotten)

**Say less, make it bigger, slow it down, and let the work breathe.** That is the entire edge, and almost no up-and-coming agency has the discipline to do it.
