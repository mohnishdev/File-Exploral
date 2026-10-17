import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/metadata";
import { tools } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/tools", "/guides", "/guides/png-vs-jpg"];
  return [
    ...pages.map((path) => ({ url: new URL(path, siteUrl).toString(), changeFrequency: "monthly" as const })),
    ...tools.map((tool) => ({ url: new URL(`/tools/${tool.slug}`, siteUrl).toString(), changeFrequency: "monthly" as const })),
  ];
}
