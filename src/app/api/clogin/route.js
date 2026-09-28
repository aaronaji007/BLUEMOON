import { NextResponse } from "next/server";
import pool from "@/lib/db"; // PostgreSQL connection

// Handle POST request (Save Customer Data)
export async function POST(req) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, subscribe } = body;

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const query = `
      INSERT INTO customer (name, lastname, email, phone, subscribe)
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *;
    `;
    const values = [firstName, lastName, email, phone, subscribe];

    const result = await pool.query(query, values);

    return NextResponse.json({ message: "Customer added successfully", data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}