import type { NextConfig } from "next";

const SERVICE_SLUGS = [
  "brand-creative",
  "ai-content-media",
  "web-app-development",
  "digital-marketing",
  "publishing-books",
  "apps-games",
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  async redirects() {
    return [
      // 301s for each old /services/[slug] → /[slug]
      ...SERVICE_SLUGS.map((slug) => ({
        source: `/services/${slug}`,
        destination: `/${slug}`,
        permanent: true,
      })),
      // /services (no slug) → homepage services section
      {
        source: "/services",
        destination: "/#services",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
