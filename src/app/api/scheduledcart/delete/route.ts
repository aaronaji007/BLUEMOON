
// app/api/scheduledcart/delete/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(req: Request) {
  try {
    const { scheduled_cart_id } = await req.json();

    const query = 'DELETE FROM scheduled_carts WHERE scheduled_cart_id = $1';
    const values = [scheduled_cart_id];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Item not found in scheduled cart' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Item deleted from scheduled cart' });
  } catch (error) {
    console.error('Error deleting item from scheduled cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}