import type { AITool } from "@/data/tools";
import { IconExternalLink } from "@tabler/icons-react";

export function ToolCard({ tool }: { tool: AITool }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:border-zinc-700">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-100">{tool.name}</h3>
          <p className="mt-1 text-sm text-zinc-400">{tool.shortDescription}</p>
        </div>
        <span className="shrink-0 rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300">{tool.startingPrice}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {tool.platforms.map((p) => (
          <span key={p} className="rounded bg-zinc-800/50 px-2 py-0.5 text-xs text-zinc-400">
            {p}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {tool.bestFor.map((b) => (
          <span key={b} className="rounded bg-emerald-900/30 px-2 py-0.5 text-xs text-emerald-400">
            {b}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {tool.hasFreePlan && <span className="text-emerald-400">✓ Free plan</span>}
        {tool.hasFreeChecker && <span className="text-emerald-400">✓ Free checker</span>}
      </div>

      <div className="mt-4 flex gap-4">
        <a
          href={`/tools/${tool.slug}`}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Full review →
        </a>
        <a
          href={tool.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
        >
          <IconExternalLink size={14} /> Visit
        </a>
      </div>
    </div>
  );
}
