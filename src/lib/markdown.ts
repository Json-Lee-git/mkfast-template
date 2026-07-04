import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';

export type MarkdownResult = {
  markup: string;
};

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, {
    behavior: 'wrap',
    properties: { className: ['anchor'] },
  })
  .use(rehypeStringify);

/**
 * Renders markdown to HTML using unified (remark/rehype) with GFM,
 * heading IDs, and autolink headings.
 * https://tanstack.dev/start/latest/docs/framework/react/guide/rendering-markdown
 */
export function renderMarkdownSync(content: string): MarkdownResult {
  const result = processor.processSync(content);
  return { markup: String(result) };
}

export async function renderMarkdown(content: string): Promise<MarkdownResult> {
  const result = await processor.process(content);
  return { markup: String(result) };
}
