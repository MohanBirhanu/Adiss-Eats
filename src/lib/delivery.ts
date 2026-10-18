export interface DeliveryZone {
  name: string;
  fee: number;
  estimatedTime: string;
  minMinutes: number;
  maxMinutes: number;
  lat: number;
  lng: number;
  description: string;
  popularSpots: string[];
}

export const DELIVERY_ZONES: Record<string, DeliveryZone> = {
  Bole: {
    name: 'Bole',
    fee: 80,
    estimatedTime: '20–30 minutes',
    minMinutes: 20,
    maxMinutes: 30,
    lat: 9.0012,
    lng: 38.7845,
    description: 'Medhanealem, Atlas, Rwanda, Edna Mall & Airport Road',
    popularSpots: ['Edna Mall', 'Atlas Hotel', 'Bole Medhanealem', 'Rwanda Embassy Area'],
  },
  Kazanchis: {
    name: 'Kazanchis',
    fee: 100,
    estimatedTime: '25–35 minutes',
    minMinutes: 25,
    maxMinutes: 35,
    lat: 9.0185,
    lng: 38.7712,
    description: 'UN ECA, Intercontinental, Bambis Supermarket & Menelik II Ave',
    popularSpots: ['UN ECA HQ', 'Intercontinental Hotel', 'Bambis', 'Radisson Blu'],
  },
  Piassa: {
    name: 'Piassa',
    fee: 120,
    estimatedTime: '30–40 minutes',
    minMinutes: 30,
    maxMinutes: 40,
    lat: 9.0345,
    lng: 38.7523,
    description: 'Arada, Churchill Avenue, De Gaulle Square & Taitu Hotel',
    popularSpots: ['Taitu Hotel', 'Churchill Avenue', 'Arada Georgis', 'Cinema Empire'],
  },
  CMC: {
    name: 'CMC',
    fee: 150,
    estimatedTime: '35–45 minutes',
    minMinutes: 35,
    maxMinutes: 45,
    lat: 9.0192,
    lng: 38.8351,
    description: 'CMC Michael, Ayat, Salite Mehret & Civil Service',
    popularSpots: ['CMC Roundabout', 'St. Michael Church', 'Ayat Zone 2', 'Meri Luke'],
  },
  Sarbet: {
    name: 'Sarbet',
    fee: 110,
    estimatedTime: '25–35 minutes',
    minMinutes: 25,
    maxMinutes: 35,
    lat: 8.9921,
    lng: 38.7354,
    description: 'African Union, Bisrate Gabriel, Old Airport & Karl Square',
    popularSpots: ['African Union HQ', 'Bisrate Gabriel Church', 'Old Airport Golf Club'],
  },
  Mexico: {
    name: 'Mexico',
    fee: 100,
    estimatedTime: '25–35 minutes',
    minMinutes: 25,
    maxMinutes: 35,
    lat: 9.0115,
    lng: 38.7495,
    description: 'Mexico Square, Sengatera Financial District, Legehar & Stadium',
    popularSpots: ['Mexico Square', 'Commercial Bank Tower', 'Legehar Train Station'],
  },
  Gerji: {
    name: 'Gerji',
    fee: 130,
    estimatedTime: '30–40 minutes',
    minMinutes: 30,
    maxMinutes: 40,
    lat: 8.9950,
    lng: 38.8050,
    description: 'Imperial Hotel area, Sunshine Real Estate, Unity University & Jackros',
    popularSpots: ['Imperial Hotel', 'Unity University', 'Jackros Condominium'],
  },
  Other: {
    name: 'Other',
    fee: 200,
    estimatedTime: '45–60 minutes',
    minMinutes: 45,
    maxMinutes: 60,
    lat: 9.0200,
    lng: 38.7600,
    description: 'Greater Addis Ababa sub-cities and peripheral districts',
    popularSpots: ['Kotebe', 'Tor Hailoch', 'Gotera', 'Kaliti'],
  },
};

export const RESTAURANT_BRANCHES = [
  {
    id: 'bole-flagship',
    name: 'Addis Eats Flagship Kitchen',
    lat: 9.0035,
    lng: 38.7830,
    area: 'Bole Medhanealem',
    phone: '+251 91 123 4567',
  },
  {
    id: 'kazanchis-hub',
    name: 'Addis Eats Central Hub',
    lat: 9.0180,
    lng: 38.7705,
    area: 'Kazanchis Menelik Ave',
    phone: '+251 91 234 5678',
  },
  {
    id: 'piassa-kitchen',
    name: 'Addis Eats Heritage Kitchen',
    lat: 9.0340,
    lng: 38.7510,
    area: 'Piassa Arada',
    phone: '+251 91 345 6789',
  },
];

/**
 * Calculates delivery fee based on selected area name.
 */
export function calculateDeliveryFee(areaName: string): number {
  const zone = DELIVERY_ZONES[areaName];
  if (zone) return zone.fee;
  return 200; // Default for other areas
}

/**
 * Calculates estimated delivery time string based on area name.
 */
export function getEstimatedDeliveryTime(areaName: string): string {
  const zone = DELIVERY_ZONES[areaName];
  if (zone) return zone.estimatedTime;
  return '45–60 minutes';
}

/**
 * Find closest delivery zone based on lat/lng coordinates (Euclidean approximation for city scale)
 */
export function getClosestZoneByCoordinates(lat: number, lng: number): DeliveryZone {
  let closestZone = DELIVERY_ZONES.Bole;
  let minDistance = Infinity;

  Object.values(DELIVERY_ZONES).forEach((zone) => {
    const dLat = zone.lat - lat;
    const dLng = zone.lng - lng;
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    if (dist < minDistance) {
      minDistance = dist;
      closestZone = zone;
    }
  });

  return closestZone;
}
