import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";
import { ToolCard } from "@/components/tools/ToolCard";
import { imageTools, pdfTools } from "@/lib/tools";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Free image & PDF tools",
  description: "Explore free online image and PDF tools that process files in your browser. No accounts or subscriptions required.",
  path: "/tools",
});

export default function ToolsPage({ searchParams }: PageProps<"/tools">) {
  return <Suspense fallback={<ToolsFallback />}><ToolsListing searchParams={searchParams} /></Suspense>;
}

async function ToolsListing({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { category } = await searchParams;
  const showImages = category !== "pdf";
  const showPdfs = category !== "image";
  return (
    <main><div className="container listing-page">
      <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span aria-current="page">Tools</span></div>
      <section className="listing-hero"><span className="eyebrow">THE TOOLBOX</span><h1>A tool for that.</h1><p>Free online tools for common image and PDF tasks. No account required. Process images and documents locally in your browser.</p><div className="listing-tabs"><Link className={!category ? "active" : ""} href="/tools">All tools <span>{imageTools.length + pdfTools.length}</span></Link><Link className={category === "image" ? "active" : ""} href="/tools?category=image">Image tools <span>{imageTools.length}</span></Link><Link className={category === "pdf" ? "active" : ""} href="/tools?category=pdf">PDF tools <span>{pdfTools.length}</span></Link></div></section>
      <AdSlot variant="top" />
      <ToolCatalog showImages={showImages} showPdfs={showPdfs} />
      <div className="listing-note"><p>All tools are free to use and don’t require an account.</p><Link href="/guides">Read about our privacy approach <ArrowRight size={15} /></Link></div>
    </div></main>
  );
}

function ToolsFallback() {
  return (
    <main><div className="container listing-page">
      <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span aria-current="page">Tools</span></div>
      <section className="listing-hero"><span className="eyebrow">THE TOOLBOX</span><h1>A tool for that.</h1><p>Free online tools for common image and PDF tasks. No account required. Process images and documents locally in your browser.</p><div className="listing-tabs"><Link className="active" href="/tools">All tools <span>{imageTools.length + pdfTools.length}</span></Link><Link href="/tools?category=image">Image tools <span>{imageTools.length}</span></Link><Link href="/tools?category=pdf">PDF tools <span>{pdfTools.length}</span></Link></div></section>
      <AdSlot variant="top" />
      <ToolCatalog showImages showPdfs />
      <div className="listing-note"><p>All tools are free to use and don’t require an account.</p><Link href="/guides">Read about our privacy approach <ArrowRight size={15} /></Link></div>
    </div></main>
  );
}

function ToolCatalog({ showImages, showPdfs }: { showImages: boolean; showPdfs: boolean }) {
  return <>
    {showImages && <section className="listing-section"><div className="listing-section-heading"><h2>Image tools</h2><span>{imageTools.length} tools</span></div><div className="tool-grid">{imageTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}</div></section>}
    {showPdfs && <section className="listing-section"><div className="listing-section-heading"><h2>PDF tools</h2><span>{pdfTools.length} tools</span></div><div className="tool-grid">{pdfTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}</div></section>}
  </>;
}
