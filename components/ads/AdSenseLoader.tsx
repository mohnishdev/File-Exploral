import Script from "next/script";

export function AdSenseLoader() {
  const enabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const hasConfiguredSlot = [
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP,
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_MIDDLE,
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM,
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR,
  ].some((slotId) => /^\d+$/.test(slotId ?? ""));
  if (!enabled || !clientId || !/^ca-pub-\d+$/.test(clientId) || !hasConfiguredSlot) return null;

  return (
    <Script
      id="google-adsense"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`}
    />
  );
}
