import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ✅ Fetch all customers from `users_order`
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        users_order.id, 
        CONCAT(users_order.first_name, ' ', users_order.last_name) AS name, 
        users_order.email, 
        users_order.phone_number AS phone, 
        users_order.is_active 
      FROM users_order
    `);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ Update customer status or details
export async function PATCH(req) {
  try {
    const { id, is_active, name, email, phone, role } = await req.json();

    if (typeof is_active !== "undefined") {
      await pool.query("UPDATE users_order SET is_active = $1 WHERE id = $2", [is_active, id]);
      return NextResponse.json({ message: "Status updated." }, { status: 200 });
    }

    if (name || email || phone || role) {
      const [first_name, ...lastParts] = name.split(" ");
      const last_name = lastParts.join(" ") || "";
      await pool.query(
        "UPDATE users_order SET first_name = $1, last_name = $2, email = $3, phone_number = $4, role = $5 WHERE id = $6",
        [first_name, last_name, email, phone, role, id]
      );
      return NextResponse.json({ message: "Details updated." }, { status: 200 });
    }

    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}