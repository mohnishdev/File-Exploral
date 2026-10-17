import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { createPageMetadata } from "@/lib/seo/metadata";
import { PrivacyChoicesLink } from "@/components/ads/PrivacyChoicesLink";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "Read how Image Converter handles browser-processed files, technical information, cookies, advertising, and privacy choices.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  const email = process.env.CONTACT_EMAIL;
  const adsEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

  return (
    <main>
      <article className="container article-page privacy-policy-page">
        <nav aria-label="Breadcrumb" className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span aria-current="page">Privacy policy</span></nav>
        <header className="article-header">
          <span className="eyebrow">PRIVACY POLICY</span>
          <h1>Privacy, in plain language.</h1>
          <p>Effective date: October 17, 2026</p>
        </header>
        <AdSlot variant="top" />
        <div className="article-body">
          <p>This policy explains how Image Converter handles information when you use the website and its image and PDF tools.</p>

          <h2>Files you process</h2>
          <p>Image and PDF tools process the files you select locally in your browser. The application does not upload file contents to its servers or create an account-based file library. Files and previews are held temporarily in browser memory while a tool is open. Remove a selected file or close the page to clear the tool state; your browser manages memory and temporary object URLs.</p>

          <h2>Information handled by the website</h2>
          <p>We do not currently offer user accounts, payment processing, or a server-side file-processing service. Like other websites, the hosting and network infrastructure used to deliver the pages may process technical request information such as IP address, browser information, requested URLs, and security or operational logs. Retention and handling of those records depend on the hosting provider’s configuration and policies.</p>
          <p>The site does not currently add a separate analytics product. If that changes, this policy will be updated before the new processing begins.</p>

          <h2 id="cookies-and-advertising">Cookies and advertising</h2>
          {adsEnabled
            ? <p>Image Converter uses Google AdSense to display advertising. Google and its advertising partners may use cookies, local storage, IP addresses, or other identifiers to serve, measure, and personalize ads, subject to your consent choices and applicable law. See <a href="https://policies.google.com/technologies/ads" rel="noreferrer">How Google uses information from sites or apps that use its services</a> and Google’s <a href="https://policies.google.com/privacy" rel="noreferrer">Privacy Policy</a>.</p>
            : <p>Advertising is not currently enabled. If Google AdSense or another advertising service is enabled, it may use cookies, local storage, IP addresses, or other identifiers for ad delivery, measurement, fraud prevention, and (where permitted) personalization. This policy and the consent experience must be updated to match the services actually enabled before ads are served.</p>}

          <h2>Consent and privacy choices</h2>
          <p>{adsEnabled
            ? "Where required, Google’s published Privacy & Messaging consent message is used to collect and manage advertising consent. You can reopen available advertising choices using the control in the footer. Consent options depend on your region and the message configured for this site."
            : "A Google consent management message is not active while advertising is disabled. Before enabling advertising, the site operator must publish the appropriate Google Privacy & Messaging consent message (or another compliant, certified CMP where required), configure relevant ad technology providers, and verify that consent and withdrawal choices work for the regions served."}</p>
          <p id="advertising-choices"><PrivacyChoicesLink /></p>

          <h2>How we use information</h2>
          <p>Information handled by site delivery infrastructure is used to serve pages, maintain security, and diagnose operational problems. Advertising providers may use information as described in their policies and the choices presented in the consent experience. The application does not use file contents to identify users or to build a file history.</p>

          <h2>Children</h2>
          <p>The tools are general-purpose utilities and are not designed to collect personal information from children. Do not submit personal or sensitive information through support channels.</p>

          <h2>Changes to this policy</h2>
          <p>This policy may be updated when the service or its providers change. The effective date above will be revised when material changes are published.</p>

          <h2>Contact</h2>
          {email
            ? <p>For privacy questions or requests, contact <a href={`mailto:${email}`}>{email}</a>. You can also visit our <Link href="/contact">contact page</Link>.</p>
            : <p>For privacy questions, visit the <Link href="/contact">contact page</Link>. A support email must be configured before public launch.</p>}
        </div>
        <AdSlot variant="bottom" />
      </article>
    </main>
  );
}
