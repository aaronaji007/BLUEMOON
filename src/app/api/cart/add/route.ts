// app/api/cart/add/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db'; // Import your PostgreSQL pool

export async function POST(req: Request) {
  try {
    const { item_id, quantity, special_note, service_type } = await req.json(); // Added service_type

    // Assuming you have user authentication and can get the user_id
    // Replace '1' with your actual user_id retrieval logic
    const user_id = 1; // Example: Retrieve user_id from session or token

    // Fetch the menu item details
    const menuItemQuery = 'SELECT name, price, image_url FROM menu_items WHERE item_id = $1';
    const menuItemResult = await pool.query(menuItemQuery, [item_id]);

    if (menuItemResult.rows.length === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const { name, price, image_url } = menuItemResult.rows[0];

    // Insert the item into the cart
    const insertQuery = `
      INSERT INTO carts (user_id, food_name, price, image, quantity, special_note, item_id, service_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [user_id, name, price, image_url, quantity || 1, special_note, item_id, service_type]; // Added service_type

    const result = await pool.query(insertQuery, values);

    return NextResponse.json(result.rows[0]);

  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}