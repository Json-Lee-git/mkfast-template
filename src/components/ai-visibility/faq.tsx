import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";

type FAQItem = { q: string; a: string };

export function FAQ({ items, className = "" }: { items: FAQItem[]; className?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={`divide-y divide-zinc-800/60 ${className}`}>
      {items.map((item, i) => (
        <div key={i} className="py-4 first:pt-0 last:pb-0">
          <button
            className="flex w-full items-center justify-between gap-4 text-left group"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span className={`text-sm font-medium transition-colors ${openIndex === i ? "text-zinc-100" : "text-zinc-300 group-hover:text-zinc-200"}`}>
              {item.q}
            </span>
            <IconChevronDown
              size={16}
              className={`shrink-0 text-zinc-500 transition-all duration-200 ${openIndex === i ? "rotate-180 text-zinc-300" : "group-hover:text-zinc-400"}`}
            />
          </button>
          {openIndex === i && (
            <p className="mt-2.5 text-sm leading-relaxed text-zinc-400 animate-in fade-in slide-in-from-top-1 duration-200">
              {item.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
