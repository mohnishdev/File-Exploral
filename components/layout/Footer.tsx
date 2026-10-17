import Link from "next/link";
import { Brand } from "./Brand";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-about">
          <Brand />
          <p>Useful file tools, made straightforward.<br />Free to use. No account required.</p>
        </div>
        <div className="footer-column">
          <h2>Explore</h2>
          <Link href="/tools?category=image">Image tools</Link>
          <Link href="/tools?category=pdf">PDF tools</Link>
          <Link href="/guides">Guides</Link>
        </div>
        <div className="footer-column">
          <h2>Popular tools</h2>
          <Link href="/tools/png-to-jpg">PNG to JPG</Link>
          <Link href="/tools/image-resizer">Image resizer</Link>
          <Link href="/tools/pdf-merge">Merge PDF</Link>
        </div>
        <div className="footer-note">
          <span className="privacy-dot" />
          <p>No accounts. No permanent file library. Image and PDF tools process your files in this browser.</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© Image Converter</span>
        <span>Built for useful work, not busywork.</span>
      </div>
    </footer>
  );
}
