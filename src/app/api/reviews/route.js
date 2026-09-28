// app/api/reviews/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Fetch all reviews
export async function GET() {
  try {
    await pool.query('SET search_path TO public');
    const result = await pool.query(
      // Updated the SELECT query to include the new columns
      'SELECT id, name, gender, rating, experience, created_at, email, phone_number FROM public.reviews ORDER BY created_at DESC'
    );
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// Add a new review
export async function POST(req) {
  try {
    // Destructure the new fields from the request body
    const { name, gender, rating, experience, email, phone_number } = await req.json();

    // Added validation for the new fields
    if (!name || !gender || !experience || !email || !phone_number) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await pool.query(
      // Updated the INSERT query to include the new columns and their values
      'INSERT INTO reviews (name, gender, rating, experience, email, phone_number, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *',
      [name, gender, rating, experience, email, phone_number]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: 'Failed to insert review' }, { status: 500 });
  }
}

// --- NEW DELETE FUNCTION ---
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    // Ensure the ID is a valid number to prevent SQL injection (though parameterized queries help)
    if (isNaN(Number(id))) {
      return NextResponse.json({ error: 'Invalid review ID' }, { status: 400 });
    }

    await pool.query('SET search_path TO public');
    const result = await pool.query('DELETE FROM public.reviews WHERE id = $1 RETURNING id', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Review deleted successfully', id: result.rows[0].id }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}