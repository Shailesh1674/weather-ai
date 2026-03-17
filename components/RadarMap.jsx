"use client";

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from "lucide-react";
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import L from 'leaflet';

export default function RadarMap({ location }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const radarLayerRef = useRef(null);
  
  const [timestamps, setTimestamps] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Initialize Map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView([51.5074, -0.1278], 6);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO',
      }).addTo(map);

      mapInstanceRef.current = map;
    }
    
    return () => {
       if (mapInstanceRef.current) {
           mapInstanceRef.current.remove();
           mapInstanceRef.current = null;
       }
    };
  }, []);

  // Handle Location changes
  useEffect(() => {
    if (location && location.lat && location.lon && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([location.lat, location.lon], 6, { animate: true, duration: 1.5 });
    }
  }, [location]);

  // Fetch Radar Timestamps
  useEffect(() => {
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then(res => res.json())
      .then(data => {
        if (data.radar && data.radar.past) {
          const times = data.radar.past.map(item => item.time);
          setTimestamps(times);
          setCurrentIndex(times.length - 1);
        }
      })
      .catch(console.error);
  }, []);

  // Handle Animation loop
  useEffect(() => {
    let interval;
    if (isPlaying && timestamps.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % timestamps.length);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timestamps]);

  // Handle radar layer updates
  useEffect(() => {
    if (!mapInstanceRef.current || timestamps.length === 0) return;
    
    const time = timestamps[currentIndex];
    const tileUrl = `https://tilecache.rainviewer.com/v2/radar/${time}/256/{z}/{x}/{y}/2/1_1.png`;
    
    // add new layer
    const newLayer = L.tileLayer(tileUrl, {
      opacity: 0.85,
      zIndex: 10
    }).addTo(mapInstanceRef.current);
    
    // remove old layer
    if (radarLayerRef.current) {
      mapInstanceRef.current.removeLayer(radarLayerRef.current);
    }
    radarLayerRef.current = newLayer;
    
  }, [currentIndex, timestamps]);

  const currentTime = timestamps[currentIndex];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-panel p-6 w-full flex flex-col gap-4 mt-0"
    >
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">Live Rain Radar</h3>
        
        {timestamps.length > 0 && (
          <div className="flex items-center gap-4 bg-black/40 px-5 py-2 rounded-full border border-white/20 shadow-md">
            <span className="text-sm font-medium w-16 text-center text-white/90">
              {new Date(currentTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <div className="w-px h-6 bg-white/20"></div>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white hover:text-blue-400 transition"
              title={isPlaying ? "Pause animation" : "Play animation"}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>
          </div>
        )}
      </div>
      
      <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl relative border border-white/10 bg-gray-900 z-0">
        <div ref={mapRef} className="w-full h-full" />
      </div>
    </motion.div>
  );
}
