import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ScheduleRequest from "@/lib/models/ScheduleRequest";

// GET /api/schedule/requests — admin: fetch all requests
export async function GET() {
  try {
    await connectToDatabase();
    const requests = await ScheduleRequest.find({})
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ requests });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
