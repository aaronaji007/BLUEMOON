//app/api/reservation/get/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Assuming your database connection pool is in "@/lib/db"

export async function GET() {
  try {
   
    const result = await pool.query(
      'SELECT * FROM reservations ORDER BY reservation_date DESC, reservation_start_time DESC'
    );
    return NextResponse.json({ success: true, reservations: result.rows });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reservations." },
      { status: 500 }
    );
  }
}