// app/api/offers/items/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

// POST: Fetch specific menu items by a list of item_ids
export async function POST(req) {
  try {
    const { itemIds } = await req.json();

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      return NextResponse.json({ error: "itemIds must be an array of numbers" }, { status: 400 });
    }

    // Ensure itemIds are integers for safety
    const safeItemIds = itemIds.map(id => parseInt(id)).filter(id => !isNaN(id));

    if (safeItemIds.length === 0) {
      return NextResponse.json([], { status: 200 }); // No valid IDs, return empty
    }

    await pool.query("SET search_path TO public");

    // Use ANY operator to select items where item_id is in the provided array
    const query = `
      SELECT item_id, name, image_url, quantity
      FROM public.menu_items
      WHERE item_id = ANY($1::int[])
    `;
    const result = await pool.query(query, [safeItemIds]);

    // Set cache headers for better performance (e.g., cache for 5 minutes)
    const response = NextResponse.json(result.rows, { status: 200 });
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600'); // Cache for 5 mins, revalidate after 10 mins
    
    return response;
  } catch (error) {
    console.error("Database Error in /api/offers/items POST:", error);
    return NextResponse.json(
      { error: "Failed to fetch specific menu items", details: error.message },
      { status: 500 }
    );
  }
}