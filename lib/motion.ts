"use client";

import { useReducedMotion } from "framer-motion";

/**
 * Motion constitution — design system §5.
 *
 * Single source of truth for the public site's motion. Every value below is
 * the spec value; components import these instead of inlining literals so the
 * whole site animates as one system.
 *
 * prefers-reduced-motion: honored via useReducedMotion() inside useReveal().
 * When reduced, every reveal/hover collapses to a simple opacity fade (no
 * transform). Admin never imports this module, so admin motion is untouched.
 */

// Reveal easing — easeOutCubic. Distributes motion evenly across the duration
// (unlike expo-out, which front-loads ~80% of the move into the first ~250ms and
// reads as a "pop"). This is the "even glide" feel.
export const REVEAL_EASE: [number, number, number, number] = [0.215, 0.61, 0.355, 1];
// Expo-out — kept for hover interactions, where a crisp quick-then-settle is wanted.
export const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const REVEAL_DISTANCE = 36; // px — fade-rise offset
export const REVEAL_DURATION = 1.1; // s — reveal duration
export const REVEAL_STAGGER = 0.1; // s — between siblings (spec 80–120ms)
export const HOVER_DURATION = 0.5; // s — hover transitions
export const SETTLE_DURATION = 1.2; // s — image scale-settle on enter
export const SETTLE_SCALE = 1.06; // starting scale for image settle

// Deepened shadow for the card hover-lift.
export const CARD_LIFT_SHADOW = "0 24px 48px -16px rgba(0, 0, 0, 0.55)";

// Fires reveals slightly before the element is fully in view.
const VIEWPORT = { once: true, margin: "0px 0px -10% 0px" } as const;

/**
 * Reveal/hover prop factory that honors prefers-reduced-motion.
 * Call once at the top of a component; use the returned helpers per element.
 */
export function useReveal() {
  const reduced = !!useReducedMotion();

  return {
    reduced,

    /** Scroll-triggered fade-rise, fires once. Pass sibling index for stagger. */
    props(index = 0) {
      return {
        initial: reduced ? { opacity: 0 } : { opacity: 0, y: REVEAL_DISTANCE },
        whileInView: reduced ? { opacity: 1 } : { opacity: 1, y: 0 },
        viewport: VIEWPORT,
        transition: { duration: REVEAL_DURATION, ease: REVEAL_EASE, delay: index * REVEAL_STAGGER },
      };
    },

    /** Same fade-rise but fires on mount — for above-the-fold hero content. */
    onMount(index = 0) {
      return {
        initial: reduced ? { opacity: 0 } : { opacity: 0, y: REVEAL_DISTANCE },
        animate: reduced ? { opacity: 1 } : { opacity: 1, y: 0 },
        transition: { duration: REVEAL_DURATION, ease: REVEAL_EASE, delay: index * REVEAL_STAGGER },
      };
    },

    /** Hover-lift for cards: translateY + deepened shadow. Undefined when reduced. */
    cardHover() {
      if (reduced) return undefined;
      return { y: -6, boxShadow: CARD_LIFT_SHADOW, transition: { duration: HOVER_DURATION, ease: EXPO_OUT } };
    },

    /** Image scale-settle: loads at 1.06 and settles to 1.0 as it enters view. */
    imageSettle() {
      return {
        initial: reduced ? { scale: 1 } : { scale: SETTLE_SCALE },
        whileInView: { scale: 1 },
        viewport: VIEWPORT,
        transition: { duration: SETTLE_DURATION, ease: REVEAL_EASE },
      };
    },

    /** Above-the-fold image: fades in and settles scale on mount. */
    mountImage() {
      return {
        initial: reduced ? { opacity: 0 } : { opacity: 0, scale: SETTLE_SCALE },
        animate: reduced ? { opacity: 1 } : { opacity: 1, scale: 1 },
        transition: { duration: SETTLE_DURATION, ease: REVEAL_EASE },
      };
    },

    /** Masked line-reveal for a single headline line. Rises from below its own mask. */
    line(delay = 0) {
      return {
        initial: reduced ? { opacity: 0 } : { y: "110%" },
        animate: reduced ? { opacity: 1 } : { y: 0 },
        transition: { duration: REVEAL_DURATION, ease: REVEAL_EASE, delay },
      };
    },
  };
}
