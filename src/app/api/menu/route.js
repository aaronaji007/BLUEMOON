import { NextResponse } from "next/server";
import db from "@/lib/db"; // Ensure your PostgreSQL connection is correct

export async function GET() {
  try {
    const result = await db.query("SELECT * FROM menu_items ORDER BY created_at DESC");
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 });
  }
}
