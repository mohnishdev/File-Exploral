import type { Metadata } from "next";
import { ToolCategoryPage } from "@/components/tools/ToolCategoryPage";
import { createPageMetadata } from "@/lib/seo/metadata";
import { createBreadcrumbSchema, createToolCollectionSchema, serializeJsonLd } from "@/lib/seo/structured-data";
import { pdfTools } from "@/lib/tools";

export const metadata: Metadata = createPageMetadata({
  title: "Free Online PDF Tools",
  description: "Merge, split, organize, convert, and optimize PDF files with free browser-based tools. No account required.",
  path: "/pdf-tools",
});

export default function PdfToolsPage() {
  const breadcrumbSchema = createBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "PDF tools", path: "/pdf-tools" }]);
  return (
    <>
      <ToolCategoryPage category="PDF" tools={pdfTools} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(createToolCollectionSchema("PDF", pdfTools)) }} />
    </>
  );
}
