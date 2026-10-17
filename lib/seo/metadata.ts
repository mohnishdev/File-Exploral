import type { Metadata } from "next";

export const siteName = "Image Converter";
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://imageconverter.example"
);
export const siteUrl = new URL(configuredSiteUrl).toString();
export const siteDescription =
  "Free online image and PDF tools, with no account required. Simple utilities with clear privacy information.";

export function createPageMetadata({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const canonical = new URL(path, siteUrl).toString();

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
