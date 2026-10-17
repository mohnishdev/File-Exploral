import { AdSenseUnit } from "./AdSenseUnit";

type AdSlotProps = {
  variant: "top" | "middle" | "bottom" | "sidebar";
  className?: string;
};

export function AdSlot({ variant, className }: AdSlotProps) {
  const adsEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const slotId = {
    top: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP,
    middle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_MIDDLE,
    bottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM,
    sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR,
  }[variant];
  const configuredUnit = adsEnabled
    && /^ca-pub-\d+$/.test(clientId ?? "")
    && /^\d+$/.test(slotId ?? "");

  return (
    <aside
      aria-label="Advertisement"
      className={`ad-slot ad-slot--${variant}${configuredUnit ? " ad-slot--active" : ""}${className ? ` ${className}` : ""}`}
    >
      {configuredUnit && clientId && slotId ? (
        <>
          <span className="ad-slot-label">ADVERTISEMENT</span>
          <AdSenseUnit clientId={clientId} slotId={slotId} />
        </>
      ) : <span>ADVERTISEMENT</span>}
    </aside>
  );
}
