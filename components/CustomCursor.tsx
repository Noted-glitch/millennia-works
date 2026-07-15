"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor (design system §5 signature) — a small gold dot that follows the
 * pointer and expands into a ring over interactive elements.
 *
 * Degrades hard:
 * - Renders nothing unless the device has a fine pointer AND hover (desktop).
 *   Touch / coarse pointers keep the native cursor.
 * - Disabled under prefers-reduced-motion (native cursor kept).
 * - Position is written straight to the element's transform inside a rAF — no
 *   React state per mousemove, so there is no re-render cost.
 * - pointer-events:none, so it never intercepts clicks.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const hover = window.matchMedia("(hover: hover)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (fine && hover && !reduced) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    if (!dot) return;

    document.documentElement.classList.add("cursor-custom");

    let raf = 0;
    let x = 0;
    let y = 0;

    const render = () => {
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = 0;
    };
    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      dot.style.opacity = "1";
      if (!raf) raf = requestAnimationFrame(render);
    };

    const INTERACTIVE = "a, button, [role='button'], [data-cursor='link'], label, summary";
    const over = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest(INTERACTIVE)) dot.classList.add("is-active");
    };
    const out = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest(INTERACTIVE)) dot.classList.remove("is-active");
    };
    const hide = () => { dot.style.opacity = "0"; };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over, { passive: true });
    document.addEventListener("mouseout", out, { passive: true });
    document.addEventListener("mouseleave", hide);

    return () => {
      document.documentElement.classList.remove("cursor-custom");
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      document.removeEventListener("mouseleave", hide);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={dotRef} aria-hidden="true" className="cursor-dot">
      <span className="cursor-dot-inner" />
    </div>
  );
}
