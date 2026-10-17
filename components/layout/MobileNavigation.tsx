"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { imageTools, pdfTools } from "@/lib/tools";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mobile-nav">
      <button
        className="mobile-menu-button"
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="mobile-navigation-panel"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open && (
        <nav id="mobile-navigation-panel" className="mobile-nav-panel" aria-label="Mobile navigation">
          <Link href="/tools?category=image" onClick={() => setOpen(false)}>Image tools</Link>
          {imageTools.slice(0, 3).map((tool) => (
            <Link key={tool.slug} className="mobile-sub-link" href={`/tools/${tool.slug}`} onClick={() => setOpen(false)}>{tool.shortName}</Link>
          ))}
          <Link href="/tools?category=pdf" onClick={() => setOpen(false)}>PDF tools</Link>
          {pdfTools.slice(0, 3).map((tool) => (
            <Link key={tool.slug} className="mobile-sub-link" href={`/tools/${tool.slug}`} onClick={() => setOpen(false)}>{tool.shortName}</Link>
          ))}
          <Link href="/guides" onClick={() => setOpen(false)}>Guides</Link>
        </nav>
      )}
    </div>
  );
}
