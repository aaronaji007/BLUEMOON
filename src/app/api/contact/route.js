import { NextResponse } from "next/server";
import pool from "@/lib/db"; // PostgreSQL connection

// Handle POST request (Save Contact Message)
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const query = `
      INSERT INTO contact_messages (name, email, phone, subject, message, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *;
    `;
    const values = [name, email, phone, subject, message];

    const result = await pool.query(query, values);

    return NextResponse.json({ message: "Message saved successfully", data: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// Handle GET request (Fetch all messages)
export async function GET() {
  try {
    const query = "SELECT * FROM contact_messages ORDER BY created_at DESC;";
    const result = await pool.query(query);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
