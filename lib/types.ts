export interface Project {
  id?: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  client: string;
  year: string;
  projectUrl: string;
  featured: boolean;
  order: number;
  createdAt?: number;
  updatedAt?: number;
}

export const PROJECT_CATEGORIES = [
  "Brand & Creative",
  "AI Content & Media",
  "Web & App Development",
  "Digital Marketing",
  "Publishing & Books",
  "Apps & Games",
] as const;

export interface Testimonial {
  id?: string;
  quote: string;
  clientName: string;
  role: string;
  company: string;
  category: string;
  photoUrl?: string;
  featured: boolean;
  order: number;
  createdAt?: number;
  updatedAt?: number;
}

export const INQUIRY_STATUSES = ["new", "read", "replied", "archived"] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export interface Inquiry {
  id?: string;
  name: string;
  email: string;
  message: string;
  company?: string;
  projectType?: string;
  status: InquiryStatus;
  notes?: string;
  createdAt?: number;
  updatedAt?: number;
}

export const BLOG_STATUSES = ["draft", "published"] as const;
export type BlogStatus = (typeof BLOG_STATUSES)[number];

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  category: string;
  author: string;
  status: BlogStatus;
  publishedAt?: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface Service {
  id?: string;
  title: string;
  slug: string;
  category: string;
  tag: string;
  shortDescription: string;
  longDescription: string;
  bullets: string[];
  coverImageUrl?: string;
  order: number;
  featured: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export type HeroMediaType = "color" | "video" | "image";

export interface AnnouncementBar {
  enabled: boolean;
  text: string;
  linkLabel: string;
  linkUrl: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

export type ServicesEnabled = Record<string, boolean>;

export interface SiteSettings {
  contactEmail: string;
  tagline: string;

  heroEyebrow: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  heroCtaPrimaryLabel: string;
  heroCtaSecondaryLabel: string;

  heroMediaType: HeroMediaType;
  heroVideoUrl: string;
  heroVideoPoster: string;
  heroImageUrl: string;
  heroOverlayOpacity: number;

  aboutEyebrow: string;
  aboutTitle: string;
  aboutBody: string;

  contactCtaHeadline: string;
  contactCtaSubhead: string;
  contactCtaButtonLabel: string;
  responseTimePromise: string;
  whatsappNumber: string;
  bookingLink: string;

  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;

  announcementBar: AnnouncementBar;

  servicesEnabled: ServicesEnabled;

  socialLinks: SocialLink[];

  updatedAt?: number;
}