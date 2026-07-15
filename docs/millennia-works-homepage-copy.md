# Millennia Works — Homepage Positioning & Copy

**Purpose of this document:** the messaging and section structure for the homepage, built around the unified-agency model — one entity, one contact, one portfolio, made up of in-house specialists. Hand this to Claude Code to implement in the existing navy/gold editorial style. Copy is provided per section, with intent notes so the *why* is clear.

**Core positioning (the one idea the whole page serves):**
Millennia Works is not a freelancer and not a marketplace of separate experts — it is a single studio of specialists who work as one team. Whatever a project needs, the right expertise is already in-house. Clients hire the studio, not a person.

**Voice:** confident, restrained, editorial. Authority through calm, not hype. Short declarative lines. Navy/gold, Playfair for display. Avoid buzzword salad ("synergy", "cutting-edge", "one-stop-shop").

---

## 1. Hero

**Headline (display, Playfair):**
From Idea to Empire.

**Subhead:**
A studio of specialists — design, publishing, AI content, and development — working as one team to build brands that last.

**Primary CTA:** Start a Project
**Secondary CTA:** See the Work

*Intent:* Keep the existing tagline (it's strong and on-brand). The subhead does the new work — it says "studio of specialists / one team" in the first breath, establishing the unified-agency model immediately. Lead the reader to either the portfolio (proof) or contact (action).

---

## 2. The Positioning Statement (short, below hero)

**Heading:** One team. Every discipline.

**Body:**
Most projects don't fit neatly into one skill set. A book needs a cover, an interior, and a launch. A brand needs an identity, a website, and content that carries it. Millennia Works brings the specialists for each of those under one roof — so you brief one team, not five freelancers, and everything moves in the same direction.

*Intent:* This is the heart of the new story. It names the client's real problem (fragmented work across many hires) and positions the unified team as the solution. Single point of contact is the implicit promise.

---

## 3. Services (the service lines)

**Heading:** What we do

Present the service lines as capabilities of the one studio. Keep the flat-URL service pages you already built. Each card: name, one line, link to its page.

- **Brand & Creative** — Identity, design, and the visual language that makes a brand recognizable.
- **AI Content & Media** — AI-generated personas, imagery, and media, built for consistency and scale.
- **Publishing & Books** — Cover design, interior layout, and full production for print and digital.
- **Web & App Development** — Sites and applications built to perform and to last.
- **Digital Marketing** — Reaching the right audience and turning attention into growth.
- **Apps & Games** — Interactive products from concept to launch.

*Intent:* Present all lines, but the ordering matters — lead with your proven strengths (Brand & Creative, AI Content, Publishing) since those have real portfolio backing. The weaker/aspirational lines sit lower. This is where the per-service sub-brand accents will eventually live.

*Note on focus:* if you want the homepage to feel less like a flat menu, consider visually emphasizing the top 2–3 (larger cards / a "featured capabilities" treatment) and listing the rest more compactly. Being known for something beats listing everything equally.

---

## 4. Selected Work (portfolio proof)

**Heading:** Selected work

Pull the featured portfolio projects here (the ones flagged "featured" in the admin). Show 3–6, spanning at least two different service lines so the range is visible at a glance — e.g. the published book (Building From Scratch) next to an AI content piece.

**Supporting line:**
Real projects, delivered end to end.

*Intent:* This is the trust engine. A visitor's real question is "are these people real and can I do business with them?" Work answers it. Showing different *types* of work proves the "every discipline, one team" claim isn't just words. Do NOT populate with placeholder entries — real work only.

---

## 5. Why one team (the differentiator)

**Heading:** Why a studio, not a scatter of freelancers

**Body:**
Hiring separate specialists means managing separate people, timelines, and standards — and hoping they add up to something coherent. With Millennia Works, the specialists already work together. The person designing your cover talks to the person formatting your interior. The brand designer and the developer share one vision. You get the depth of a full team with the simplicity of a single point of contact.

*Intent:* Names the alternative (piecemeal freelancers) and why the unified model beats it — coherence + one contact. This is the argument that justifies the whole entity. Keep it calm and concrete, not salesy.

---

## 6. About / The Team (credibility, NOT a directory)

**Heading:** A team of specialists

**Body:**
Millennia Works is built from experts across design, publishing, AI, and technology — each bringing years of their own craft, now working under one name. When you work with Millennia Works, you get all of it: the right specialist for every part of the job, coordinated as one.

*Intent:* CRITICAL — this section builds credibility for the *entity*, not for individuals. Do NOT list experts with individual contact details, personal socials, or "hire this person" CTAs — that would undercut the single-entity model. Present the team as proof of depth, funneling to ONE contact path (Millennia Works). Naming individuals is optional; if named, they carry no separate contact route.

---

## 7. Testimonials

Pull from the testimonials section already built. Real, attributed quotes only. If empty, keep this section hidden until at least one genuine testimonial exists — do not use placeholders.

*Intent:* Social proof. One named, specific testimonial (e.g. from the Building From Scratch authors) outperforms several vague ones.

---

## 8. Final CTA

**Heading:** Let's build something that lasts.

**Body:**
Tell us what you're building. One team, ready for every part of it.

**CTA:** Start a Project → (contact form)

*Intent:* Single, unified call to action. Reinforces "one team" one last time and routes to the single contact path.

---

## Implementation notes for Claude Code

- Keep the existing navy/gold palette, Playfair/Montserrat/Inter type system, nav, and footer unchanged.
- This is a copy + section-structure update to the homepage — do not rebuild global chrome or other pages.
- Services section should link to the existing flat-URL service pages.
- Selected Work and Testimonials should pull from existing data (portfolio + testimonials admin), showing only items flagged "featured" / real entries — handle empty states gracefully (hide the section rather than showing placeholders).
- Single contact path throughout: every CTA routes to the Millennia Works contact form. No per-individual contact.
- Do not add any "hire an individual expert" routes or per-expert social links.
- Show the plan and which homepage files you'll touch before making changes.
