import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LockKeyhole, Sparkles } from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";
import { Card } from "@/components/ui/Card";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About Image Converter",
  description: "Learn about Image Converter: free browser-based image and PDF tools, our product approach, and how we handle files.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main>
      <article className="container article-page">
        <nav aria-label="Breadcrumb" className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span aria-current="page">About</span></nav>
        <header className="article-header">
          <span className="eyebrow">ABOUT IMAGE CONVERTER</span>
          <h1>Useful file tools, made straightforward.</h1>
          <p>Image Converter is a web-based collection of free tools for common image and PDF tasks.</p>
        </header>
        <AdSlot variant="top" />
        <div className="article-body">
          <p>Our goal is to make routine file tasks easier to understand and complete. The tools cover image conversion, resizing, compression, cropping, rotation, vector tracing, and practical PDF page workflows.</p>
          <div className="about-values">
            <Card><span className="why-icon"><Sparkles size={19} /></span><h2>Focused on the task</h2><p>Each tool explains what it does, what it cannot do, and what to check before saving a result.</p></Card>
            <Card><span className="why-icon"><LockKeyhole size={19} /></span><h2>Browser-based processing</h2><p>Image and PDF files selected in the tools are processed locally in the browser and are not uploaded to our application servers.</p></Card>
          </div>
          <h2>Free to use</h2>
          <p>The tools do not require accounts or subscriptions. The site may display clearly separated advertising to support its operation; advertisements are not part of the tool controls.</p>
          <h2>Explore the tools</h2>
          <p>Browse the <Link href="/image-tools">image tools</Link> or <Link href="/pdf-tools">PDF tools</Link>, or read the <Link href="/guides">practical guides</Link>.</p>
          <p>Questions or feedback? Visit the <Link href="/contact">contact page</Link>.</p>
        </div>
        <AdSlot variant="bottom" />
        <Link href="/tools" className="text-link article-back">Explore all tools <ArrowRight size={16} /></Link>
      </article>
    </main>
  );
}
