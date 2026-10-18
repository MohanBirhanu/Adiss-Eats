import React, { useEffect, useRef, useState } from 'react';
import { Bike, CheckCircle2, Clock, MapPin, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { Order } from '@/src/types/order';
import { DELIVERY_ZONES, RESTAURANT_BRANCHES } from '@/src/lib/delivery';
import L from 'leaflet';

interface DeliveryTrackerMapProps {
  order: Order;
}

export function DeliveryTrackerMap({ order }: DeliveryTrackerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);

  const zone = DELIVERY_ZONES[order.customer.area] || DELIVERY_ZONES.Bole;
  const kitchen = RESTAURANT_BRANCHES[0]; // Bole Flagship Kitchen

  const customerLat = order.customer.lat || zone.lat;
  const customerLng = order.customer.lng || zone.lng;

  const [deliveryProgress, setDeliveryProgress] = useState(
    order.status === 'delivered' ? 100 : order.status === 'delivering' ? 65 : order.status === 'preparing' ? 30 : 10
  );
  const [currentStepText, setCurrentStepText] = useState('Order received at kitchen');

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center between kitchen and customer
    const midLat = (kitchen.lat + customerLat) / 2;
    const midLng = (kitchen.lng + customerLng) / 2;

    const map = L.map(mapContainerRef.current, {
      center: [midLat, midLng],
      zoom: 13,
      zoomControl: false,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap | Addis Eats Live Tracker',
    }).addTo(map);

    // Kitchen Marker
    const kitchenIcon = L.divIcon({
      className: 'tracker-kitchen-pin',
      html: `
        <div style="background-color: #15803d; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-size: 16px;">
          👨‍🍳
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    L.marker([kitchen.lat, kitchen.lng], { icon: kitchenIcon })
      .addTo(map)
      .bindPopup(`<b>${kitchen.name}</b><br/>Order preparing here`);

    // Customer Marker
    const customerIcon = L.divIcon({
      className: 'tracker-customer-pin',
      html: `
        <div style="background-color: #ea580c; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 10px rgba(234,88,12,0.4); font-size: 16px;">
          📍
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    L.marker([customerLat, customerLng], { icon: customerIcon })
      .addTo(map)
      .bindPopup(`<b>Delivery Destination</b><br/>${order.customer.name} (${order.customer.area})`);

    // Route Polyline
    const routeCoords: [number, number][] = [
      [kitchen.lat, kitchen.lng],
      [(kitchen.lat * 2 + customerLat) / 3 + 0.003, (kitchen.lng * 2 + customerLng) / 3 - 0.002],
      [(kitchen.lat + customerLat * 2) / 3 - 0.002, (kitchen.lng + customerLng * 2) / 3 + 0.001],
      [customerLat, customerLng],
    ];

    const polyline = L.polyline(routeCoords, {
      color: '#ea580c',
      weight: 5,
      opacity: 0.85,
      dashArray: '8, 8',
    }).addTo(map);

    map.fitBounds(polyline.getBounds(), { padding: [40, 40] });

    // Animated Driver Marker (Motorbike / Bajaj)
    const driverIcon = L.divIcon({
      className: 'tracker-driver-pin',
      html: `
        <div style="background-color: #b45309; color: white; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 14px rgba(180,83,9,0.5); font-size: 18px; animation: bounce 1.5s infinite;">
          🛵
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
    });

    const initialT = order.status === 'delivered' ? 1 : order.status === 'delivering' ? 0.65 : 0.2;
    const initialDriverLat = kitchen.lat + (customerLat - kitchen.lat) * initialT;
    const initialDriverLng = kitchen.lng + (customerLng - kitchen.lng) * initialT;

    const driverMarker = L.marker([initialDriverLat, initialDriverLng], { icon: driverIcon }).addTo(map);
    driverMarkerRef.current = driverMarker;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [customerLat, customerLng, kitchen.lat, kitchen.lng, order]);

  // Live simulation progress animation interval
  useEffect(() => {
    if (order.status === 'delivered') {
      setDeliveryProgress(100);
      setCurrentStepText('Delivered! Bon appétit / መልካም ምግብ!');
      return;
    }

    const interval = setInterval(() => {
      setDeliveryProgress((prev) => {
        const next = prev < 95 ? prev + 1 : 95;
        if (next < 30) {
          setCurrentStepText('Kitchen is freshly baking injera and packaging your food.');
        } else if (next < 70) {
          setCurrentStepText('Driver Abebe picked up your order and is en route on Bole Road.');
        } else {
          setCurrentStepText('Driver is 2 minutes away from your delivery pin.');
        }

        // Update driver marker position smoothly along path
        if (driverMarkerRef.current) {
          const t = next / 100;
          const currentLat = kitchen.lat + (customerLat - kitchen.lat) * t;
          const currentLng = kitchen.lng + (customerLng - kitchen.lng) * t;
          driverMarkerRef.current.setLatLng([currentLat, currentLng]);
        }

        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [customerLat, customerLng, kitchen.lat, kitchen.lng, order.status]);

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
      {/* Tracker Header */}
      <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 rounded-lg">
              <Bike className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                Live Courier Tracking — Addis Ababa
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Order ID: <span className="font-mono font-semibold text-stone-700 dark:text-stone-300">{order.id}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            Est. Arrival: {order.estimatedDeliveryTime}
          </div>
        </div>
      </div>

      {/* Map View */}
      <div className="relative w-full h-[280px] sm:h-[320px]">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Live floating driver card on map */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs z-20 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-stone-200 dark:border-stone-800 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold">
                AT
              </div>
              <div>
                <div className="font-bold text-stone-900 dark:text-stone-100">Abebe Tadesse</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Addis Eats Express Courier
                </div>
              </div>
            </div>
            <a
              href="tel:0911223344"
              className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
              title="Call driver"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="text-[11px] text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 p-2 rounded-lg leading-tight">
            📍 <span className="font-semibold">{currentStepText}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar & Status Steps */}
      <div className="p-4 sm:p-5 bg-stone-50/50 dark:bg-stone-800/30 border-t border-stone-200 dark:border-stone-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
          <span>Delivery Progress</span>
          <span>{deliveryProgress}%</span>
        </div>
        <div className="w-full bg-stone-200 dark:bg-stone-700 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-amber-600 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${deliveryProgress}%` }}
          />
        </div>

        {/* Status checkpoints */}
        <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[11px]">
          <div className={`space-y-1 ${deliveryProgress >= 15 ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-stone-400'}`}>
            <div className="mx-auto w-3 h-3 rounded-full border-2 border-current bg-white dark:bg-stone-900"></div>
            <div>Confirmed</div>
          </div>
          <div className={`space-y-1 ${deliveryProgress >= 40 ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-stone-400'}`}>
            <div className="mx-auto w-3 h-3 rounded-full border-2 border-current bg-white dark:bg-stone-900"></div>
            <div>Preparing</div>
          </div>
          <div className={`space-y-1 ${deliveryProgress >= 70 ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-stone-400'}`}>
            <div className="mx-auto w-3 h-3 rounded-full border-2 border-current bg-white dark:bg-stone-900"></div>
            <div>On the Way</div>
          </div>
          <div className={`space-y-1 ${deliveryProgress >= 100 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-stone-400'}`}>
            <div className="mx-auto w-3 h-3 rounded-full border-2 border-current bg-white dark:bg-stone-900"></div>
            <div>Delivered</div>
          </div>
        </div>
      </div>
    </div>
  );
}
