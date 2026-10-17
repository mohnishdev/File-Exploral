import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Contact Image Converter",
  description: "Contact Image Converter with questions, feedback, or privacy requests.",
  path: "/contact",
});

export default function ContactPage() {
  const email = process.env.CONTACT_EMAIL;

  return (
    <main>
      <div className="container listing-page contact-page">
        <nav aria-label="Breadcrumb" className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span aria-current="page">Contact</span></nav>
        <header className="listing-hero">
          <span className="eyebrow">WE’RE HERE TO HELP</span>
          <h1>Contact Image Converter</h1>
          <p>Send questions about a tool, share feedback, or contact us about privacy and advertising.</p>
        </header>
        <AdSlot variant="top" />
        <section className="contact-card">
          <span className="contact-icon"><Mail size={20} /></span>
          <div>
            <h2>Email support</h2>
            {email
              ? <p>For product questions, feedback, or privacy requests, email <a href={`mailto:${email}`}>{email}</a>.</p>
              : <p>Support email is being configured. Please check back before launch.</p>}
            <p>When reporting an issue, include the tool name and browser details. Do not email files containing private or sensitive information.</p>
          </div>
          {email && <a className="contact-mail-link" href={`mailto:${email}`} aria-label="Email Image Converter"><ArrowUpRight size={19} /></a>}
        </section>
        <p className="contact-policy-link">For information about data and advertising, read our <Link href="/privacy-policy">privacy policy</Link>.</p>
      </div>
    </main>
  );
}
