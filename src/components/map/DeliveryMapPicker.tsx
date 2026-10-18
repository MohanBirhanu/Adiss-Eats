import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Compass, Store, AlertCircle, Info } from 'lucide-react';
import { DELIVERY_ZONES, RESTAURANT_BRANCHES, getClosestZoneByCoordinates } from '@/src/lib/delivery';
import { formatCurrency } from '@/src/lib/formatCurrency';
import L from 'leaflet';

interface DeliveryMapPickerProps {
  selectedArea: string;
  onAreaChange: (areaName: string, lat: number, lng: number) => void;
  customerLat?: number;
  customerLng?: number;
}

export function DeliveryMapPicker({
  selectedArea,
  onAreaChange,
  customerLat,
  customerLng,
}: DeliveryMapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const branchMarkersRef = useRef<L.Marker[]>([]);

  const defaultZone = DELIVERY_ZONES[selectedArea] || DELIVERY_ZONES.Bole;
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: customerLat || defaultZone.lat,
    lng: customerLng || defaultZone.lng,
  });

  const [activeZoneInfo, setActiveZoneInfo] = useState(defaultZone);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Fix default marker icon paths in Leaflet
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const initialLat = currentCoords.lat;
    const initialLng = currentCoords.lng;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    // Clean OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors | Addis Eats',
    }).addTo(map);

    // Custom Customer Pin Icon
    const customerPinIcon = L.divIcon({
      className: 'custom-customer-pin',
      html: `
        <div style="position: relative; width: 36px; height: 36px; transform: translate(-18px, -36px);">
          <div style="background-color: #ea580c; width: 36px; height: 36px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.4); border: 2px solid white;">
            <div style="width: 10px; height: 10px; background-color: white; border-radius: 50%; transform: rotate(45deg);"></div>
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
    });

    // Customer draggable marker
    const marker = L.marker([initialLat, initialLng], {
      icon: customerPinIcon,
      draggable: true,
      title: 'Your delivery location (drag to adjust)',
    }).addTo(map);

    marker.bindPopup(`<b>Your Dropoff Location</b><br/>Area: ${defaultZone.name}<br/>Fee: ETB ${defaultZone.fee}`).openPopup();

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      setCurrentCoords({ lat: pos.lat, lng: pos.lng });
      const closest = getClosestZoneByCoordinates(pos.lat, pos.lng);
      setActiveZoneInfo(closest);
      onAreaChange(closest.name, pos.lat, pos.lng);
      marker.setPopupContent(`<b>Dropoff Location</b><br/>Closest: <b>${closest.name}</b><br/>Fee: ETB ${closest.fee}`).openPopup();
    });

    // Map click to place marker
    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      setCurrentCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
      const closest = getClosestZoneByCoordinates(e.latlng.lat, e.latlng.lng);
      setActiveZoneInfo(closest);
      onAreaChange(closest.name, e.latlng.lat, e.latlng.lng);
      marker.setPopupContent(`<b>Dropoff Location</b><br/>Closest: <b>${closest.name}</b><br/>Fee: ETB ${closest.fee}`).openPopup();
    });

    // Restaurant Kitchen Branch Markers
    const branchIcon = L.divIcon({
      className: 'custom-branch-pin',
      html: `
        <div style="position: relative; width: 30px; height: 30px; transform: translate(-15px, -30px);">
          <div style="background-color: #15803d; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(0,0,0,0.3); border: 2px solid white; color: white; font-size: 13px; font-weight: bold;">
            🍲
          </div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });

    RESTAURANT_BRANCHES.forEach((b) => {
      const bMarker = L.marker([b.lat, b.lng], { icon: branchIcon }).addTo(map);
      bMarker.bindPopup(`<b>${b.name}</b><br/>${b.area}<br/>Tel: ${b.phone}`);
      branchMarkersRef.current.push(bMarker);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Sync when selectedArea prop changes from dropdown or clicks
  useEffect(() => {
    const zone = DELIVERY_ZONES[selectedArea];
    if (zone && mapInstanceRef.current && markerRef.current) {
      setActiveZoneInfo(zone);
      setCurrentCoords({ lat: zone.lat, lng: zone.lng });
      markerRef.current.setLatLng([zone.lat, zone.lng]);
      mapInstanceRef.current.flyTo([zone.lat, zone.lng], 14, { duration: 1 });
      markerRef.current.setPopupContent(`<b>Dropoff Location</b><br/>Zone: <b>${zone.name}</b><br/>Fee: ETB ${zone.fee}`).openPopup();
    }
  }, [selectedArea]);

  const handleZoneChipClick = (zoneKey: string) => {
    const zone = DELIVERY_ZONES[zoneKey];
    if (!zone) return;
    onAreaChange(zone.name, zone.lat, zone.lng);
  };

  const handleLocateMe = () => {
    if (navigator.geolocation && mapInstanceRef.current && markerRef.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCurrentCoords({ lat, lng });
          markerRef.current?.setLatLng([lat, lng]);
          mapInstanceRef.current?.flyTo([lat, lng], 15);
          const closest = getClosestZoneByCoordinates(lat, lng);
          setActiveZoneInfo(closest);
          onAreaChange(closest.name, lat, lng);
        },
        () => {
          // If denied, fallback to Bole center
          handleZoneChipClick('Bole');
        }
      );
    }
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-lg">
              <MapPin className="w-5 h-5" />
            </span>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Interactive Addis Ababa Delivery Map
            </h3>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Click anywhere on the map or select a neighborhood to set your delivery pin.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLocateMe}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Navigation className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          Center Addis Ababa
        </button>
      </div>

      {/* Quick Select Zone Chips */}
      <div>
        <div className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-2">
          Select Delivery Neighborhood:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.values(DELIVERY_ZONES).map((z) => {
            const isSelected = selectedArea === z.name;
            return (
              <button
                key={z.name}
                type="button"
                onClick={() => handleZoneChipClick(z.name)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-500/30'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {z.name} (ETB {z.fee})
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative w-full `h-65` `sm:h-75` rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-inner">
        <div ref={mapContainerRef} className="w-full h-full" />
        
        {/* Floating live info badge on map */}
        <div className="absolute top-3 right-3 z-20 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-stone-200 dark:border-stone-800 text-xs flex flex-col gap-0.5">
          <div className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Zone: {activeZoneInfo.name}
          </div>
          <div className="text-stone-600 dark:text-stone-300">
            Delivery Fee: <span className="font-bold text-amber-600 dark:text-amber-400">ETB {activeZoneInfo.fee}</span>
          </div>
          <div className="text-stone-500 dark:text-stone-400">
            ETA: {activeZoneInfo.estimatedTime}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-2 left-2 z-20 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-[10px] text-stone-600 dark:text-stone-300 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600 inline-block"></span> Your Pin (Draggable)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 inline-block"></span> Addis Eats Kitchens
          </span>
        </div>
      </div>

      {/* Selected Zone Specs Bar */}
      <div className="bg-stone-50 dark:bg-stone-800/60 rounded-xl p-3 border border-stone-200/80 dark:border-stone-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <span className="font-semibold text-stone-900 dark:text-stone-100">
            {activeZoneInfo.name} Delivery Zone
          </span>
          <p className="text-stone-500 dark:text-stone-400 text-[11px]">
            {activeZoneInfo.description}
          </p>
          <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-stone-600 dark:text-stone-300">
            <span className="font-medium text-stone-500">Popular hubs:</span>
            {activeZoneInfo.popularSpots.map((spot, idx) => (
              <span key={spot} className="bg-stone-200/70 dark:bg-stone-700/70 px-1.5 py-0.5 rounded">
                {spot}{idx < activeZoneInfo.popularSpots.length - 1 ? '' : ''}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-stone-200 dark:border-stone-700 pt-2 sm:pt-0 sm:pl-4 shrink-0">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400">Fee</div>
            <div className="font-bold text-sm text-amber-600 dark:text-amber-400">
              ETB {activeZoneInfo.fee}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400">Est. Time</div>
            <div className="font-bold text-sm text-stone-900 dark:text-stone-100">
              {activeZoneInfo.minMinutes}–{activeZoneInfo.maxMinutes} min
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
