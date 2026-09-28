// app/api/orders/get/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    // Change 'order_id' to 'id'
    const result = await pool.query('SELECT * FROM "order" ORDER BY id DESC');
    return NextResponse.json({ success: true, orders: result.rows });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}