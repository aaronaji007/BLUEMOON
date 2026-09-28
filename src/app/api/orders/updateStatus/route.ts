//app/api/orders/updateStatus/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Assuming your database connection is in @/lib/db

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Order ID and status are required." },
        { status: 400 }
      );
    }

    // Update the order status in the database
    const result = await pool.query(
      'UPDATE "order" SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: result.rows[0] });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order status." },
      { status: 500 }
    );
  }
}