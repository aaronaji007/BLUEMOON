// app/api/orders/delete/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json(); // Get the order ID from the request body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Order ID is required." },
        { status: 400 }
      );
    }

    // Perform the DELETE operation
    const result = await pool.query('DELETE FROM "order" WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      // If no rows were deleted, the order ID might not exist
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Order deleted successfully." });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete order." },
      { status: 500 }
    );
  }
}