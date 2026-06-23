import type { AITool } from "@/data/tools";

export function PricingTable({ tools, className = "" }: { tools: AITool[]; className?: string }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-zinc-800">
            <th className="px-3 py-2 text-left text-xs font-medium text-zinc-400">Tool</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-zinc-400">Starting Price</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-zinc-400">Free Plan</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-zinc-400">Free Checker</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-zinc-400">Best For</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-zinc-400">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {tools.map((tool) => (
            <tr key={tool.slug} className="hover:bg-gray-50 dark:hover:bg-zinc-900/30">
              <td className="px-3 py-2 font-medium text-zinc-200">{tool.name}</td>
              <td className="px-3 py-2 text-zinc-300">{tool.startingPrice}</td>
              <td className="px-3 py-2">{tool.hasFreePlan ? <span className="text-emerald-600 dark:text-emerald-400">✓</span> : <span className="text-gray-300 dark:text-zinc-600">—</span>}</td>
              <td className="px-3 py-2">{tool.hasFreeChecker ? <span className="text-blue-600 dark:text-blue-400">Free checker</span> : <span className="text-gray-300 dark:text-zinc-600">—</span>}</td>
              <td className="px-3 py-2 text-gray-500 dark:text-zinc-400 text-xs">{tool.bestFor.slice(0, 2).join(", ")}</td>
              <td className="px-3 py-2 text-xs text-gray-400 dark:text-zinc-500 max-w-48 truncate">{tool.pricingNotes}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-gray-400 dark:text-zinc-500">
        Pricing and feature information may change. Always verify details on the vendor's official website before making a purchase.
      </p>
    </div>
  );
}
