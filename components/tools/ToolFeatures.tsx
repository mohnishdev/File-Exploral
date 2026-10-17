import { Check } from "lucide-react";
import type { Tool } from "@/lib/tools";

export function ToolFeatures({ features }: { features: Tool["features"] }) {
  return (
    <ul className="tool-feature-list">
      {features.map((feature) => (
        <li key={feature}><Check size={16} /><span>{feature}</span></li>
      ))}
    </ul>
  );
}
