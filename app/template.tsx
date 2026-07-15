"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Page-level fade transition (design system §5 point 6).
 *
 * A template re-mounts on every navigation, so this fades each route in on
 * arrival. Opacity-only and enter-only on purpose:
 * - opacity (not transform) keeps the fixed nav positioned correctly mid-fade;
 * - enter-only avoids App Router's janky exit-animation behaviour.
 * Reduced-motion users get no fade.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
