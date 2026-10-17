"use client";

import dynamic from "next/dynamic";
import type { ToolCategory } from "@/lib/tools";

const ImageToolWorkspace = dynamic(
  () => import("./ImageToolWorkspace").then((module) => module.ImageToolWorkspace),
  { loading: () => <div className="interactive-loading" role="status">Loading image tools…</div> },
);

const PdfToolWorkspace = dynamic(
  () => import("./PdfToolWorkspace").then((module) => module.PdfToolWorkspace),
  { loading: () => <div className="interactive-loading" role="status">Loading PDF tools…</div> },
);

export function ToolWorkspace({ slug, category }: { slug: string; category: ToolCategory }) {
  return category === "PDF" ? <PdfToolWorkspace slug={slug} /> : <ImageToolWorkspace slug={slug} />;
}
