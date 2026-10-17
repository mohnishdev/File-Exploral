import type { Tool } from "@/lib/tools";
import { siteName, siteUrl } from "./metadata";
import { getCategoryPath, getToolPath } from "./tool-routes";
import { getToolPageSeo } from "./tool-pages";

export function createBreadcrumbSchema(items: { name: string; path?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: new URL(item.path, siteUrl).toString() } : {}),
    })),
  };
}

export function createToolSchema(tool: Tool) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: getToolPageSeo(tool)?.description ?? tool.description,
    applicationCategory: tool.category === "Image" ? "MultimediaApplication" : "UtilitiesApplication",
    operatingSystem: "Web browser",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: new URL(getToolPath(tool), siteUrl).toString(),
    publisher: { "@type": "Organization", name: siteName, url: siteUrl },
  };
}

export function createToolCollectionSchema(category: "Image" | "PDF", tools: Tool[]) {
  const categoryPath = getCategoryPath(category);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category === "Image" ? "Image Tools" : "PDF Tools",
    url: new URL(categoryPath, siteUrl).toString(),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tools.length,
      itemListElement: tools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: tool.name,
        url: new URL(getToolPath(tool), siteUrl).toString(),
      })),
    },
  };
}

export function serializeJsonLd(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
