import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/metadata";
import { getCategoryPath, getToolPath } from "@/lib/seo/tool-routes";
import { tools } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/tools", getCategoryPath("Image"), getCategoryPath("PDF"), "/guides", "/guides/png-vs-jpg"];
  return [
    ...pages.map((path) => ({ url: new URL(path, siteUrl).toString(), changeFrequency: "monthly" as const })),
    ...tools.map((tool) => ({ url: new URL(getToolPath(tool), siteUrl).toString(), changeFrequency: "monthly" as const })),
  ];
}
