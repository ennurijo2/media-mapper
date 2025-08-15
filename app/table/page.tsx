import { getMediaPoints } from "../data";
import { MediaTable } from "@/components/media-locations-table";

export const dynamic = "force-dynamic";

export default async function TablePage() {
  const mediaPoints = await getMediaPoints();

  return (
    <div className="relative">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Media Locations - Table View</h1>
          <p className="text-muted-foreground">
            Explore all media locations in a tabular format. Click on any row to
            view detailed information.
          </p>
        </div>

        <MediaTable data={mediaPoints} />
      </div>
    </div>
  );
}
