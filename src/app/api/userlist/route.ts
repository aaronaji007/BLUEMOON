// /api/userlist/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET /api/useredit
export async function GET() {
  try {
    const { rows } = await pool.query("SELECT name, email FROM users");
    return NextResponse.json({ users: rows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
