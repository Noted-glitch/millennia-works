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