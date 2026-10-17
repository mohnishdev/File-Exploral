import Link from "next/link";
import { Blend } from "lucide-react";

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Image Converter home">
      <span className="brand-mark"><Blend size={19} strokeWidth={2.2} /></span>
      <span>image<span className="brand-muted">converter</span></span>
    </Link>
  );
}
