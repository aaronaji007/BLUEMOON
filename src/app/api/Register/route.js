import { NextResponse } from "next/server";
import pool from "@/lib/db"; // ✅ Make sure the import is correct

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received Data:", body);

    const { name, email, password, role, status, is_signed_up, is_signed_in, login_time, logout_time } = body;

    const query = `
      INSERT INTO users (name, email, password, role, status, is_signed_up, is_signed_in, login_time, logout_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const values = [name, email, password, role, status, is_signed_up, is_signed_in, login_time, logout_time];

    const result = await pool.query(query, values); // ✅ Should work now

    return NextResponse.json({ message: "User added successfully!", user: result.rows[0] }, { status: 201 });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
