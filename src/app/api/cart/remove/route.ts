import { NextResponse } from 'next/server';
import pool from "@/lib/db"; // PostgreSQL connection

export async function POST(req: Request) {
  try {
    const { cart_id } = await req.json();

    const query = 'DELETE FROM carts WHERE cart_id = $1 RETURNING *';
    const result = await pool.query(query, [cart_id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Cart item removed' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}