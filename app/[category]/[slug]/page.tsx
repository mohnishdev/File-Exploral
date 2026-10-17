import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getToolPageSeo } from "@/lib/seo/tool-pages";
import { createBreadcrumbSchema, createToolSchema, serializeJsonLd } from "@/lib/seo/structured-data";
import { getToolByRoute, getToolPath } from "@/lib/seo/tool-routes";
import { tools } from "@/lib/tools";

export function generateStaticParams() {
  return tools.map((tool) => {
    const [, category, slug] = getToolPath(tool).split("/");
    return { category, slug };
  });
}

export async function generateMetadata({ params }: PageProps<"/[category]/[slug]">): Promise<Metadata> {
  const { category, slug } = await params;
  const tool = getToolByRoute(category, slug);
  if (!tool) return {};
  const seo = getToolPageSeo(tool);
  const pagePath = `/${category}/${slug}`;
  return createPageMetadata({
    title: seo?.title ?? tool.name,
    description: seo?.description ?? tool.description,
    path: pagePath,
  });
}

export default function CanonicalToolPage({ params }: PageProps<"/[category]/[slug]">) {
  return <Suspense fallback={<ToolPageFallback />}><ToolPageContent params={params} /></Suspense>;
}

async function ToolPageContent({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const tool = getToolByRoute(category, slug);
  if (!tool) notFound();
  const categoryName = tool.category === "Image" ? "Image tools" : "PDF tools";
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: categoryName, path: `/${category}` },
    { name: tool.shortName, path: `/${category}/${slug}` },
  ]);

  return (
    <>
      <ToolPageLayout tool={tool} categoryPath={`/${category}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(createToolSchema(tool)) }} />
    </>
  );
}

function ToolPageFallback() {
  return (
    <main aria-busy="true" aria-label="Loading tool">
      <div className="container tool-page">
        <div className="breadcrumbs"><span>Home</span><span>/</span><span>Tools</span></div>
        <div className="tool-loading" role="status">Loading tool…</div>
      </div>
    </main>
  );
}
