import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import SavedCity from "@/models/SavedCity";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const cities = await SavedCity.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(cities);
  } catch (err) {
    console.error("[/api/saved-cities GET] Error:", err.message);
    return NextResponse.json({ error: "Failed to fetch saved cities" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, lat, lon, country } = await request.json();

    if (!name || lat == null || lon == null) {
      return NextResponse.json({ error: "Missing required fields: name, lat, lon" }, { status: 400 });
    }

    await dbConnect();
    const city = await SavedCity.create({
      userId: session.user.id,
      name: name.trim(),
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country: country || ""
    });
    return NextResponse.json(city);
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "City already saved" }, { status: 400 });
    }
    console.error("[/api/saved-cities POST] Error:", error.message);
    return NextResponse.json({ error: "Failed to save city" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing city ID" }, { status: 400 });

    await dbConnect();
    const result = await SavedCity.findOneAndDelete({ _id: id, userId: session.user.id });
    
    if (!result) {
      return NextResponse.json({ error: "City not found or not owned by user" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/saved-cities DELETE] Error:", err.message);
    return NextResponse.json({ error: "Failed to delete city" }, { status: 500 });
  }
}
