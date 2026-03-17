import { 
  Sun, Cloud, CloudRain, CloudLightning, CloudSnow, 
  CloudFog 
} from "lucide-react";

export default function WeatherIcon({ code, className = "w-8 h-8" }) {
  if (!code) return <Sun className={className} />;
  
  if (code.startsWith("01")) return <Sun className={`${className} text-yellow-400`} />;
  if (code.startsWith("02") || code.startsWith("03") || code.startsWith("04")) return <Cloud className={`${className} text-gray-200`} />;
  if (code.startsWith("09") || code.startsWith("10")) return <CloudRain className={`${className} text-blue-400`} />;
  if (code.startsWith("11")) return <CloudLightning className={`${className} text-yellow-500`} />;
  if (code.startsWith("13")) return <CloudSnow className={`${className} text-white`} />;
  if (code.startsWith("50")) return <CloudFog className={`${className} text-gray-400`} />;
  
  return <Sun className={className} />;
}
