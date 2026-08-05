/**
 * A small markdown-to-HTML renderer for the study content.
 *
 * This existed twice, once in TopicPage and once in InterviewQuestion, with the
 * two copies already drifting: only the TopicPage version handled tables, and
 * the two used different text sizes. The mock interview page needed a third
 * consumer and rendered raw text instead, which is why answers there showed
 * their asterisks and backticks instead of formatting.
 *
 * It stays deliberately small rather than pulling in a markdown library. The
 * content is authored in one place and uses five constructs: bold, inline code,
 * fenced code, bullets, and tables. A full parser would be more bytes than the
 * content it formats.
 *
 * Output is fed to dangerouslySetInnerHTML, so anything originating from the
 * content files is escaped before it reaches the page. Code blocks are escaped
 * explicitly; inline formatting only ever wraps text in fixed markup and never
 * interpolates attributes.
 */

const SIZES = {
  /** Topic pages: body text at reading size. */
  page: { code: "text-sm", pre: "text-sm", para: "mb-2" },
  /** Answer panels: denser, sitting inside an already-indented card. */
  compact: { code: "text-xs", pre: "text-xs", para: "mb-1" },
} as const;

export type MarkdownSize = keyof typeof SIZES;

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inlineMarkdown(text: string, size: MarkdownSize): string {
  const codeSize = SIZES[size].code;
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-[var(--color-neutral-950)] font-semibold">$1</strong>')
    .replace(
      /`([^`]+)`/g,
      `<code class="text-[var(--color-accent-light)] bg-[var(--color-neutral-100)] px-1 rounded ${codeSize}">$1</code>`,
    );
}

export function renderMarkdown(text: string, size: MarkdownSize = "page"): string {
  const { pre: preSize, para: paraSpacing } = SIZES[size];
  const lines = text.split("\n");
  const html: string[] = [];
  let inList = false;
  let inCode = false;
  let inTable = false;
  const codeLines: string[] = [];

  const closeBlocks = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
    if (inTable) {
      html.push("</tbody></table>");
      inTable = false;
    }
  };

  for (const line of lines) {
    if (!inCode && line.startsWith("```")) {
      closeBlocks();
      inCode = true;
      codeLines.length = 0;
      continue;
    }

    if (inCode && line.startsWith("```")) {
      inCode = false;
      html.push(
        `<pre class="bg-[var(--color-neutral-0)] border border-[var(--color-neutral-200)] rounded-lg p-3 my-2 overflow-x-auto ${preSize} text-[var(--color-neutral-800)] leading-relaxed"><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`,
      );
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    // Table row. The separator row (|---|---|) is skipped rather than rendered.
    if (line.startsWith("|")) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      if (/^\|[-| :]+\|$/.test(line)) continue;
      if (!inTable) {
        // Previously each row emitted a bare <tr>, with no <table> around it.
        // Browsers drop table rows that have no table ancestor, so tables in
        // the content rendered as loose text.
        html.push('<table class="my-3 w-full border-collapse text-left"><tbody>');
        inTable = true;
      }
      const cells = line.split("|").filter((cell) => cell.trim());
      html.push(
        `<tr>${cells
          .map(
            (cell) =>
              `<td class="border border-[var(--color-neutral-200)] px-3 py-2 align-top text-[var(--color-neutral-700)]">${inlineMarkdown(cell.trim(), size)}</td>`,
          )
          .join("")}</tr>`,
      );
      continue;
    }

    if (inTable) {
      html.push("</tbody></table>");
      inTable = false;
    }

    if (/^[-*] /.test(line)) {
      if (!inList) {
        html.push('<ul class="list-disc pl-5 my-2 space-y-1">');
        inList = true;
      }
      html.push(
        `<li class="text-[var(--color-neutral-700)]">${inlineMarkdown(line.slice(2), size)}</li>`,
      );
      continue;
    }

    if (inList) {
      html.push("</ul>");
      inList = false;
    }

    if (line.trim() === "") continue;

    html.push(
      `<p class="text-[var(--color-neutral-700)] leading-relaxed ${paraSpacing}">${inlineMarkdown(line, size)}</p>`,
    );
  }

  closeBlocks();
  return html.join("");
}
