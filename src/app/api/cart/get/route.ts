import { NextResponse } from 'next/server';
import pool from "@/lib/db"; // PostgreSQL connection

export async function GET() {
  try {
    const query = 'SELECT * FROM carts WHERE user_id = $1'; // Replace 1 with actual user_id
    const result = await pool.query(query, [1]);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}