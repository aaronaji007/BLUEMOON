// app/api/contact/delete/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Assuming your PostgreSQL connection is here

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json(); // Expecting the message ID in the request body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Message ID is required for deletion." },
        { status: 400 }
      );
    }

    // SQL query to delete the message
    const query = `
      DELETE FROM contact_messages
      WHERE id = $1
      RETURNING id;
    `; // Removed the JavaScript comment from inside the SQL string
    const values = [id];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      // If no rows were deleted, the message with the given ID was not found
      return NextResponse.json(
        { success: false, error: "Message not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message deleted successfully.", deletedId: result.rows[0].id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database error during message deletion:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete message from database." },
      { status: 500 }
    );
  }
}
