import type { Metadata } from "next";
import { ToolCategoryPage } from "@/components/tools/ToolCategoryPage";
import { createPageMetadata } from "@/lib/seo/metadata";
import { createBreadcrumbSchema, createToolCollectionSchema, serializeJsonLd } from "@/lib/seo/structured-data";
import { imageTools } from "@/lib/tools";

export const metadata: Metadata = createPageMetadata({
  title: "Free Online Image Tools",
  description: "Convert, resize, crop, rotate, compress, and vectorize image files with free browser-based tools. No account required.",
  path: "/image-tools",
});

export default function ImageToolsPage() {
  const breadcrumbSchema = createBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Image tools", path: "/image-tools" }]);
  return (
    <>
      <ToolCategoryPage category="Image" tools={imageTools} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(createToolCollectionSchema("Image", imageTools)) }} />
    </>
  );
}
