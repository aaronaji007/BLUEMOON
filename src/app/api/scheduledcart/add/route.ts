// app/api/scheduledcart/add/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { item_id, quantity, special_note, scheduledDate, scheduledTime, serviceType } = await req.json();
    const user_id = 1; // Replace with your user authentication logic

    // Fetch menu item details
    const menuItemQuery = 'SELECT name, price, image_url FROM menu_items WHERE item_id = $1';
    const menuItemResult = await pool.query(menuItemQuery, [item_id]);

    if (menuItemResult.rows.length === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const { name, price, image_url } = menuItemResult.rows[0];

    const insertQuery = `
      INSERT INTO scheduled_carts (user_id, food_name, price, image, quantity, special_note, item_id, scheduled_date, scheduled_time, service_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const isoDate = new Date(scheduledDate).toISOString().split('T')[0]; // "2025-04-18"
const isoTime = scheduledTime.length === 5 ? `${scheduledTime}:00` : scheduledTime; // Ensure "HH:mm:ss" format

const values = [user_id, name, price, image_url, quantity || 1, special_note, item_id, isoDate, isoTime, serviceType];

    const result = await pool.query(insertQuery, values);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding item to scheduled cart:', error);

    if (error instanceof Error) {
      if (error.message.includes('duplicate key value violates unique constraint')) {
        return NextResponse.json({ error: 'Item already in scheduled cart' }, { status: 400 });
      } else if (error.message.includes('null value in column')) {
        return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
      } else if (error.message.includes("invalid input syntax for type numeric")) {
        return NextResponse.json({ error: "Invalid price value" }, {status: 400});
      }
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}