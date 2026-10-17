import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { getTool, tools } from "@/lib/tools";
import { createPageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tools/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return createPageMetadata({ title: tool.name, description: tool.description, path: `/tools/${tool.slug}` });
}

export default function ToolPage({ params }: PageProps<"/tools/[slug]">) {
  return (
    <Suspense fallback={<ToolPageFallback />}>
      <ToolPageContent params={params} />
    </Suspense>
  );
}

async function ToolPageContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();
  return <ToolPageLayout tool={tool} />;
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
