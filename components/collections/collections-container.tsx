"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Collection, MapFilters, MediaLocation } from "@/lib/airtable/types";
import { resolveLocationsForCollection } from "@/lib/collections/resolve-collection-locations";
import { cn, computeMapBounds } from "@/lib/utils";
import { Map } from "@/components/map";
import { STYLES, MapStyle } from "@/lib/map-utils";
import { CollectionsDrawer } from "@/components/collections/collections-drawer";
import { BasemapToggle } from "@/components/basemap-toggle";
import { useIsTablet } from "@/components/hooks/use-tablet";
import { TooltipProvider } from "@/components/ui/tooltip";

const MIN_DRAWER_WIDTH_PX = 280;
const LG_BREAKPOINT_PX = 1024;
const DEFAULT_DRAWER_WIDTH_NARROW_PX = 320;
const DEFAULT_DRAWER_WIDTH_WIDE_PX = 384;

const EMPTY_FILTERS: MapFilters = {
  countries: [],
  regions: [],
  bodiesOfWater: [],
  startYear: "",
  endYear: "",
};

/** Collections view: left panel starts at 40% of the window (map view was edited to be the same). */
function defaultCollectionsDrawerWidthPx(): number {
  if (typeof window === "undefined") return DEFAULT_DRAWER_WIDTH_WIDE_PX;
  return Math.floor(window.innerWidth * 0.4);
}


function maxDrawerWidthPx(): number {
  if (typeof window === "undefined") return DEFAULT_DRAWER_WIDTH_WIDE_PX * 2;
  return Math.floor(window.innerWidth * 0.5);
}

function clampDrawerWidthPx(w: number): number {
  const max = maxDrawerWidthPx();
  return Math.min(max, Math.max(MIN_DRAWER_WIDTH_PX, Math.round(w)));
}

interface CollectionsContainerProps {
  collections: Collection[];
  allMediaPoints: MediaLocation[];
  markdownByCollectionId: Record<string, string>;
}

export default function CollectionsContainer({
  collections,
  allMediaPoints,
  markdownByCollectionId,
}: CollectionsContainerProps) {
  const searchParams = useSearchParams();
  const collectionId = searchParams.get("collectionId");
  const [prevCollectionId, setPrevCollectionId] = useState(collectionId);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [mapStyle, setMapStyle] = useState<MapStyle>("standard");
  const [drawerWidthPx, setDrawerWidthPx] = useState(() =>
    clampDrawerWidthPx(defaultCollectionsDrawerWidthPx())
  );
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const isTablet = useIsTablet();

  const selectedCollection = collectionId
    ? collections.find((c) => c.id === collectionId)
    : null;

  const collectionLocations = useMemo(() => {
    if (!selectedCollection) return [];
    return resolveLocationsForCollection(selectedCollection, allMediaPoints);
  }, [selectedCollection, allMediaPoints]);

   const mapBounds = useMemo(
    () => computeMapBounds(allMediaPoints),
    [allMediaPoints]
  );
  
  useEffect(() => {
    if (isTablet) return;
    if (!mapInstanceRef.current) return;
    const id1 = window.requestAnimationFrame(() => {
      const id2 = window.requestAnimationFrame(() => {
        mapInstanceRef.current?.resize();
      });
      return () => window.cancelAnimationFrame(id2);
    });
    return () => window.cancelAnimationFrame(id1);
  }, [drawerWidthPx, drawerOpen, isTablet]);

  useEffect(() => {
    function onResize() {
      setDrawerWidthPx((w) => clampDrawerWidthPx(w));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (collectionId !== prevCollectionId) {
    setPrevCollectionId(collectionId);
    if (collectionId) setDrawerOpen(true);
  }

  const handleMapReady = useCallback((map: mapboxgl.Map) => {
    mapInstanceRef.current = map;
  }, []);

  const handleDrawerToggle = useCallback(() => {
    setDrawerOpen((prev) => !prev);
  }, []);

  const handleBasemapToggle = useCallback(() => {
    setMapStyle((prev) => (prev === "standard" ? "satellite" : "standard"));
  }, []);

  const handleDrawerWidthChange = useCallback((w: number) => {
    setDrawerWidthPx(clampDrawerWidthPx(w));
  }, []);

  const handleDrawerWidthCommit = useCallback((w: number) => {
    setDrawerWidthPx(clampDrawerWidthPx(w));
  }, []);

  const drawerProps = {
    collections,
    markdownByCollectionId,
    locationsForSelectedCollection: collectionLocations,
    isOpen: drawerOpen,
    onToggle: handleDrawerToggle,
    drawerWidthPx,
    onDrawerWidthChange: handleDrawerWidthChange,
    onDrawerWidthCommit: handleDrawerWidthCommit,
  };

  return (
    <div className="w-full relative h-[calc(100vh-4rem)]">
      {isTablet ? (
        <div className="relative w-full h-full overflow-hidden">
          <Map
            data={collectionLocations}
            bounds={mapBounds}
            filters={EMPTY_FILTERS}
            styleUrl={STYLES[mapStyle]}
            onMapReady={handleMapReady}
            enableInitialRandomSelection={false}
          />
          <CollectionsDrawer {...drawerProps} />
          <TooltipProvider>
            <BasemapToggle mapStyle={mapStyle} onToggle={handleBasemapToggle} />
          </TooltipProvider>
        </div>
      ) : (
        <div className="w-full h-full overflow-hidden flex">
          {drawerOpen ? <CollectionsDrawer {...drawerProps} /> : null}
          <div className="relative flex-1 min-w-0">
            <Map
              data={collectionLocations}
              bounds={mapBounds}
              filters={EMPTY_FILTERS}
              styleUrl={STYLES[mapStyle]}
              onMapReady={handleMapReady}
              enableInitialRandomSelection={false}
            />
            <TooltipProvider>
              <BasemapToggle mapStyle={mapStyle} onToggle={handleBasemapToggle} />
            </TooltipProvider>
            {!drawerOpen ? <CollectionsDrawer {...drawerProps} /> : null}
          </div>
        </div>
      )}
    </div>
  );
}
