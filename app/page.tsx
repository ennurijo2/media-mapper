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
    <div className="w-full h-full relative">
      <h1 className="sr-only">Media Mapper - Interactive Map View</h1>
      <div className="px-4 py-2 w-full max-w-7xl mx-auto relative h-[calc(100vh-12rem)] lg:h-[calc(100vh-168px)]">
        <Map data={mediaPoints} bounds={mapBounds} />
        <LocationDetails data={mediaPoints} />
      </div>
    </div>
  );
}
