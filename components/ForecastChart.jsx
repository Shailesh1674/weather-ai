"use client";

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

export default function ForecastChart({ forecastData }) {
  const chartData = useMemo(() => {
    if (!forecastData || !forecastData.forecast || !forecastData.forecast.forecastday) return [];
    
    // WeatherAPI provides hourly data for each forecast day. Let's merge today and tomorrow to get the next 24 hours.
    const allHours = forecastData.forecast.forecastday.flatMap(day => day.hour);
    
    // Find current time index to show only future hours
    const now = new Date().getTime();
    const futureHours = allHours.filter(hour => new Date(hour.time_epoch * 1000).getTime() > now);
    
    return futureHours.slice(0, 12).map(item => ({
      time: format(new Date(item.time_epoch * 1000), 'HH:mm'),
      temp: Math.round(item.temp_c)
    }));
  }, [forecastData]);

  if (!chartData.length) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-panel p-6 w-full h-[320px]"
    >
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <span className="text-white/80">Next 12 Hours</span>
      </h3>
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="time" 
              stroke="rgba(255,255,255,0.4)" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
            />
            <YAxis 
              hide 
              domain={['dataMin - 2', 'dataMax + 2']} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              itemStyle={{ color: '#fff', fontWeight: 'bold' }}
              labelStyle={{ color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}
              formatter={(value) => [`${value}°`, 'Temp']}
              cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke="#fff" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#fff', strokeWidth: 0 }}
              activeDot={{ r: 8, fill: '#4facfe', stroke: '#fff', strokeWidth: 2 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
