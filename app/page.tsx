import { Map } from "@/components/map";
import { LocationDetails } from "@/components/location-details";
import { getMediaPoints } from "./data";
import { LngLatBoundsLike } from "mapbox-gl";

export const dynamic = "force-dynamic";

export default async function Home() {
  const mediaPoints = await getMediaPoints();

  const mapBounds = mediaPoints
    .filter((f) => f.longitude && f.latitude)
    .map((f) => [f.longitude, f.latitude]) as LngLatBoundsLike;

  return (
    <div className="w-full h-full">
      <div className="relative">
        <LocationDetails data={mediaPoints} />

        <div className="fixed top-[4rem] left-0 w-full h-[calc(100vh-4rem)] lg:relative lg:top-0">
          <Map data={mediaPoints} bounds={mapBounds} />
        </div>
      </div>
    </div>
  );
}
