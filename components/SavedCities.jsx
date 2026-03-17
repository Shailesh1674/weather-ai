"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { MapPin, Trash2, Loader2, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SavedCities({ onSelectCity, newSaveTrigger }) {
  const { data: session } = useSession();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCities = async () => {
    if (!session) return;
    try {
      const res = await axios.get("/api/saved-cities");
      setCities(res.data);
    } catch (err) {
      console.error("Failed to fetch saved cities", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchCities();
    else {
      setLoading(false);
      setCities([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, newSaveTrigger]);

  const removeCity = async (e, id) => {
    e.stopPropagation();
    try {
      await axios.delete(`/api/saved-cities?id=${id}`);
      setCities(cities.filter(c => c._id !== id));
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  if (loading) return null;
  if (!session || cities.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-4 w-full flex overflow-x-auto gap-4 custom-scrollbar items-center shadow-lg"
    >
      <div className="flex items-center text-white/90 mr-2 flex-shrink-0 bg-white/5 py-2 px-4 rounded-full border border-white/10">
        <Star className="w-5 h-5 mr-2 text-yellow-400 fill-yellow-400" />
        <span className="font-semibold tracking-wide">Favorites</span>
      </div>
      
      <AnimatePresence>
        {cities.map((city) => (
          <motion.div 
            key={city._id}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => onSelectCity(city.lat, city.lon, city.name)}
            className="flex-shrink-0 flex items-center gap-3 bg-white/10 hover:bg-white/20 transition cursor-pointer px-5 py-2.5 rounded-full border border-white/10 group shadow-sm"
          >
            <MapPin className="w-5 h-5 text-blue-300" />
            <span className="font-medium text-white">{city.name}</span>
            <button 
              onClick={(e) => removeCity(e, city._id)}
              className="opacity-0 group-hover:opacity-100 transition text-white/50 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded-full -mr-2"
              title="Remove city"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
