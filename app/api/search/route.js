import { NextResponse } from "next/server";
import { searchCity } from "@/lib/weather";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    if (!q || q.trim().length < 2) {
      return NextResponse.json({ error: "Query must be at least 2 characters" }, { status: 400 });
    }

    if (!process.env.WEATHERAPI_KEY) {
      return NextResponse.json({ error: "Weather API key not configured" }, { status: 503 });
    }

    const data = await searchCity(q.trim());
    return NextResponse.json(data);
  } catch (error) {
    console.error("[/api/search] Error:", error.message);
    return NextResponse.json({ error: error.message || "Search failed" }, { status: 500 });
  }
}
