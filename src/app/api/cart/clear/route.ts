import { NextResponse } from 'next/server';
import pool from "@/lib/db"; // PostgreSQL connection

export async function POST() {
  try {
    const query = 'DELETE FROM carts WHERE user_id = $1'; // Replace 1 with actual user_id
    await pool.query(query, [1]);
    return NextResponse.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}