import type { AITool } from "@/data/tools";
import { IconExternalLink, IconArrowRight } from "@tabler/icons-react";

export function ToolCard({ tool }: { tool: AITool }) {
  return (
    <a
      href={`/tools/${tool.slug}`}
      className="group relative block rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-zinc-950/50"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-zinc-100 group-hover:text-white transition-colors truncate">
            {tool.name}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-400 line-clamp-2">
            {tool.shortDescription}
          </p>
        </div>
        <span className="shrink-0 rounded-md bg-zinc-800/70 px-2.5 py-1 text-xs font-medium text-zinc-300 group-hover:bg-zinc-700/70 transition-colors">
          {tool.startingPrice}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {tool.platforms.slice(0, 4).map((p) => (
          <span key={p} className="rounded-md border border-zinc-700/60 bg-zinc-800/40 px-2 py-0.5 text-[11px] text-zinc-400">
            {p}
          </span>
        ))}
        {tool.platforms.length > 4 && (
          <span className="rounded-md bg-zinc-800/40 px-2 py-0.5 text-[11px] text-zinc-500">
            +{tool.platforms.length - 4}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {tool.bestFor.slice(0, 3).map((b) => (
          <span key={b} className="rounded-md bg-emerald-950/40 px-2 py-0.5 text-[11px] text-emerald-400/90">
            {b}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="flex gap-3">
          {tool.hasFreePlan && <span className="text-emerald-400/80">Free plan</span>}
          {tool.hasFreeChecker && <span className="text-blue-400/80">Free checker</span>}
        </div>
        <span className="flex items-center gap-1 text-zinc-500 group-hover:text-zinc-300 transition-colors">
          Details <IconArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </a>
  );
}
