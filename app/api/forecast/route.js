import { NextResponse } from "next/server";
import { getForecast } from "@/lib/weather";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return NextResponse.json({ error: "Missing lat/lon parameters" }, { status: 400 });
    }

    if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lon))) {
      return NextResponse.json({ error: "Invalid lat/lon values" }, { status: 400 });
    }

    if (!process.env.WEATHERAPI_KEY) {
      return NextResponse.json({ error: "Weather API key not configured on server" }, { status: 503 });
    }

    const data = await getForecast(lat, lon);

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' }
    });
  } catch (error) {
    console.error("[/api/forecast] Error:", error.message);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
