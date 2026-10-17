import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, BookOpen, FileText } from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Image & PDF guides",
  description: "Straightforward guides to image formats, PDFs, and everyday file tasks.",
  path: "/guides",
});

export default function GuidesPage() {
  return <main><div className="container listing-page">
    <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span aria-current="page">Guides</span></div>
    <section className="listing-hero"><Badge>THE RESOURCE LIBRARY</Badge><h1>Make file formats<br />make sense.</h1><p>Practical, straightforward guides for choosing image formats and working with PDF files.</p></section>
    <AdSlot variant="top" />
    <section className="guides-grid">
      <Link href="/guides/png-vs-jpg" className="guide-tile"><Card><span className="guide-icon"><BookOpen size={19} /></span><span className="eyebrow">IMAGE FORMATS · 5 MIN READ</span><h2>PNG or JPG: which image format should you use?</h2><p>Understand transparency, image quality, and file size so you can choose the right format.</p><span className="guide-link">Read guide <ArrowUpRight size={15} /></span></Card></Link>
      <Card className="guide-coming"><span className="guide-icon"><FileText size={19} /></span><span className="eyebrow">PDF BASICS · COMING SOON</span><h2>PDFs made a little simpler</h2><p>We’re working on practical explainers for common document tasks and file formats.</p></Card>
    </section>
  </div></main>;
}
