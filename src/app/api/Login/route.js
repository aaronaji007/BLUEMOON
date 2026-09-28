import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Check if user exists and password matches
    const query = "SELECT * FROM users WHERE email = $1 AND password = $2";
    const values = [email, password];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful!", user: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
