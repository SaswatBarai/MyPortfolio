import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import OwnerSettings from "@/lib/models/OwnerSettings";
import { auth } from "@/lib/auth";

// GET /api/settings — owner only
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const settings = await OwnerSettings.findOne().lean();
  return NextResponse.json({ settings });
}

// PUT /api/settings — owner only (upsert)
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();
  const { workingHours, defaultDurations, timezone } = body;

  const settings = await OwnerSettings.findOneAndUpdate(
    {},
    { workingHours, defaultDurations, timezone },
    { upsert: true, new: true }
  ).lean();

  return NextResponse.json({ settings });
}
