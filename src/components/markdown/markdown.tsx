import { renderMarkdownSync } from '@/lib/markdown';

type MarkdownProps = {
  content: string;
  className?: string;
};

/**
 * Renders markdown component
 * https://tanstack.dev/start/latest/docs/framework/react/guide/rendering-markdown
 */
export function Markdown({ content, className }: MarkdownProps) {
  const result = renderMarkdownSync(content);
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: result.markup }}
    />
  );
}
