import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function DELETE(req: Request) {
  try {
  
    const { id: reservationId } = await req.json();

    if (!reservationId) { // Check for reservationId
      return NextResponse.json(
        { success: false, error: "Reservation ID is required." },
        { status: 400 }
      );
    }

    // Execute the DELETE SQL query using 'reservation_id' as the column name
    const result = await pool.query('DELETE FROM reservations WHERE reservation_id = $1', [reservationId]);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: "Reservation not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Reservation deleted successfully." });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete reservation." },
      { status: 500 }
    );
  }
}