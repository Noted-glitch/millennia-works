import { PROJECT_CATEGORIES, type SiteSettings } from "@/lib/types";

export const DEFAULT_SETTINGS: SiteSettings = {
  contactEmail: "david@millenniaworks.com",
  tagline: "From Idea To Empire",

  heroEyebrow: "Millennia Works",
  heroTitleLine1: "From Idea",
  heroTitleLine2: "To Empire.",
  heroSubtitle: "A studio of specialists — design, publishing, AI content, and development — working as one team to build brands that last.",
  heroCtaPrimaryLabel: "Start a Project",
  heroCtaSecondaryLabel: "See the Work",

  heroMediaType: "color",
  heroVideoUrl: "",
  heroVideoPoster: "",
  heroImageUrl: "",
  heroOverlayOpacity: 60,

  aboutEyebrow: "Who we are",
  aboutTitle: "A team of specialists.",
  aboutBody: "Millennia Works is built from experts across design, publishing, AI, and technology — each bringing years of their own craft, now working under one name. When you work with Millennia Works, you get all of it: the right specialist for every part of the job, coordinated as one.",

  contactCtaHeadline: "Let's build something that lasts.",
  contactCtaSubhead: "Tell us what you're building. One team, ready for every part of it.",
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
