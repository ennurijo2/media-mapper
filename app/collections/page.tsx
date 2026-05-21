import { Suspense } from "react";
import { getCollections, getMediaPoints } from "@/app/data";
import { loadCollectionMarkdown } from "@/lib/collections/load-collection-body";
import CollectionsContainer from "@/components/collections/collections-container";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const [collections, allMediaPoints] = await Promise.all([
    getCollections(),
    getMediaPoints(),
  ]);

  const markdownByCollectionId: Record<string, string> = {};

  for (const collection of collections) {
    if (!collection.body_repo_slug) continue;
    markdownByCollectionId[collection.id] = await loadCollectionMarkdown(
      collection.body_repo_slug
    );
  }

  return (
    <div className="w-full h-full relative">
      <h1 className="sr-only">Collections</h1>
      <Suspense
        fallback={
          <div className="p-4 text-sm text-muted-foreground">
            Loading collections…
          </div>
        }
      >
        <CollectionsContainer
          collections={collections}
          allMediaPoints={allMediaPoints}
          markdownByCollectionId={markdownByCollectionId}
        />
      </Suspense>
    </div>
  );
}
