import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getRelatedToolNames } from "./ToolPageLayout";
import { getToolPath } from "@/lib/seo/tool-routes";

export function RelatedTools({ slugs }: { slugs: string[] }) {
  const related = getRelatedToolNames(slugs);
  return (
    <section className="content-section related-section">
      <div className="related-heading"><div><span className="eyebrow">KEEP EXPLORING</span><h2>Related tools</h2></div><Link href="/tools">Browse all tools <ArrowUpRight size={15} /></Link></div>
      <div className="related-grid">{related.map((tool) => { const Icon = tool.icon; return <Link href={getToolPath(tool)} className="related-card" key={tool.slug}><span className="tool-card-icon"><Icon size={18} /></span><span><strong>{tool.shortName}</strong><small>{tool.category} tool</small></span><ArrowUpRight className="related-arrow" size={16} /></Link>; })}</div>
    </section>
  );
}
