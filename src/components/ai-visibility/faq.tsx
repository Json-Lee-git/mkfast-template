import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";

type FAQItem = { q: string; a: string };

export function FAQ({ items, className = "" }: { items: FAQItem[]; className?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={`divide-y divide-zinc-800 ${className}`}>
      {items.map((item, i) => (
        <div key={i} className="py-4">
          <button
            className="flex w-full items-center justify-between gap-4 text-left"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span className="font-medium text-zinc-200">{item.q}</span>
            <IconChevronDown
              size={18}
              className={`shrink-0 text-zinc-500 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
            />
          </button>
          {openIndex === i && <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.a}</p>}
        </div>
      ))}
    </div>
  );
}
