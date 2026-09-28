//api/auth/register/route.ts
import { NextResponse } from "next/server";
import  pool  from "@/lib/db"; // assumes you have a shared PostgreSQL pool instance
import bcrypt from "bcrypt";

// POST /api/auth/register
export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    // Check if user already exists
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (rows.length > 0) {
      return NextResponse.json({ message: "User already exists." }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, is_signed_up, is_signed_in, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, email, hashedPassword, role, true, false, true]
    );
    

    return NextResponse.json({ message: "User registered successfully", user: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
