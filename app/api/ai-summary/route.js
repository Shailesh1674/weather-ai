import { NextResponse } from "next/server";
import { getAIWeatherSummary } from "@/lib/openai";

export async function POST(request) {
  try {
    const body = await request.json();
    const { weatherData, cityName } = body;

    if (!weatherData || !weatherData.current) {
      return NextResponse.json({ error: "Missing or invalid weather data" }, { status: 400 });
    }

    const summary = await getAIWeatherSummary(weatherData, cityName);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("[/api/ai-summary] Error:", error.message);
    return NextResponse.json({ 
      summary: "Have a wonderful day! Check the weather details above for more info." 
    });
  }
}
