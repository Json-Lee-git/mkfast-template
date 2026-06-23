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
        <a href={val as string} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 text-xs transition-colors">
          Visit <IconExternalLink size={11} />
        </a>
      );
    }
    if (Array.isArray(val)) {
      return (
        <div className="flex flex-wrap gap-1">
          {val.map((v) => (
            <span key={v} className="rounded-md border border-zinc-700/50 bg-zinc-800/50 px-1.5 py-0.5 text-[11px] text-zinc-400">{v}</span>
          ))}
        </div>
      );
    }
    if (col.key === "hasFreePlan" || col.key === "hasFreeChecker") {
      return val ? <span className="text-emerald-400/80 text-xs">Yes</span> : <span className="text-zinc-600 text-xs">-</span>;
    }
    return <span className="text-xs text-zinc-300">{String(val ?? "-")}</span>;
  };

  return (
    <div className={`overflow-x-auto rounded-xl border border-zinc-800/60 ${className}`}>
      {title && (
        <div className="border-b border-zinc-800/60 px-4 py-3">
          <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
        </div>
      )}
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800/40 bg-zinc-900/40">
            {cols.map((c) => (
              <th key={c.key} className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-zinc-500">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/30">
          {tools.map((tool) => (
            <tr key={tool.slug} className="hover:bg-zinc-900/30 transition-colors">
              {cols.map((c) => (
                <td key={c.key} className="px-4 py-3">{renderCell(tool, c)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
