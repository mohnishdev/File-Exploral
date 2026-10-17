import type { Tool, ToolCategory } from "@/lib/tools";
import { tools } from "@/lib/tools";

const pdfRouteSlugs: Record<string, string> = {
  "pdf-merge": "merge-pdf",
  "pdf-split": "split-pdf",
  "pdf-compress": "compress-pdf",
};

export function getCategoryPath(category: ToolCategory) {
  return category === "Image" ? "/image-tools" : "/pdf-tools";
}

export function getToolPath(tool: Pick<Tool, "category" | "slug">) {
  const routeSlug = tool.category === "PDF" ? pdfRouteSlugs[tool.slug] ?? tool.slug : tool.slug;
  return `${getCategoryPath(tool.category)}/${routeSlug}`;
}

export function getToolPathBySlug(slug: string) {
  const tool = tools.find((item) => item.slug === slug);
  if (!tool) throw new Error(`No tool route is registered for "${slug}".`);
  return getToolPath(tool);
}

export function getToolByRoute(category: string, routeSlug: string) {
  return tools.find((tool) => {
    const [, toolCategory, toolSlug] = getToolPath(tool).split("/");
    return toolCategory === category && toolSlug === routeSlug;
  });
}

export function getLegacyToolPath(slug: string) {
  const tool = tools.find((item) => item.slug === slug);
  return tool ? getToolPath(tool) : undefined;
}
