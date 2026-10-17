import type { Tool } from "@/lib/tools";
import { Badge } from "@/components/ui/Badge";

export function ToolHeader({ tool }: { tool: Tool }) {
  return (
    <header className="tool-copy">
      <Badge>{tool.category} tool</Badge>
      <h1>{tool.name}</h1>
      <p>{tool.description}</p>
    </header>
  );
}
