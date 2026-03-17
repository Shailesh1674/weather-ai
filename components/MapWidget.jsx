"use client";

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import L from 'leaflet';

export default function MapWidget({ location }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView([51.5074, -0.1278], 10);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    // Update location and marker
    if (location && location.lat && location.lon && mapInstanceRef.current) {
      const { lat, lon } = location;
      const map = mapInstanceRef.current;
      
      map.flyTo([lat, lon], 10, { animate: true, duration: 1.5 });
      
      // clear old markers
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
      
      L.marker([lat, lon]).addTo(map);
    }

    return () => {
      // cleanup is handled on unmount, but we keep map alive between updates
    };
  }, [location]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-panel p-6 w-full flex flex-col gap-4"
    >
      <div className="flex justify-between items-center gap-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">Location Map</h3>
      </div>
      
      <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl relative border border-white/5 z-0">
        <div ref={mapRef} className="w-full h-full" />
      </div>
    </motion.div>
  );
}
