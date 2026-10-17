import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, FileImage, FileText, LockKeyhole, Sparkles, WandSparkles } from "lucide-react";
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
  return (
    <main>
      <section className="hero">
        <div className="hero-glow" />
        <div className="container hero-inner">
          <div className="hero-content">
            <div className="hero-kicker"><span className="kicker-dot" /> A simpler way to work with files</div>
            <h1>Good tools for<br /><span>everyday files.</span></h1>
            <p className="hero-description">Free online image and PDF tools. No account required, just a clear path to getting things done.</p>
            <ToolSearch />
            <div className="hero-note"><Check size={15} /> Free to use <span /> No sign-up <span /> Privacy-minded by design</div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
            <div className="art-spark spark-one">✳</div><div className="art-spark spark-two">✳</div>
            <div className="file-tile tile-back"><FileText size={24} /><span>document.pdf</span><i /></div>
            <div className="file-tile tile-front"><FileImage size={25} /><span>photo.png</span><i /></div>
            <div className="convert-bubble"><WandSparkles size={21} /></div>
            <span className="art-caption">One less thing to figure out.</span>
          </div>
        </div>
        <div className="hero-bottom container"><span>TOOLS FOR THE LITTLE TASKS</span><ArrowDown size={15} /></div>
      </section>

      <div className="container"><AdSlot variant="top" /></div>

      <section className="section container popular-section">
        <div className="section-heading section-heading-row"><div><span className="eyebrow">A GOOD PLACE TO START</span><h2>Popular tools</h2><p>Quick access to the tools people reach for most.</p></div><Link href="/tools" className="text-link">View all tools <ArrowRight size={16} /></Link></div>
        <div className="tool-grid">{[imageTools[0], imageTools[5], pdfTools[1], imageTools[2]].map((tool) => <ToolCard tool={tool} key={tool.slug} />)}</div>
      </section>

      <section className="section category-section">
        <div className="container">
          <div className="section-heading section-heading-row"><div><span className="eyebrow">MAKE IMAGES WORK FOR YOU</span><h2>Image tools</h2><p>Format, resize, and optimize images. The tools are being prepared.</p></div><Link href="/tools?category=image" className="text-link">All image tools <ArrowRight size={16} /></Link></div>
          <div className="tool-grid">{imageTools.map((tool) => <ToolCard tool={tool} key={tool.slug} />)}</div>
        </div>
      </section>

      <section className="section container pdf-section">
        <div className="section-heading section-heading-row"><div><span className="eyebrow">DOCUMENTS, WITHOUT THE FUSS</span><h2>PDF tools</h2><p>Useful document tools designed to keep common tasks simple.</p></div><Link href="/tools?category=pdf" className="text-link">All PDF tools <ArrowRight size={16} /></Link></div>
        <div className="tool-grid">{pdfTools.map((tool) => <ToolCard tool={tool} key={tool.slug} />)}</div>
      </section>

      <section className="why-section"><div className="container why-layout"><div className="why-intro"><Badge>Why Image Converter</Badge><h2>Useful should feel<br /><span>effortless.</span></h2><p>We’re building a collection of everyday file tools with the things that matter most: clarity, convenience, and respect for your privacy.</p><Link href="/tools" className="button button--primary">Find a tool <ArrowRight size={16} /></Link></div><div className="why-features"><Card className="why-card"><span className="why-icon"><Sparkles size={19} /></span><div><h3>Simple by design</h3><p>Focused tools and clear steps, without an account or complicated setup.</p></div></Card><Card className="why-card"><span className="why-icon"><LockKeyhole size={19} /></span><div><h3>Privacy with plain answers</h3><p>We’ll be transparent about how each tool handles files before processing is available.</p></div></Card><Card className="why-card"><span className="why-icon"><Check size={19} /></span><div><h3>Free to use</h3><p>Useful utilities for everyday tasks, with no subscriptions or hidden plan tiers.</p></div></Card></div></div></section>

      <section className="section container how-home"><div className="section-heading centered-heading"><span className="eyebrow">NO LEARNING CURVE REQUIRED</span><h2>Three steps. That’s it.</h2><p>When tools launch, the process will stay clear from start to finish.</p></div><div className="home-steps"><div><span>01</span><h3>Pick a tool</h3><p>Choose the image or PDF utility that fits your task.</p></div><div><span>02</span><h3>Add your file</h3><p>Follow the tool’s straightforward prompts and see how processing works.</p></div><div><span>03</span><h3>Get your result</h3><p>Save the finished file to your device when the tool is ready.</p></div></div></section>

      <section className="privacy-home"><div className="container privacy-home-inner"><div className="privacy-illustration"><LockKeyhole size={23} /></div><div><span className="eyebrow">YOUR FILES, YOUR BUSINESS</span><h2>Privacy shouldn’t be a guessing game.</h2><p>There are no user accounts or permanent file library. Current image and PDF tools process files locally in your browser instead of uploading them to our servers. Reset a tool or leave the page to clear its temporary file references and previews.</p></div><Link href="/guides" className="text-link">Our approach <ArrowRight size={16} /></Link></div></section>

      <section className="section container guides-section"><div className="section-heading section-heading-row"><div><span className="eyebrow">LEARN SOMETHING USEFUL</span><h2>Guides & resources</h2><p>Practical explainers for common image and PDF questions.</p></div><Link href="/guides" className="text-link">Explore guides <ArrowRight size={16} /></Link></div><Link href="/guides/png-vs-jpg" className="guide-feature"><div className="guide-art"><span>PNG</span><ArrowRight size={18} /><span>JPG</span></div><div className="guide-copy"><span className="eyebrow">IMAGE FORMATS · 5 MIN READ</span><h3>PNG or JPG: which image format should you use?</h3><p>A practical guide to transparency, file size, and choosing the right format.</p><span className="guide-link">Read the guide <ArrowUpRight size={15} /></span></div><span className="guide-arrow"><ArrowUpRight size={19} /></span></Link></section>

      <section className="section container faq-home"><div className="faq-home-header"><span className="eyebrow">A FEW GOOD ANSWERS</span><h2>Frequently asked questions</h2><p>The short version, right here.</p></div><div className="faq-list">{faqs.map(([question, answer]) => <details className="faq-item" key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>

      <section className="bottom-cta container"><div className="cta-pattern" aria-hidden="true"><div /><div /><div /></div><div className="cta-copy"><Badge>Your next useful tool</Badge><h2>Less hassle. More done.</h2><p>Find a free browser-based tool for your everyday image and PDF tasks.</p><Link href="/tools" className="button button--light">Browse all tools <ArrowRight size={16} /></Link></div></section>
    </main>
  );
}
