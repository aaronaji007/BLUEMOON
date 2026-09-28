// app/api/gallery/add/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db'; // assumes a pool instance setup

export async function POST(req: Request) {
  try {
    const { src, alt, title, category, type } = await req.json();

    const query = `
      INSERT INTO gallery (src, alt, title, category, type)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [src, alt, title, category, type];
    const result = await pool.query(query, values);

    return NextResponse.json({ message: 'Video added', data: result.rows[0] }, { status: 200 });
  } catch (err) {
    console.error('Error inserting video:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
