import type { AITool } from "@/data/tools";
import { IconArrowRight } from "@tabler/icons-react";

export function ToolCard({ tool }: { tool: AITool }) {
  return (
    <a
      href={`/tools/${tool.slug}`}
      className="group relative block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/80 dark:hover:shadow-lg dark:hover:shadow-zinc-950/50"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-gray-800 transition-colors truncate dark:text-zinc-100 dark:group-hover:text-white">
            {tool.name}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-500 line-clamp-2 dark:text-zinc-400">
            {tool.shortDescription}
          </p>
        </div>
        <span className="shrink-0 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 group-hover:bg-gray-200 transition-colors dark:bg-zinc-800/70 dark:text-zinc-300 dark:group-hover:bg-zinc-700/70">
          {tool.startingPrice}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {tool.platforms.slice(0, 4).map((p) => (
          <span key={p} className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-500 dark:border-zinc-700/60 dark:bg-zinc-800/40 dark:text-zinc-400">
            {p}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {tool.bestFor.slice(0, 3).map((b) => (
          <span key={b} className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400/90">
            {b}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="flex gap-3">
          {tool.hasFreePlan && <span className="text-emerald-600 dark:text-emerald-400/80">Free plan</span>}
          {tool.hasFreeChecker && <span className="text-blue-600 dark:text-blue-400/80">Free checker</span>}
        </div>
        <span className="flex items-center gap-1 text-gray-400 group-hover:text-gray-600 transition-colors dark:text-zinc-500 dark:group-hover:text-zinc-300">
          Details <IconArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </a>
  );
}
