export type MediaPoint = {
  id: string;
  longitude: number;
  latitude: number;
  title: string;
  description: string;
  mediaType: "image" | "video" | "audio" | "text";
  url?: string;
};

// Mock data points for the map
export const mockMediaPoints: MediaPoint[] = [
  {
    id: "1",
    longitude: -122.4194,
    latitude: 37.7749,
    title: "San Francisco Bay",
    description: "Water conservation efforts in the San Francisco Bay area.",
    mediaType: "image",
    url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
  },
  {
    id: "2",
    longitude: -74.0060,
    latitude: 40.7128,
    title: "New York City Water System",
    description: "The New York City water system, supplying clean water to millions.",
    mediaType: "image",
    url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
  },
  {
    id: "3",
    longitude: -90.1994,
    latitude: 38.6270,
    title: "Mississippi River",
    description: "The mighty Mississippi River and its impact on local ecosystems.",
    mediaType: "image",
    url: "https://images.unsplash.com/photo-1591377695681-8fe59e95b3d3",
  },
  {
    id: "4",
    longitude: -83.0458,
    latitude: 42.3314,
    title: "Detroit Water Crisis",
    description: "Documenting the ongoing water challenges in Detroit.",
    mediaType: "image",
    url: "https://images.unsplash.com/photo-1541435969598-ce356e6e40d9",
  },
  {
    id: "5",
    longitude: -118.2437,
    latitude: 34.0522,
    title: "Los Angeles Drought",
    description: "Effects of drought on the Los Angeles metropolitan area.",
    mediaType: "image",
    url: "https://images.unsplash.com/photo-1580974852861-c381510bc98e",
  },
];