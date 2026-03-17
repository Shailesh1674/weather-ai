"use client";

import { motion } from "framer-motion";
import WeatherIcon from "./WeatherIcon";
import { Droplets, Wind, Thermometer, Gauge } from "lucide-react";

export default function WeatherCard({ data }) {
  if (!data || !data.current) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-6 flex flex-col md:flex-row items-center justify-between gap-6 w-full"
    >
      <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2 flex-grow">
        <h2 className="text-4xl font-light tracking-tight">{data.location.name}</h2>
        <p className="text-white/70 font-medium tracking-wide">
          Local Time: {new Date(data.location.localtime_epoch * 1000).toLocaleTimeString([], { timeZone: data.location.tz_id, hour: '2-digit', minute: '2-digit' })}
        </p>
        <div className="flex items-center gap-3">
          {/* WeatherAPI provides its own icon URLs, but we can map codes if we prefer our custom icons. Let's use their icon for simplicity and accuracy based on their API */}
          <img src={data.current.condition.icon.replace('64x64', '128x128')} alt={data.current.condition.text} className="w-20 h-20" />
          <span className="text-6xl font-bold tracking-tighter">{Math.round(data.current.temp_c)}&deg;</span>
        </div>
        <p className="text-xl capitalize text-white/80 font-medium">{data.current.condition.text}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
        <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl hover:bg-white/15 transition cursor-default">
          <Thermometer className="w-8 h-8 text-orange-300" />
          <div>
            <p className="text-xs text-white/60 uppercase font-semibold tracking-wider">Feels Like</p>
            <p className="text-xl font-medium">{Math.round(data.current.feelslike_c)}&deg;</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl hover:bg-white/15 transition cursor-default">
          <Droplets className="w-8 h-8 text-blue-300" />
          <div>
            <p className="text-xs text-white/60 uppercase font-semibold tracking-wider">Humidity</p>
            <p className="text-xl font-medium">{data.current.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl hover:bg-white/15 transition cursor-default">
          <Wind className="w-8 h-8 text-teal-300" />
          <div>
            <p className="text-xs text-white/60 uppercase font-semibold tracking-wider">Wind</p>
            <p className="text-xl font-medium">{data.current.wind_kph} km/h</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl hover:bg-white/15 transition cursor-default">
          <Gauge className="w-8 h-8 text-purple-300" />
          <div>
            <p className="text-xs text-white/60 uppercase font-semibold tracking-wider">Pressure</p>
            <p className="text-xl font-medium">{data.current.pressure_mb} mb</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
