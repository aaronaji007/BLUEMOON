import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Make sure this path is correct

export async function GET() {
  try {
    const result = await pool.query("SELECT name, email FROM users"); // Fetch all users
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
