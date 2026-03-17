"use client";

import { useState, useRef } from "react";
import { Search, MapPin, X } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function CitySearch({ onLocationSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const debounceRef = useRef(null);

  const doSearch = async (searchQuery) => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await axios.get(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.data && Array.isArray(res.data)) {
        setResults(res.data);
        setOpen(res.data.length > 0);
        if (res.data.length === 0) setErrorMsg("No cities found.");
      } else {
        setResults([]);
        setOpen(false);
      }
    } catch (err) {
      console.error("City search error:", err);
      setErrorMsg("Search failed. Please try again.");
      setResults([]);
      setOpen(false);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    // Debounce live search (auto-suggest)
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearTimeout(debounceRef.current);
    doSearch(query);
  };

  const handleSelect = (city) => {
    setQuery("");
    setResults([]);
    setOpen(false);
    setErrorMsg("");
    onLocationSelect(city.lat, city.lon, city.name);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
    setErrorMsg("");
  };

  return (
    <div className="relative w-full max-w-md mx-auto z-40">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for a city..."
          className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-md transition-all shadow-lg text-lg"
        />
        <Search className="absolute text-white/60 left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
        {query && (
          <button type="button" onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        )}
      </form>

      {errorMsg && !open && (
        <p className="text-center text-white/50 text-sm mt-2">{errorMsg}</p>
      )}

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-0 w-full glass-panel overflow-hidden"
          >
            <ul>
              {results.map((city, idx) => (
                <li 
                  key={`${city.lat}-${city.lon}-${idx}`}
                  onClick={() => handleSelect(city)}
                  className="px-4 py-3 hover:bg-white/20 cursor-pointer flex items-center gap-3 transition border-b border-white/10 last:border-0"
                >
                  <MapPin className="text-blue-300 w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-white text-lg">{city.name}</p>
                    <p className="text-sm text-white/70">{city.region ? `${city.region}, ` : ""}{city.country}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
