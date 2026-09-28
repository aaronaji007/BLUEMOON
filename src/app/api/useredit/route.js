import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Ensure your DB connection is set up

// ✅ Fetch all users
// ✅ Updated GET in /api/useredit
export async function GET() {
  try {
    const result = await pool.query(
      "SELECT user_id AS id, name, email, is_active, role FROM users"
    );
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// ✅ Update user status or details
export async function PATCH(req) {
  try {
    const { id, is_active, name, email } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Toggle active status if is_active is provided
    if (typeof is_active !== "undefined") {
      await pool.query("UPDATE users SET is_active = $1 WHERE user_id = $2", [is_active, id]);
      return NextResponse.json({ message: "User status updated successfully." }, { status: 200 });
    }

    // Update name or email if provided
    if (name || email) {
      await pool.query(
        "UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email) WHERE user_id = $3",
        [name, email, id]
      );
      return NextResponse.json({ message: "User details updated successfully." }, { status: 200 });
    }

    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}