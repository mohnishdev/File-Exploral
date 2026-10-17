"use client";

import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { tools } from "@/lib/tools";

export function ToolSearch() {
  const [query, setQuery] = useState("");
  const results = useMemo(
    () => query.trim()
      ? tools.filter((tool) => `${tool.name} ${tool.category} ${tool.keywords.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 5)
      : [],
    [query],
  );

  return (
    <div className="tool-search-wrap">
      <label className="tool-search">
        <Search size={19} aria-hidden="true" />
        <span className="sr-only">Search image and PDF tools</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What would you like to do?" autoComplete="off" />
        <span className="search-shortcut">⌘ K</span>
      </label>
      {results.length > 0 && <div className="search-results" role="listbox" aria-label="Matching tools">{results.map((tool) => <Link key={tool.slug} href={`/tools/${tool.slug}`} onClick={() => setQuery("")} role="option"><span>{tool.shortName}</span><ArrowRight size={15} /></Link>)}</div>}
      {query.trim() && results.length === 0 && <div className="search-results search-empty" role="status">No tools found. Try “PNG” or “PDF”.</div>}
    </div>
  );
}
