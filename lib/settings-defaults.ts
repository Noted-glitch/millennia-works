import { PROJECT_CATEGORIES, type SiteSettings } from "@/lib/types";

export const DEFAULT_SETTINGS: SiteSettings = {
  contactEmail: "david@millenniaworks.com",
  tagline: "From Idea To Empire",

  heroEyebrow: "Millennia Works",
  heroTitleLine1: "From Idea",
  heroTitleLine2: "To Empire.",
  heroSubtitle: "Premium brand, content, and digital agency for founders building what lasts.",
  heroCtaPrimaryLabel: "Start a project",
  heroCtaSecondaryLabel: "View our work",

  heroMediaType: "color",
  heroVideoUrl: "",
  heroVideoPoster: "",
  heroImageUrl: "",
  heroOverlayOpacity: 60,

  aboutEyebrow: "Who we are",
  aboutTitle: "We build the digital infrastructure behind ambitious brands.",
  aboutBody: "Millennia Works is a full-service creative and digital agency built for founders who refuse to compete on price. We combine brand strategy, AI-powered content, world-class development, and sharp marketing into a single, integrated practice — so every piece of your empire moves in the same direction.",

  contactCtaHeadline: "Ready to build your empire?",
  contactCtaSubhead: "Tell us about what you're building.",
  contactCtaButtonLabel: "Send inquiry",
  responseTimePromise: "We respond within 24 hours.",
  whatsappNumber: "",
  bookingLink: "",

  metaTitle: "Millennia Works — From Idea To Empire",
  metaDescription: "Premium brand, content, and digital agency for founders building what lasts.",
  ogImageUrl: "",

  announcementBar: {
    enabled: false,
    text: "",
    linkLabel: "",
    linkUrl: "",
  },

  servicesEnabled: Object.fromEntries(PROJECT_CATEGORIES.map((c) => [c, true])),

  socialLinks: [],
};
