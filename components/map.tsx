"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import mapboxgl, { GeoJSONSource, LngLatBoundsLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MediaLocation } from "@/lib/airtable/types";
import { CameraIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

const DEFAULT_BOUNDS = [
  [-63.34638, 14.18116],
  [69.37245, 63.28781],
] as LngLatBoundsLike;
const DEFAULT_ZOOM = 5;

export function Map({
  data,
  bounds,
}: {
  data: MediaLocation[];
  bounds: LngLatBoundsLike;
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Grab the idea of the selected media point from the URL
  const searchParams = useSearchParams();
  const mediaPointId = searchParams.get("mediaPointId");

  // Find the selected media point in the data
  const selectedMediaPoint = mediaPointId
    ? data.find((point) => point.id === mediaPointId)
    : null;

  /** =============================================== */
  /** Initialize the map */
  /** =============================================== */
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/standard",
      bounds: bounds || DEFAULT_BOUNDS,
      zoom: DEFAULT_ZOOM,
      preserveDrawingBuffer: true, // has to be set to true for screenshot to work
    });

    // Add navigation controls (zoom in/out and rotation)
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Handle map load
    map.current.on("load", () => {
      setIsMapLoaded(true);
    });

    // Make map container focusable and add keyboard navigation
    const container = mapContainer.current;
    if (container) {
      container.setAttribute("tabindex", "0");
      container.setAttribute("role", "application");
      container.setAttribute(
        "aria-label",
        "Interactive map showing media locations. Use arrow keys to navigate, plus/minus to zoom."
      );

      // Keyboard navigation
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!map.current) return;

        // Dynamic step size based on zoom level
        // Higher zoom = smaller steps for precision
        // Lower zoom = larger steps for faster navigation
        const zoom = map.current.getZoom();
        let step = 4;

        if (zoom >= 7 && zoom < 10) {
          step = 1;
        } else if (zoom >= 10 && zoom < 12) {
          step = 0.1;
        } else if (zoom >= 12) {
          step = 0.01;
        }

        const center = map.current.getCenter();

        switch (e.key) {
          case "ArrowUp":
            e.preventDefault();
            map.current.panTo([center.lng, center.lat + step]);
            break;
          case "ArrowDown":
            e.preventDefault();
            map.current.panTo([center.lng, center.lat - step]);
            break;
          case "ArrowLeft":
            e.preventDefault();
            map.current.panTo([center.lng - step, center.lat]);
            break;
          case "ArrowRight":
            e.preventDefault();
            map.current.panTo([center.lng + step, center.lat]);
            break;
          case "+":
          case "=":
            e.preventDefault();
            map.current.zoomIn();
            break;
          case "-":
            e.preventDefault();
            map.current.zoomOut();
            break;
        }
      };

      container.addEventListener("keydown", handleKeyDown);

      // Cleanup keyboard handler
      return () => {
        container.removeEventListener("keydown", handleKeyDown);
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    }

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** =============================================== */
  /** Add spatial data to the map */
  /** =============================================== */
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    const geojson = {
      type: "FeatureCollection",
      features: data.map((point) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [point.longitude, point.latitude],
        },
        properties: {
          ...point,
        },
      })),
    };

    const existingSource = map.current.getSource("media-points");

    if (existingSource) {
      (existingSource as GeoJSONSource).setData(
        geojson as GeoJSON.FeatureCollection
      );
    } else {
      map.current.addSource("media-points", {
        type: "geojson",
        data: geojson as GeoJSON.FeatureCollection,
      });
    }

    const existingLayer = map.current.getLayer("media-points-layer");

    if (!existingLayer) {
      map.current.addLayer({
        id: "media-points-layer",
        type: "circle",
        source: "media-points",
        paint: {
          "circle-radius": 8,
          "circle-color": "#4264fb",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });
    }

    // Add click interaction
    map.current.on("click", "media-points-layer", (e) => {
      if (!e.features || e.features.length === 0) return;

      const feature = e.features[0];
      const props = feature.properties;

      if (props && props.id) {
        window.history.pushState({}, "", `?mediaPointId=${props.id}`);
      }
    });

    // Change cursor on hover
    map.current.on("mouseenter", "media-points-layer", () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = "pointer";
      }
    });

    map.current.on("mouseleave", "media-points-layer", () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = "";
      }
    });

    // Cleanup
    return () => {
      if (map.current) {
        if (map.current.getLayer("media-points-layer")) {
          map.current.removeLayer("media-points-layer");
        }
        if (map.current.getSource("media-points")) {
          map.current.removeSource("media-points");
        }
      }
    };
  }, [isMapLoaded, data]);

  /** =============================================== */
  /** Pan the map to the selected media point
   *
   * Also, change the color and radius of the selected media point
   */
  /** =============================================== */
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    if (selectedMediaPoint) {
      map.current.flyTo({
        center: [selectedMediaPoint.longitude, selectedMediaPoint.latitude],
      });

      map.current.setPaintProperty("media-points-layer", "circle-color", [
        "case",
        ["==", ["get", "id"], selectedMediaPoint.id],
        "#15cc09",
        "#4264fb",
      ]);

      map.current.setPaintProperty("media-points-layer", "circle-radius", [
        "case",
        ["==", ["get", "id"], selectedMediaPoint.id],
        12,
        8,
      ]);
    } else {
      map.current.setPaintProperty(
        "media-points-layer",
        "circle-color",
        "#4264fb"
      );

      map.current.setPaintProperty("media-points-layer", "circle-radius", 8);
    }
  }, [selectedMediaPoint, isMapLoaded]);

  return (
    <div className="w-full h-full relative">
      <div
        ref={mapContainer}
        className="w-full h-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-26 right-2 z-10 bg-white shadow-lg"
              onClick={() => {
                const canvas = map.current?.getCanvas();
                const dataURL = canvas?.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = dataURL || "";
                const timestamp = new Date().toISOString().split("T")[0];
                link.download = `map-screenshot-${timestamp}.png`;
                link.click();
              }}
              aria-label="Take screenshot of current map view"
            >
              <CameraIcon className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Take screenshot of current map view</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
