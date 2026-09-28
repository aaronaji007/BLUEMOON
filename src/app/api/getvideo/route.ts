 // /app/api/getvideo/route.js
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const result = await db.query(`
      SELECT id, title, video_url, thumbnail_url, description, category
      FROM cooking_videos
      ORDER BY uploaded_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Fetch Videos Error:", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}