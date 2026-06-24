import { IconChevronDown } from '@tabler/icons-react';
import { useState } from 'react';

type FAQItem = { q: string; a: string };

export function FAQ({
  items,
  className = '',
}: {
  items: FAQItem[];
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div
      className={`divide-y divide-gray-200 dark:divide-zinc-800/60 ${className}`}
    >
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `ai-faq-panel-${i}`;

        return (
          <div className="py-4 first:pt-0 last:pb-0" key={item.q}>
            <button
              aria-controls={panelId}
              aria-expanded={isOpen}
              className="group flex w-full items-center justify-between gap-4 text-left"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              type="button"
            >
              <span
                className={`text-sm font-medium transition-colors ${
                  isOpen
                    ? 'text-gray-900 dark:text-zinc-100'
                    : 'text-gray-600 group-hover:text-gray-800 dark:text-zinc-300 dark:group-hover:text-zinc-200'
                }`}
              >
                {item.q}
              </span>
              <IconChevronDown
                className={`shrink-0 text-gray-400 transition-all duration-200 ${
                  isOpen
                    ? 'rotate-180 text-gray-600 dark:text-zinc-300'
                    : 'group-hover:text-gray-500 dark:text-zinc-500 dark:group-hover:text-zinc-400'
                }`}
                size={16}
              />
            </button>
            {isOpen && (
              <p
                className="mt-2.5 animate-in fade-in slide-in-from-top-1 text-sm leading-relaxed text-gray-500 duration-200 dark:text-zinc-400"
                id={panelId}
              >
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
