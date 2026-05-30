import type { Metadata } from "next";
import { Playfair_Display, Montserrat, Inter } from "next/font/google";
import { SettingsProvider } from "@/lib/settings-context";
import { getSettingsServer } from "@/lib/server/settings";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${montserrat.variable} ${inter.variable} antialiased`}
      >
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}