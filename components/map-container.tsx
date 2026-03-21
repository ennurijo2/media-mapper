"use client";

import { MapFilters, MediaLocation } from "@/lib/airtable/types";
import { computeMapBounds } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Map } from "@/components/map";
import { MapDrawer } from "./map-drawer";
import { Filters } from "./filters";
import { useIsTablet } from "./hooks/use-tablet";

interface MapContainerProps {
  mediaPoints: MediaLocation[];
}

/*
Map Container component Reason:
Filtering is handled client-side to provide instant feedback to the user,
avoid unnecessary server requests and page redirects, and keep the map UI
responsive while users refine search and filter criteria.
*/

export default function MapContainer({ mediaPoints }: MapContainerProps) {
  const searchParams = useSearchParams();
  const mediaPointId = searchParams.get("mediaPointId");
  const [prevMediaPointId, setPrevMediaPointId] = useState(mediaPointId);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const isMobile = useIsTablet();

  if (mediaPointId !== prevMediaPointId) {
    setPrevMediaPointId(mediaPointId);
    if (mediaPointId) {
      setDrawerOpen(true);
    }
  }

  const filters: MapFilters = useMemo(
    () => ({
      countries: searchParams.get("country")?.split(",").filter(Boolean) || [],
      bodiesOfWater:
        searchParams.get("body_of_water")?.split(",").filter(Boolean) || [],
      startYear: searchParams.get("start_year") || "",
      endYear: searchParams.get("end_year") || "",
    }),
    [searchParams]
  );

  const filteredMediaPoints = useMemo(() => {
    return mediaPoints.filter((media) => {
      if (
        filters.countries.length > 0 &&
        !filters.countries.includes(media?.country?.toLowerCase() || "")
      )
        return false;
      if (
        filters.bodiesOfWater.length > 0 &&
        !filters.bodiesOfWater.includes(
          media.natural_feature_name?.toLowerCase() || ""
        )
      )
        return false;
      if (
        filters.startYear &&
        media.media?.release_year &&
        media.media?.release_year < +filters.startYear
      )
        return false;
      if (
        filters.endYear &&
        media.media?.release_year &&
        media.media?.release_year > +filters.endYear
      )
        return false;

      return true;
    });
  }, [filters, mediaPoints]);

  const mapBounds = computeMapBounds(filteredMediaPoints);

  const countryOptions = [...new Set(mediaPoints.map((media) => media.country))]
    .filter((country) => country !== undefined)
    .sort()
    .map((country) => ({ value: country?.toLowerCase(), label: country }));
  const bodiesOfWaterOptions = [
    ...new Set(mediaPoints.map((media) => media.natural_feature_name)),
  ]
    .filter((bodyOfWater) => bodyOfWater !== undefined)
    .sort()
    .map((bodyOfWater) => ({
      value: bodyOfWater?.toLowerCase(),
      label: bodyOfWater,
    }));
  const minYear = Math.min(
    ...mediaPoints
      .map((d) => d.media?.release_year)
      .filter((year) => year !== undefined)
  );
  const maxYear = Math.max(
    ...mediaPoints
      .map((d) => d.media?.release_year)
      .filter((year) => year !== undefined)
  );

  return (
    <div className="w-full relative h-[calc(100vh-4rem)]">
      <div className="relative w-full h-full overflow-hidden">
        <Map data={filteredMediaPoints} bounds={mapBounds} filters={filters} />
        <MapDrawer
          filteredMediaPoints={filteredMediaPoints}
          allMediaPoints={mediaPoints}
          isOpen={drawerOpen}
          onToggle={() => setDrawerOpen((prev) => !prev)}
        />
        <div
          className="absolute top-3 z-20 -translate-x-1/2"
          style={{
            left: !isMobile && drawerOpen ? "calc((100% + 24rem) / 2)" : "50%",
          }}
        >
          <Filters
            filters={filters}
            countryOptions={countryOptions}
            bodiesOfWaterOptions={bodiesOfWaterOptions}
            minYear={minYear}
            maxYear={maxYear}
          />
        </div>
      </div>
    </div>
  );
}
