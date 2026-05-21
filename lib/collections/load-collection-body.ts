import { readFile } from "fs/promises";
import path from "path";

const COLLECTIONS_ROOT = path.join(
  process.cwd(),
  "content",
  "collections"
);

function assertSafeSlug(slug: string): void {
  if (!slug || slug.includes("..") || slug.includes("/") || slug.includes("\\")) {
    throw new Error(`Invalid collection slug: ${slug}`);
  }
}

export async function loadCollectionMarkdown(slug: string): Promise<string> {
  assertSafeSlug(slug);

  const filePath = path.join(COLLECTIONS_ROOT, slug, "index.md");

  try {
    return await readFile(filePath, "utf8");
  } catch {
    return "";
  }
}
