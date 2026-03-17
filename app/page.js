"use client";

import { useEffect, useState } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import CitySearch from "@/components/CitySearch";
import WeatherCard from "@/components/WeatherCard";
import ForecastChart from "@/components/ForecastChart";
import dynamic from 'next/dynamic';

const MapWidget = dynamic(() => import('@/components/MapWidget'), { ssr: false });
const RadarMap = dynamic(() => import('@/components/RadarMap'), { ssr: false });
import SavedCities from "@/components/SavedCities";
import axios from "axios";
import { Loader2, BookmarkPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

export default function Home() {
  const { location, error, loading: geoLoading } = useGeolocation();
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [aiSummary, setAiSummary] = useState("");
  const [dataLoading, setDataLoading] = useState(false);
  const [newSaveTrigger, setNewSaveTrigger] = useState(0);
  const [bgClass, setBgClass] = useState("bg-night");
  const { data: session } = useSession();

  const fetchWeather = async (lat, lon, cityName = "") => {
    setDataLoading(true);
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`/api/weather?lat=${lat}&lon=${lon}`),
        axios.get(`/api/forecast?lat=${lat}&lon=${lon}`)
      ]);
      
      setWeatherData(weatherRes.data);
      setForecastData(forecastRes.data);
      
      try {
        const aiRes = await axios.post('/api/ai-summary', {
          weatherData: weatherRes.data,
          cityName: cityName || weatherRes.data.location.name
        });
        setAiSummary(aiRes.data.summary);
      } catch (e) {
        setAiSummary("");
      }

      updateBackground(weatherRes.data.current.condition.code, weatherRes.data.current.is_day);
    } catch (err) {
      console.error(err);
    }
    setDataLoading(false);
  };

  const updateBackground = (code, isDay) => {
    let newBgClass = "bg-night";
    
    if (isDay) {
      if (code === 1000) newBgClass = "bg-sunny"; // Sunny
      else if ([1003, 1006, 1009].includes(code)) newBgClass = "bg-cloudy"; // Partly cloudy, Cloudy, Overcast
      else newBgClass = "bg-rainy"; // Treat all other precipitation/fog as rainy for background scheme
    } else {
      newBgClass = "bg-night";
    }
    
    setBgClass(newBgClass);
  };

  useEffect(() => {
    if (location && !geoLoading) {
      fetchWeather(location.lat, location.lon, location.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, geoLoading]);

  const handleLocationSelect = (lat, lon, name) => {
    fetchWeather(lat, lon, name);
  };

  const handleSaveCity = async () => {
    if (!weatherData || !session) return;
    try {
      await axios.post('/api/saved-cities', {
        name: weatherData.location.name,
        lat: weatherData.location.lat,
        lon: weatherData.location.lon,
        country: weatherData.location.country
      });
      setNewSaveTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        alert("City already saved in favorites.");
      }
    }
  };

  return (
    <>
      {/* Background Crossfader for Smooth Transitions */}
      <div className="fixed inset-0 z-[-10]">
        <div className={`absolute inset-0 bg-sunny transition-opacity duration-1000 ease-in-out ${bgClass === 'bg-sunny' ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute inset-0 bg-cloudy transition-opacity duration-1000 ease-in-out ${bgClass === 'bg-cloudy' ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute inset-0 bg-rainy transition-opacity duration-1000 ease-in-out ${bgClass === 'bg-rainy' ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute inset-0 bg-night transition-opacity duration-1000 ease-in-out ${bgClass === 'bg-night' ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      <div className="flex flex-col gap-6 w-full relative z-0">
        <div className="flex flex-col gap-4">
          <CitySearch onLocationSelect={handleLocationSelect} />
          <SavedCities onSelectCity={handleLocationSelect} newSaveTrigger={newSaveTrigger} />
        </div>
      
      {(geoLoading || dataLoading) && !weatherData ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-white/80" />
          <p className="text-white/80 animate-pulse text-lg tracking-wide">Detecting weather satellite...</p>
        </div>
      ) : error && !weatherData ? (
        <div className="glass-panel p-8 text-center text-red-100 max-w-xl mx-auto">
          <p>{error}</p>
        </div>
      ) : weatherData && (
    <AnimatePresence mode="wait">
          <motion.div 
            key={weatherData.location.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6 w-full max-w-5xl mx-auto mt-4"
          >
            {aiSummary && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center shadow-lg"
              >
                <p className="text-lg font-medium text-white/90 tracking-wide">✨ {aiSummary}</p>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/5 p-3 px-6 rounded-2xl border border-white/10 backdrop-blur-sm">
              <span className="text-white/80 font-medium">Currently viewing: <strong className="text-white text-lg">{weatherData.location.name}</strong></span>
              {session && (
                <button 
                  onClick={handleSaveCity}
                  className="flex items-center gap-2 bg-blue-500/80 hover:bg-blue-600 transition px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  Save to Favorites
                </button>
              )}
            </div>

            <WeatherCard data={weatherData} />
            <ForecastChart forecastData={forecastData} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
               <MapWidget location={{ lat: weatherData.location.lat, lon: weatherData.location.lon }} />
               <RadarMap location={{ lat: weatherData.location.lat, lon: weatherData.location.lon }} />
            </div>
          </motion.div>
        </AnimatePresence>
      )}
      </div>
    </>
  );
}
