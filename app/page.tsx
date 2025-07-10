import { Map } from "@/components/map";
import { LocationDetails } from "@/components/location-details";
import { getMediaPoints } from "./data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const mediaPoints = await getMediaPoints();

  return (
    <div className="w-full h-full">
      <div className="relative">
        <LocationDetails data={mediaPoints} />

        <div className="fixed top-[4rem] left-0 w-full h-[calc(100vh-4rem)] lg:relative lg:top-0">
          <Map data={mediaPoints} />
        </div>
      </div>
    </div>
  );
}
