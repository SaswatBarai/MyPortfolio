import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BlockedSlot from "@/lib/models/BlockedSlot";
import { auth } from "@/lib/auth";

// DELETE /api/blocked-slots/[id] — owner only
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { id } = await params;
  const slot = await BlockedSlot.findByIdAndDelete(id);

  if (!slot) {
    return NextResponse.json({ error: "Blocked slot not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Deleted" });
}
