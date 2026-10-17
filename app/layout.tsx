import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { createPageMetadata, siteDescription, siteUrl } from "@/lib/seo/metadata";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], display: "swap", variable: "--font-geist" });

export const metadata: Metadata = {
  ...createPageMetadata({ title: "Free online image & PDF tools", description: siteDescription }),
  metadataBase: new URL(siteUrl),
  title: { default: "Free online image & PDF tools", template: "%s | Image Converter" },
  applicationName: "Image Converter",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable}>
      <body><Header />{children}<Footer /></body>
    </html>
  );
}
