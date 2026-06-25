import type { Metadata } from "next";
import { Playfair_Display, Montserrat, Inter } from "next/font/google";
import { SettingsProvider } from "@/lib/settings-context";
import { getSettingsServer } from "@/lib/server/settings";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettingsServer();
  const ogImages = [{ url: settings.ogImageUrl || "/brand/og-fallback.png" }];
  return {
    metadataBase: new URL("https://millenniaworks.com"),
    title: settings.metaTitle,
    description: settings.metaDescription,
    keywords: [
      "creative agency",
      "digital agency",
      "AI content",
      "brand design",
      "web development",
      "Lagos",
      "Nigeria",
    ],
    openGraph: {
      title: settings.metaTitle,
      description: settings.metaDescription,
      url: "https://millenniaworks.com",
      siteName: "Millennia Works",
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: settings.metaTitle,
      description: settings.metaDescription,
      images: ogImages,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettingsServer();

  const sameAs = settings.socialLinks
    .map((l) => l.url)
    .filter(Boolean);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Millennia Works",
    url: "https://millenniaworks.com",
    logo: {
      "@type": "ImageObject",
      url: "https://millenniaworks.com/brand/logo-icon-gold.png",
    },
    description: settings.metaDescription || settings.tagline,
    slogan: settings.tagline,
    ...(settings.contactEmail && { email: settings.contactEmail }),
    ...(sameAs.length > 0 && { sameAs }),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Millennia Works",
    url: "https://millenniaworks.com",
    description: settings.metaDescription || settings.tagline,
  };

  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${montserrat.variable} ${inter.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationSchema, websiteSchema]).replace(/</g, "\\u003c"),
          }}
        />
        <SettingsProvider>{children}</SettingsProvider>
        <Analytics />
      </body>
    </html>
  );
}