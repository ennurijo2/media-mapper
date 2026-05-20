import { readFile } from "fs/promises";
import path from "path";

const COLLECTIONS_ROOT = path.join(
  process.cwd(),
  "content",
  "collections"
);

/** Slugs must be simple folder names only (no path traversal). */
function assertSafeSlug(slug: string): void {
  if (!slug || slug.includes("..") || slug.includes("/") || slug.includes("\\")) {
    throw new Error(`Invalid collection slug: ${slug}`);
  }
}

/**
 * Loads markdown for a collection from content/collections/<slug>/index.md
 * Server-only — import only from Server Components or app/data.ts.
 */
export async function loadCollectionMarkdown(slug: string): Promise<string> {
  assertSafeSlug(slug);

  const filePath = path.join(COLLECTIONS_ROOT, slug, "index.md");

  try {
    return await readFile(filePath, "utf8");
  } catch {
    // File missing while you are still writing the article
    return "";
  }
}
