// /app/api/deletevideo/route.js
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing video ID" }, { status: 400 });
    }

    await db.query("DELETE FROM cooking_videos WHERE id = $1", [id]);

    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}
