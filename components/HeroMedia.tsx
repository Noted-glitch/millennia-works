"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { HeroMediaType } from "@/lib/types";

interface HeroMediaProps {
  mediaType: HeroMediaType;
  videoUrl: string;
  videoPoster: string;
  imageUrl: string;
  /** Navy scrim opacity, 0–100. Higher = darker media = more legible headline. */
  overlayOpacity: number;
}

/**
 * Background media for the homepage hero (design system §6.2).
 *
 * Renders the CMS-configured video or image behind the headline, with a navy
 * scrim for legibility. Everything is absolutely positioned inside the hero
 * section, so it never affects layout (no CLS).
 *
 * Resilience:
 * - If the media type is "color", the URL is empty, or the asset fails to load,
 *   this renders nothing — the hero falls back to text on the navy background.
 * - Under prefers-reduced-motion, the video does not autoplay; a static frame
 *   (poster) is shown instead. Still images are unaffected.
 * - Video is desktop-only; mobile always gets the lighter poster image.
 */
export function HeroMedia({ mediaType, videoUrl, videoPoster, imageUrl, overlayOpacity }: HeroMediaProps) {
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);

  const hasVideo = mediaType === "video" && !!videoUrl;
  const hasImage = mediaType === "image" && !!imageUrl;

  if (failed || (!hasVideo && !hasImage)) return null;

  let media: React.ReactNode = null;

  if (hasVideo) {
    if (reduced) {
      // Motion suppressed: show a still frame rather than an autoplaying reel.
      media = videoPoster ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={videoPoster}
          alt=""
          aria-hidden="true"
          onError={() => setFailed(true)}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      ) : null;
    } else {
      media = (
        <>
          <video
            className="hidden md:block absolute inset-0 w-full h-full object-cover z-0"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={videoPoster || undefined}
            onError={() => setFailed(true)}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          {videoPoster && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={videoPoster} alt="" aria-hidden="true" className="md:hidden absolute inset-0 w-full h-full object-cover z-0" />
          )}
        </>
      );
    }
  } else if (hasImage) {
    media = (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={imageUrl}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        onError={() => setFailed(true)}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
    );
  }

  // Reduced-motion video with no poster leaves nothing to show → text fallback.
  if (!media) return null;

  return (
    <>
      {media}
      <div className="absolute inset-0 bg-navy z-[1]" style={{ opacity: overlayOpacity / 100 }} />
    </>
  );
}
