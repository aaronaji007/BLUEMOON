import { NextResponse } from 'next/server';
import pool from "@/lib/db"; // PostgreSQL connection

export async function POST(req: Request) {
  try {
    const { cart_id, quantity, special_note } = await req.json();

    const query =
      'UPDATE carts SET quantity = $1, special_note = $2, updated_at = NOW() WHERE cart_id = $3 RETURNING *';
    const values = [quantity, special_note, cart_id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}