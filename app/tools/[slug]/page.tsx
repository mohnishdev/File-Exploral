import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { getLegacyToolPath } from "@/lib/seo/tool-routes";
import { tools } from "@/lib/tools";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tools/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!getLegacyToolPath(slug)) return {};
  return { robots: { index: false, follow: true } };
}

export default function ToolPage({ params }: PageProps<"/tools/[slug]">) {
  return (
    <Suspense fallback={<ToolPageFallback />}>
      <LegacyToolRedirect params={params} />
    </Suspense>
  );
}

async function LegacyToolRedirect({ params }: { params: Promise<{ slug: string }> }): Promise<never> {
  const { slug } = await params;
  const path = getLegacyToolPath(slug);
  if (!path) notFound();
  permanentRedirect(path);
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
