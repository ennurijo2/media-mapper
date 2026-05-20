"use client";

import ReactMarkdown from "react-markdown";
<ReactMarkdown rehypePlugins={[rehypeRaw]}>{source}</ReactMarkdown>
import { cn } from "@/lib/utils";

/** Remove YAML frontmatter from B5 index.md (lines between --- ... ---). */
function stripFrontmatter(markdown: string): string {
  const trimmed = markdown.trimStart();
  if (!trimmed.startsWith("---")) return markdown;

  const end = trimmed.indexOf("---", 3);
  if (end === -1) return markdown;

  return trimmed.slice(end + 3).trimStart();
}

interface CollectionProseProps {
  markdown: string;
  className?: string;
}

export function CollectionProse({ markdown, className }: CollectionProseProps) {
  const source = stripFrontmatter(markdown);

  if (!source.trim()) {
    return (
      <p className="text-sm text-muted-foreground">
        No article text found for this collection. Check{" "}
        <code className="text-xs">content/collections/&lt;slug&gt;/index.md</code>{" "}
        and Body Repo Slug in Airtable.
      </p>
    );
  }

  return (
    <div
      className={cn(
        "prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed",
        className
      )}
    >
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{source}</ReactMarkdown>
    </div>
  );
}
