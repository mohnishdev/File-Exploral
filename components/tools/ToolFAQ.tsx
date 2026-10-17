import { Plus } from "lucide-react";

type FAQ = { question: string; answer: string };

export function ToolFAQ({ faqs }: { faqs: FAQ[] }) {
  return (
    <section className="content-section faq-section">
      <div className="section-heading"><BadgeLabel /><h2>Frequently asked questions</h2><p>Helpful details about this tool and how we approach your files.</p></div>
      <div className="faq-list">
        {faqs.map((faq) => <details className="faq-item" key={faq.question}><summary>{faq.question}<Plus size={18} /></summary><p>{faq.answer}</p></details>)}
      </div>
    </section>
  );
}

function BadgeLabel() {
  return <span className="badge">Good to know</span>;
}
