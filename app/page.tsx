import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowRightLeft, ArrowUpRight, Check, FileImage, FileText, LockKeyhole, ShieldCheck, WandSparkles, Zap } from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";
import { ToolSearch } from "@/components/home/ToolSearch";
import { ToolCard } from "@/components/tools/ToolCard";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { imageTools, pdfTools } from "@/lib/tools";
import { createPageMetadata, siteDescription } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({ title: "Free online image & PDF tools", description: siteDescription });

const faqs = [
  ["Are these tools free?", "Yes. The platform is designed to provide useful image and PDF utilities for free, without accounts or subscriptions."],
  ["Do I need to create an account?", "No. There are no accounts or sign-up requirements."],
  ["Are the tools ready to use?", "Yes. Image converters, image editing tools, and common PDF workflows are available in your browser."],
  ["What happens to the files I select?", "Image and PDF processing happens in your browser. Files are not uploaded to our servers. Reset the tool or leave the page to clear its temporary references and previews."],
];

export default function Home() {
  const featuredTools = ["png-to-svg", "png-to-jpg", "image-compressor", "image-resizer", "pdf-editor", "pdf-merge"]
    .map((slug) => [...imageTools, ...pdfTools].find((tool) => tool.slug === slug))
    .filter((tool) => tool !== undefined);

  return (
    <main>
      <section className="hero">
        <div className="hero-glow" />
        <div className="container hero-inner">
          <div className="hero-content">
            <div className="hero-kicker"><span className="kicker-dot" /> A better way to handle everyday files</div>
            <h1>From file<br />to <span>finished.</span></h1>
            <p className="hero-description">Convert, resize, compress, and organize images and PDFs with straightforward tools that work right in your browser.</p>
            <ToolSearch />
            <div className="hero-shortcuts" aria-label="Popular tools">
              <span>Popular:</span>
              <Link href="/tools/png-to-jpg">PNG to JPG</Link>
              <Link href="/tools/image-compressor">Compress image</Link>
              <Link href="/tools/pdf-merge">Merge PDF</Link>
            </div>
            <div className="hero-note"><Check size={15} /> Free to use <span /> No account <span /> Files stay in your browser</div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
            <div className="art-spark spark-one">✳</div><div className="art-spark spark-two">✳</div>
            <div className="file-tile tile-back"><FileText size={24} /><span>your-document.pdf</span><i /><i /></div>
            <div className="file-tile tile-front"><FileImage size={25} /><span>your-image.png</span><i /><div className="tile-format"><span>PNG</span><ArrowRightLeft size={14} /><strong>SVG</strong></div></div>
            <div className="convert-bubble"><WandSparkles size={21} /></div>
            <span className="art-caption">The right tool. Right when you need it.</span>
          </div>
        </div>
        <div className="hero-bottom container"><span>IMAGE &amp; PDF TOOLS · NO ACCOUNT NEEDED</span><ArrowDown size={15} /></div>
      </section>

      <div className="container"><AdSlot variant="top" /></div>

      <section className="section container popular-section">
        <div className="section-heading section-heading-row"><div><span className="eyebrow">START WITH THE TASK</span><h2>What do you need to do?</h2><p>Pick a tool and get straight to work. No account or setup required.</p></div><Link href="/tools" className="text-link">Browse all tools <ArrowRight size={16} /></Link></div>
        <div className="tool-grid home-featured-grid">{featuredTools.map((tool) => <ToolCard tool={tool} key={tool.slug} />)}</div>
      </section>

      <div className="container home-ad-middle"><AdSlot variant="middle" /></div>

      <section className="section category-section" id="image-tools">
        <div className="container">
          <div className="section-heading section-heading-row"><div><span className="eyebrow">IMAGES, MADE MORE USEFUL</span><h2>Image tools</h2><p>Change formats, fine-tune dimensions, and get images ready to use.</p></div><Link href="/tools?category=image" className="text-link">Explore image tools <ArrowRight size={16} /></Link></div>
          <div className="tool-grid">{imageTools.map((tool) => <ToolCard tool={tool} key={tool.slug} />)}</div>
        </div>
      </section>

      <section className="section container pdf-section" id="pdf-tools">
        <div className="section-heading section-heading-row"><div><span className="eyebrow">DOCUMENTS, WITHOUT THE BUSYWORK</span><h2>PDF tools</h2><p>Prepare, arrange, and convert documents in a few clear steps.</p></div><Link href="/tools?category=pdf" className="text-link">Explore PDF tools <ArrowRight size={16} /></Link></div>
        <div className="tool-grid">{pdfTools.map((tool) => <ToolCard tool={tool} key={tool.slug} />)}</div>
      </section>

      <section className="why-section"><div className="container why-layout"><div className="why-intro"><Badge>Made for everyday work</Badge><h2>Less friction.<br /><span>More done.</span></h2><p>Useful tools should feel clear from the first click. Find what you need, finish the task, and get back to what matters.</p><Link href="/tools" className="button button--primary">Find your tool <ArrowRight size={16} /></Link></div><div className="why-features"><Card className="why-card"><span className="why-icon"><Zap size={19} /></span><div><h3>Ready when you are</h3><p>Open a tool and start right away—no account, installation, or complicated setup.</p></div></Card><Card className="why-card"><span className="why-icon"><ShieldCheck size={19} /></span><div><h3>Your files stay yours</h3><p>Image and PDF files are processed in your browser and aren’t uploaded to our servers.</p></div></Card><Card className="why-card"><span className="why-icon"><Check size={19} /></span><div><h3>Free, without a catch</h3><p>No subscriptions or paid tiers. Just the tools you came here to use.</p></div></Card></div></div></section>

      <section className="section container how-home"><div className="section-heading centered-heading"><span className="eyebrow">NO LEARNING CURVE REQUIRED</span><h2>Three steps. That’s it.</h2><p>Choose a tool, follow the prompts, and save your result.</p></div><div className="home-steps"><div><span>01</span><h3>Pick a tool</h3><p>Choose the image or PDF utility that fits your task.</p></div><div><span>02</span><h3>Add your file</h3><p>Follow the tool’s straightforward prompts and see how processing works.</p></div><div><span>03</span><h3>Get your result</h3><p>Save the finished file to your device.</p></div></div></section>

      <section className="privacy-home"><div className="container privacy-home-inner"><div className="privacy-illustration"><LockKeyhole size={23} /></div><div><span className="eyebrow">PRIVATE BY DESIGN</span><h2>Your files stay on your device.</h2><p>Image and PDF processing happens in your browser. Files aren’t uploaded to our servers, and there are no accounts or permanent file library. Reset a tool or leave the page to clear its temporary file references and previews.</p></div><Link href="/guides" className="text-link">How privacy works <ArrowRight size={16} /></Link></div></section>

      <section className="section container guides-section"><div className="section-heading section-heading-row"><div><span className="eyebrow">LEARN SOMETHING USEFUL</span><h2>Guides & resources</h2><p>Practical explainers for common image and PDF questions.</p></div><Link href="/guides" className="text-link">Explore guides <ArrowRight size={16} /></Link></div><Link href="/guides/png-vs-jpg" className="guide-feature"><div className="guide-art"><span>PNG</span><ArrowRight size={18} /><span>JPG</span></div><div className="guide-copy"><span className="eyebrow">IMAGE FORMATS · 5 MIN READ</span><h3>PNG or JPG: which image format should you use?</h3><p>A practical guide to transparency, file size, and choosing the right format.</p><span className="guide-link">Read the guide <ArrowUpRight size={15} /></span></div><span className="guide-arrow"><ArrowUpRight size={19} /></span></Link></section>

      <section className="section container faq-home"><div className="faq-home-header"><span className="eyebrow">A FEW GOOD ANSWERS</span><h2>Frequently asked questions</h2><p>The short version, right here.</p></div><div className="faq-list">{faqs.map(([question, answer]) => <details className="faq-item" key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>

      <div className="container home-ad-bottom"><AdSlot variant="bottom" /></div>

      <section className="bottom-cta container"><div className="cta-pattern" aria-hidden="true"><div /><div /><div /></div><div className="cta-copy"><Badge>Your next useful tool</Badge><h2>Good to go?</h2><p>Find the tool for the task and get started in seconds.</p><Link href="/tools" className="button button--light">Explore all tools <ArrowRight size={16} /></Link></div></section>
    </main>
  );
}
