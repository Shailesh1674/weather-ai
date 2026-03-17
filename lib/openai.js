import axios from "axios";

export const getAIWeatherSummary = async (weatherData, cityName) => {
  try {
    if (!weatherData?.current?.temp_c && weatherData?.current?.temp_c !== 0) {
      return "Weather data is incomplete. Have a great day!";
    }

    const prompt = `Based on the following weather data for ${cityName || "the user's location"}, provide a very short, friendly, 1-2 sentence summary of what to expect today and a small tailored suggestion (like carrying an umbrella or wearing sunglasses). Do not use markdown. Keep it engaging.
    Data:
    - Temperature: ${weatherData.current.temp_c}°C
    - Condition: ${weatherData.current.condition.text}
    - Humidity: ${weatherData.current.humidity}%
    - Wind: ${weatherData.current.wind_kph} km/h`;

    // text.pollinations.ai is a free API with no keys required
    const response = await axios.get(
      `https://text.pollinations.ai/${encodeURIComponent(prompt)}`,
      { timeout: 15000 }
    );
    
    const summary = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    const cleaned = summary.trim();

    // If Pollinations returns an error page or empty string, use fallback
    if (!cleaned || cleaned.length < 10 || cleaned.startsWith('<!') || cleaned.startsWith('<html')) {
      return generateLocalSummary(weatherData, cityName);
    }

    return cleaned;
  } catch (error) {
    console.error("[openai.js] AI summary error:", error.message);
    // Graceful fallback: generate a simple local summary instead of failing
    return generateLocalSummary(weatherData, cityName);
  }
};

function generateLocalSummary(weatherData, cityName) {
  const temp = Math.round(weatherData.current.temp_c);
  const condition = weatherData.current.condition.text;
  const wind = weatherData.current.wind_kph;
  const humidity = weatherData.current.humidity;
  const city = cityName || "your area";

  let suggestion = "";
  if (condition.toLowerCase().includes("rain") || condition.toLowerCase().includes("drizzle")) {
    suggestion = "Don't forget your umbrella today! ☂️";
  } else if (condition.toLowerCase().includes("snow")) {
    suggestion = "Bundle up warm, it's snowy out there! ❄️";
  } else if (temp > 35) {
    suggestion = "Stay hydrated and wear sunscreen! ☀️";
  } else if (temp > 25 && condition.toLowerCase().includes("sunny")) {
    suggestion = "Great day for sunglasses and light clothes! 😎";
  } else if (temp < 10) {
    suggestion = "Layer up, it's quite chilly outside! 🧥";
  } else if (wind > 30) {
    suggestion = "It's quite windy — secure loose items! 💨";
  } else if (humidity > 80) {
    suggestion = "High humidity today — stay cool and hydrated! 💧";
  } else {
    suggestion = "Enjoy the weather and have a wonderful day! 🌤️";
  }

  return `It's ${temp}°C and ${condition.toLowerCase()} in ${city}. ${suggestion}`;
}
