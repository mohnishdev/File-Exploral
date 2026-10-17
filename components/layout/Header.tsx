import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { imageTools, pdfTools } from "@/lib/tools";
import { getCategoryPath, getToolPath } from "@/lib/seo/tool-routes";
import { Brand } from "./Brand";
import { MobileNavigation } from "./MobileNavigation";

export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner container">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          <div className="nav-menu">
            <Link href={getCategoryPath("Image")} className="nav-link">Image tools <ChevronDown size={14} /></Link>
            <div className="nav-dropdown">
              <p className="menu-label">Popular image tools</p>
              {imageTools.slice(0, 4).map((tool) => (
                <Link key={tool.slug} href={getToolPath(tool)} className="menu-item">{tool.shortName}</Link>
              ))}
              <Link href={getCategoryPath("Image")} className="menu-all">Explore image tools <span aria-hidden="true">→</span></Link>
            </div>
          </div>
          <div className="nav-menu">
            <Link href={getCategoryPath("PDF")} className="nav-link">PDF tools <ChevronDown size={14} /></Link>
            <div className="nav-dropdown">
              <p className="menu-label">PDF tools</p>
              {pdfTools.slice(0, 4).map((tool) => (
                <Link key={tool.slug} href={getToolPath(tool)} className="menu-item">{tool.shortName}</Link>
              ))}
              <Link href={getCategoryPath("PDF")} className="menu-all">Explore PDF tools <span aria-hidden="true">→</span></Link>
            </div>
          </div>
          <Link href="/guides" className="nav-link">Guides</Link>
        </nav>
        <Link href="/tools" className="header-cta">Explore tools <span aria-hidden="true">→</span></Link>
        <MobileNavigation />
      </div>
    </header>
  );
}
