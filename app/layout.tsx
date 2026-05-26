import type { Metadata } from "next";
import { Playfair_Display, Montserrat, Inter } from "next/font/google";
import { SettingsProvider } from "@/lib/settings-context";
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

export const metadata: Metadata = {
  title: "Millennia Works — From Idea To Empire",
  description:
    "Premium brand, content, and digital agency for founders building what lasts. Brand strategy, AI media, web development, marketing, publishing, and apps.",
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
    title: "Millennia Works — From Idea To Empire",
    description:
      "Premium brand, content, and digital agency for founders building what lasts.",
    url: "https://millenniaworks.com",
    siteName: "Millennia Works",
    type: "website",
  },
};

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