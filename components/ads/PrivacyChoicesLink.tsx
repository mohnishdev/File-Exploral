import Link from "next/link";
import { PrivacyChoicesButton } from "./PrivacyChoicesButton";

export function PrivacyChoicesLink() {
  if (process.env.NEXT_PUBLIC_ADSENSE_ENABLED !== "true") {
    return <Link href="/privacy-policy#cookies-and-advertising">Privacy &amp; advertising</Link>;
  }

  return <PrivacyChoicesButton />;
}
