// app/api/gallery/events/route.ts
import { NextResponse } from 'next/server';
import pool  from '@/lib/db';

export async function GET() {
  try {
    const query = `
      SELECT * FROM gallery
      WHERE category = 'event' AND type = 'video'
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (err) {
    console.error('Error fetching event videos:', err);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}
