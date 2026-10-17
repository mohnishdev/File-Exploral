type AdSlotProps = {
  variant: "top" | "middle" | "bottom" | "sidebar";
  className?: string;
};

export function AdSlot({ variant, className }: AdSlotProps) {
  return (
    <aside
      aria-label="Advertisement"
      className={`ad-slot ad-slot--${variant}${className ? ` ${className}` : ""}`}
    >
      <span>ADVERTISEMENT</span>
    </aside>
  );
}
