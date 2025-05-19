"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl, { LngLatBoundsLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { mockMediaPoints } from "@/lib/data/mock-locations";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Initialize the map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/standard",
      center: [-98.5795, 39.8283], // United States center [lng, lat]
      zoom: 5, // starting zoom
    });

    // Add navigation controls (zoom in/out and rotation)
    map.current.addControl(new mapboxgl.NavigationControl(), "top-left");

    // Handle map load
    map.current.on("load", () => {
      setIsMapLoaded(true);
    });

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add data points to the map
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    // Create a GeoJSON feature collection from our mock data
    const geojson = {
      type: "FeatureCollection",
      features: mockMediaPoints.map((point) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [point.longitude, point.latitude],
        },
        properties: {
          id: point.id,
          title: point.title,
          description: point.description,
          mediaType: point.mediaType,
        },
      })),
    };

    // Add the source
    map.current.addSource("media-points", {
      type: "geojson",
      data: geojson as GeoJSON.FeatureCollection,
    });

    // Add a circle layer for the points
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

    // Fit to bounds
    map.current.fitBounds(
      geojson.features.map((f) => f.geometry.coordinates) as LngLatBoundsLike
    );

    // Add click interaction
    map.current.on("click", "media-points-layer", (e) => {
      if (!e.features || e.features.length === 0) return;

      const feature = e.features[0];
      const props = feature.properties;
      const coordinates = props?.coordinates;

      if (props && props.id) {
        // Create a popup
        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(
            `
            <h3 class="text-base font-semibold">${props.title}</h3>
            <p class="text-sm">${props.description}</p>
          `
          )
          .addTo(map.current!);
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
  }, [isMapLoaded]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
