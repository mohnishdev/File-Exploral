import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, FileImage } from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "PNG vs JPG: which image format should you use?",
  description: "Learn the practical differences between PNG and JPG, including transparency, compression, and when to choose each format.",
  path: "/guides/png-vs-jpg",
});

export default function PngVsJpgGuide() {
  return <main><article className="container article-page">
    <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href="/guides">Guides</Link><span>/</span><span aria-current="page">PNG vs JPG</span></div>
    <header className="article-header"><span className="eyebrow">IMAGE FORMATS · 5 MIN READ</span><h1>PNG or JPG: which image format should you use?</h1><p>Both formats are useful. The right choice depends on the kind of image and how you plan to use it.</p></header>
    <AdSlot variant="top" />
    <div className="article-body">
      <p>PNG and JPG (also written JPEG) are two widely used image formats. They make different trade-offs, so choosing between them can help match an image to its purpose.</p>
      <h2>Choose PNG when you need transparency</h2>
      <p>PNG supports transparent areas and is often a good fit for logos, interface graphics, diagrams, and images with crisp lines or text. It uses lossless compression, which preserves image data but can produce larger files.</p>
      <h2>Choose JPG for photographs</h2>
      <p>JPG is widely supported and uses lossy compression. It’s commonly useful for photographs, where smaller files can be more convenient. Repeatedly saving an edited JPG can reduce image quality.</p>
      <div className="article-callout"><FileImage size={20} /><p><strong>Quick rule:</strong> use PNG for transparency or sharp graphics; use JPG for most photographs when a smaller file is useful.</p></div>
      <h2>At a glance</h2>
      <div className="comparison-table" role="table" aria-label="PNG and JPG comparison">
        <div className="comparison-row comparison-head" role="row"><span role="columnheader">Feature</span><span role="columnheader">PNG</span><span role="columnheader">JPG</span></div>
        <div className="comparison-row" role="row"><span role="rowheader">Transparency</span><span role="cell"><Check size={15} /> Supported</span><span role="cell">Not supported</span></div>
        <div className="comparison-row" role="row"><span role="rowheader">Compression</span><span role="cell">Lossless</span><span role="cell">Lossy</span></div>
        <div className="comparison-row" role="row"><span role="rowheader">Often used for</span><span role="cell">Graphics, logos</span><span role="cell">Photographs</span></div>
      </div>
      <h2>Can you change one format to the other?</h2>
      <p>Yes, image software can export PNG images as JPG or JPG images as PNG. A format conversion does not restore image detail that was lost when a JPG was compressed, and JPG does not preserve transparent pixels.</p>
      <p>Need a conversion tool? Use the <Link href="/tools/png-to-jpg">PNG to JPG converter</Link> or <Link href="/tools/jpg-to-png">JPG to PNG converter</Link> to process an image in your browser.</p>
    </div>
    <AdSlot variant="bottom" />
    <Link href="/guides" className="text-link article-back"><ArrowRight size={16} /> Browse more guides</Link>
  </article></main>;
}
