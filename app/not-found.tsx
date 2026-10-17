import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return <main className="not-found-page"><div className="not-found-content"><span className="not-found-icon"><SearchX size={25} /></span><span className="eyebrow">404 · PAGE NOT FOUND</span><h1>That page took a wrong turn.</h1><p>The page may have moved, or the link might be out of date. Let’s get you back to something useful.</p><div className="not-found-actions"><Link href="/" className="button button--primary"><ArrowLeft size={16} /> Back to home</Link><Link href="/tools" className="button button--secondary">Explore tools</Link></div></div></main>;
}
