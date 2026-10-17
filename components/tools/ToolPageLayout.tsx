import Link from "next/link";
import { Check, LockKeyhole } from "lucide-react";
import type { Tool } from "@/lib/tools";
import { getTool } from "@/lib/tools";
import { AdSlot } from "@/components/ads/AdSlot";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ToolFAQ } from "./ToolFAQ";
import { RelatedTools } from "./RelatedTools";
import { ToolWorkspace } from "./ToolWorkspace";
import { toolContent, toolFaqs } from "@/lib/tool-content";
import { PngToSvgGuide } from "./PngToSvgGuide";

export function ToolPageLayout({ tool }: { tool: Tool }) {
  return (
    <main>
      <div className="container tool-page">
        <nav aria-label="Breadcrumb" className="breadcrumbs">
          <Link href="/">Home</Link><span>/</span><Link href="/tools">Tools</Link><span>/</span><span aria-current="page">{tool.shortName}</span>
        </nav>
        <section className="tool-hero">
          <div className="tool-copy">
            <Badge>{tool.category} tool</Badge>
            <h1>{tool.name}</h1>
            <p>{tool.description}</p>
            <div className="tool-trust"><span><Check size={15} /> Free to use</span><span><Check size={15} /> No account</span><span><LockKeyhole size={14} /> Runs in your browser</span></div>
          </div>
          <ToolWorkspace slug={tool.slug} category={tool.category} />
        </section>
        <AdSlot variant="top" />
        <section className="content-section how-section">
          <div className="section-heading"><Badge>Simple by design</Badge><h2>How to use {tool.shortName}</h2><p>Follow a few straightforward steps and download the result when it’s ready.</p></div>
          <div className="steps-grid">
            {tool.steps.map((step, index) => <Card key={step} className="step-card"><span className="step-number">0{index + 1}</span><h3>{step}</h3></Card>)}
          </div>
        </section>
        <AdSlot variant="middle" />
        <section className="tool-explanation">
          <span className="eyebrow">A LITTLE MORE DETAIL</span>
          <h2>{tool.name}: what to know</h2>
          <p>{toolContent[tool.slug]}</p>
        </section>
        {tool.slug === "png-to-svg" && <PngToSvgGuide />}
        <section className="content-section features-section">
          <div className="section-heading"><Badge>Made to be useful</Badge><h2>What to expect</h2><p>Just the essentials: an understandable interface and honest information about how the tool works.</p></div>
          <div className="feature-grid">
            {tool.features.map((feature) => <Card key={feature} className="feature-card"><span className="check-icon"><Check size={16} /></span><div><h3>{feature}</h3><p>A focused experience without unnecessary steps or account requirements.</p></div></Card>)}
          </div>
        </section>
        <section className="format-strip"><div><span className="eyebrow">SUPPORTED FORMATS</span><h2>Designed around {tool.keywords.join(" and ")}</h2></div><div className="format-list">{tool.formats.map((format) => <span key={format}>{format}</span>)}</div></section>
        <section className="privacy-panel"><div className="privacy-illustration"><LockKeyhole size={23} /></div><div><span className="eyebrow">A privacy-first approach</span><h2>Your files stay on this device.</h2><p>This tool processes the file in your browser. The file is not sent to our servers or stored in an account. Resetting the tool clears its temporary previews and file references from this page.</p></div></section>
        <ToolFAQ faqs={[...tool.faqs.slice(0, 2), ...(toolFaqs[tool.slug] ?? [])]} />
        <RelatedTools slugs={tool.related} />
        <AdSlot variant="bottom" />
      </div>
    </main>
  );
}

export function getRelatedToolNames(slugs: string[]) {
  return slugs.map((slug) => getTool(slug)).filter((tool): tool is Tool => Boolean(tool));
}
