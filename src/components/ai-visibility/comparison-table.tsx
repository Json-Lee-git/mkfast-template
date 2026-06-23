import type { AITool } from "@/data/tools";
import { IconExternalLink } from "@tabler/icons-react";

type Col = { key: string; label: string };

export function ComparisonTable({
  tools,
  cols,
  title,
  className = "",
}: {
  tools: AITool[];
  cols: Col[];
  title?: string;
  className?: string;
}) {
  const renderCell = (tool: AITool, col: Col) => {
    const val = (tool as Record<string, unknown>)[col.key];
    if (col.key === "websiteUrl") {
      return (
        <a href={val as string} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
          Visit <IconExternalLink size={12} />
        </a>
      );
    }
    if (Array.isArray(val)) {
      return (
        <div className="flex flex-wrap gap-1">
          {val.map((v) => (
            <span key={v} className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-300">{v}</span>
          ))}
        </div>
      );
    }
    if (col.key === "hasFreePlan" || col.key === "hasFreeChecker") {
      return val ? "✓" : "✗";
    }
    return String(val ?? "");
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      {title && <h3 className="mb-3 text-lg font-semibold text-zinc-100">{title}</h3>}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800">
            {cols.map((c) => (
              <th key={c.key} className="px-3 py-2 text-left text-xs font-medium text-zinc-400">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {tools.map((tool) => (
            <tr key={tool.slug} className="hover:bg-zinc-900/30">
              {cols.map((c) => (
                <td key={c.key} className="px-3 py-2 text-zinc-300">{renderCell(tool, c)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
