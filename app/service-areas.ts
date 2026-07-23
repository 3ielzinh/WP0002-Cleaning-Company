export type ServiceArea = {
  name: string;
  mapLabel: string;
  region: string;
  coordinates: readonly [number, number];
  primary?: boolean;
};

export const serviceAreas: readonly ServiceArea[] = [
  {
    name: "Sacramento and surrounding areas",
    mapLabel: "Sacramento",
    region: "Primary service area",
    coordinates: [38.5816, -121.4944],
    primary: true,
  },
  { name: "Gold River", mapLabel: "Gold River", region: "American River corridor", coordinates: [38.6263, -121.2466] },
  { name: "Rancho Cordova", mapLabel: "Rancho Cordova", region: "American River corridor", coordinates: [38.5891, -121.3027] },
  { name: "Roseville", mapLabel: "Roseville", region: "Northern communities", coordinates: [38.7521, -121.288] },
  { name: "Rocklin", mapLabel: "Rocklin", region: "Northern communities", coordinates: [38.7907, -121.2358] },
  { name: "Lincoln", mapLabel: "Lincoln", region: "Northern communities", coordinates: [38.8916, -121.293] },
  { name: "Granite Bay", mapLabel: "Granite Bay", region: "Northern communities", coordinates: [38.7632, -121.1638] },
  { name: "Citrus Heights", mapLabel: "Citrus Heights", region: "Northeast Sacramento", coordinates: [38.7071, -121.2811] },
  { name: "Antelope", mapLabel: "Antelope", region: "Northern communities", coordinates: [38.7082, -121.3299] },
  { name: "North Highlands", mapLabel: "North Highlands", region: "North Sacramento", coordinates: [38.673, -121.3727] },
  { name: "West Sacramento", mapLabel: "West Sacramento", region: "Sacramento metro", coordinates: [38.5805, -121.5302] },
  { name: "Orangevale", mapLabel: "Orangevale", region: "Northeast Sacramento", coordinates: [38.6785, -121.2258] },
  { name: "Carmichael", mapLabel: "Carmichael", region: "American River corridor", coordinates: [38.6171, -121.3283] },
  { name: "North Natomas", mapLabel: "North Natomas", region: "Sacramento metro", coordinates: [38.671, -121.5066] },
  { name: "Natomas", mapLabel: "Natomas", region: "Sacramento metro", coordinates: [38.6383, -121.508] },
  { name: "Elk Grove", mapLabel: "Elk Grove", region: "Southern coverage", coordinates: [38.4088, -121.3716] },
  { name: "El Dorado Hills", mapLabel: "El Dorado Hills", region: "Foothills coverage", coordinates: [38.6858, -121.0822] },
  { name: "Folsom", mapLabel: "Folsom", region: "American River corridor", coordinates: [38.6779, -121.1761] },
  { name: "Fair Oaks", mapLabel: "Fair Oaks", region: "American River corridor", coordinates: [38.6446, -121.2722] },
] as const;
