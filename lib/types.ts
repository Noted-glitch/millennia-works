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