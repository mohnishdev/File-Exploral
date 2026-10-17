import Link from "next/link";
import { ArrowRight, Check, LockKeyhole } from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";
import { ToolCard } from "@/components/tools/ToolCard";
import type { Tool, ToolCategory } from "@/lib/tools";

type CategoryContent = {
  title: string;
  eyebrow: string;
  description: string;
  lead: string;
  groups: { title: string; description: string; tools: string[] }[];
  notes: { title: string; description: string }[];
};

const categoryContent: Record<ToolCategory, CategoryContent> = {
  Image: {
    title: "Image tools for everyday work",
    eyebrow: "IMAGE TOOLBOX",
    description: "Convert image formats, resize dimensions, reduce file size, crop, rotate, or trace artwork—all with browser-based tools.",
    lead: "Choose a task to find the right workflow. The original file is left unchanged while each tool creates a separate result for download.",
    groups: [
      { title: "Convert image formats", description: "Change formats when a website, editor, or delivery workflow needs a specific file type.", tools: ["png-to-jpg", "jpg-to-png", "png-to-webp", "jpg-to-webp", "webp-to-png", "webp-to-jpg"] },
      { title: "Adjust image dimensions and framing", description: "Prepare pixel dimensions and composition for a page, document, profile, or thumbnail.", tools: ["image-resizer", "image-cropper", "image-rotator"] },
      { title: "Optimize or vectorize", description: "Reduce raster file size or trace simple artwork into scalable paths. These are different operations with different trade-offs.", tools: ["image-compressor", "png-to-svg"] },
    ],
    notes: [
      { title: "Choose a format for the image", description: "PNG is useful for transparency and sharp graphics; JPG is common for photographs; WebP is supported by modern browsers and can reduce file size. Conversion cannot restore detail already lost in a lossy source." },
      { title: "Resize pixels, not just display size", description: "Use exact dimensions when a destination specifies them. Lock the aspect ratio to avoid stretching, and remember that enlarging does not create genuine image detail." },
      { title: "Treat vectorization as tracing", description: "PNG-to-SVG estimates vector paths from pixels. Clean logos, icons, signatures, and flat illustrations generally trace more predictably than photos or gradients." },
    ],
  },
  PDF: {
    title: "PDF tools for pages and documents",
    eyebrow: "PDF TOOLBOX",
    description: "Merge files, extract pages, reorganize a document, convert pages to images, or create a PDF from images.",
    lead: "Pick a document task and review the result before sharing. Browser processing keeps file handling on your device, with practical limits clearly described in each tool.",
    groups: [
      { title: "Organize PDF pages", description: "Combine documents, extract selected pages, or make page-level changes before saving.", tools: ["pdf-editor", "pdf-merge", "pdf-split"] },
      { title: "Convert between PDF and images", description: "Render selected PDF pages to raster images or assemble images into a document.", tools: ["pdf-to-jpg", "pdf-to-png", "jpg-to-pdf", "png-to-pdf"] },
      { title: "Optimize a PDF", description: "Re-save PDF structure in the browser and compare the resulting file size.", tools: ["pdf-compress"] },
    ],
    notes: [
      { title: "Page editing is not text editing", description: "The PDF editor can reorder, rotate, and remove whole pages. It does not rewrite characters or objects inside a page." },
      { title: "Choose image output intentionally", description: "JPG can suit photo pages; PNG can keep sharp edges cleaner. Either way, rendering a page to an image removes selectable text from that output." },
      { title: "Compression depends on the PDF", description: "The current browser-side optimizer repacks PDF objects but does not downsample embedded photos or scans. It may not reduce image-heavy documents." },
    ],
  },
};

export function ToolCategoryPage({ category, tools }: { category: ToolCategory; tools: Tool[] }) {
  const content = categoryContent[category];

  return (
    <main>
      <div className="container listing-page">
        <nav aria-label="Breadcrumb" className="breadcrumbs">
          <Link href="/">Home</Link><span>/</span><span aria-current="page">{content.title}</span>
        </nav>
        <header className="listing-hero">
          <span className="eyebrow">{content.eyebrow}</span>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
          <div className="category-trust">
            <span><Check size={14} /> Free to use</span>
            <span><Check size={14} /> No account</span>
            <span><LockKeyhole size={13} /> Processed in your browser</span>
          </div>
        </header>
        <AdSlot variant="top" />
        <p className="category-lead">{content.lead}</p>
        {content.groups.map((group) => {
          const groupTools = group.tools
            .map((slug) => tools.find((tool) => tool.slug === slug))
            .filter((tool): tool is Tool => tool !== undefined);
          return (
            <section className="listing-section category-tool-group" key={group.title}>
              <div className="listing-section-heading"><h2>{group.title}</h2><span>{groupTools.length} tools</span></div>
              <p>{group.description}</p>
              <div className="tool-grid">{groupTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}</div>
            </section>
          );
        })}
        <AdSlot variant="middle" />
        <section className="category-guidance">
          <span className="eyebrow">A FEW THINGS TO KNOW</span>
          <div className="category-guidance-grid">
            {content.notes.map((note) => <article key={note.title}><h2>{note.title}</h2><p>{note.description}</p></article>)}
          </div>
        </section>
        <section className="category-privacy">
          <div><span className="eyebrow">PRIVATE BY DESIGN</span><h2>Your files stay on your device.</h2><p>These tools process the files you select in your browser. Files are not sent to our servers or saved to an account. Reset a tool or leave the page to clear temporary previews and file references.</p></div>
          <Link href="/guides" className="text-link">Read our guides <ArrowRight size={15} /></Link>
        </section>
      </div>
    </main>
  );
}
