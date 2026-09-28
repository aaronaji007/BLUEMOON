// app/api/scheduledcart/clear/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db'; // Replace with your database connection

export async function POST() { // Removed req parameter
  try {
    const user_id = 1; // Replace with your user authentication logic
    const query = 'DELETE FROM scheduled_carts WHERE user_id = $1';
    const values = [user_id];

    await pool.query(query, values);

    return NextResponse.json({ message: 'Scheduled cart cleared' });
  } catch (error) {
    console.error('Error clearing scheduled cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}