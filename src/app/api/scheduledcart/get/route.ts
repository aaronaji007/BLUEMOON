// app/api/scheduledcart/get/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

interface ScheduledCartRow {
  scheduled_cart_id: number;
  user_id: number;
  food_name: string;
  price: number;
  image: string | null;
  quantity: number;
  special_note: string | null;
  item_id: number;
  scheduled_date: string | null;
  scheduled_time: string | null;
  service_type: string | null;
  created_at: string;
  updated_at: string;
}

export async function GET() {
  try {
    const user_id = 1; // Replace with your user authentication logic

    const query = 'SELECT * FROM scheduled_carts WHERE user_id = $1';
    const values = [user_id];

    const result = await pool.query(query, values);

    const formattedRows = result.rows.map((row: ScheduledCartRow) => ({
      ...row,
      
    }));

    return NextResponse.json(formattedRows);
  } catch (error) {
    console.error('Error getting scheduled cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}