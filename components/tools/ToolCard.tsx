import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Tool } from "@/lib/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  return (
    <Link href={`/tools/${tool.slug}`} className="tool-card">
      <span className="tool-card-icon"><Icon size={19} /></span>
      <span className="tool-card-copy"><strong>{tool.shortName}</strong><small>{tool.description}</small></span>
      <ArrowUpRight className="tool-card-arrow" size={17} />
    </Link>
  );
}
