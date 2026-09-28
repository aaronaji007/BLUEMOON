//api/savemetadata/route.js:
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, category, video_url, thumbnail_url } = body;

    console.log("Received:", { title, description, category, video_url, thumbnail_url });

    if (!title || !video_url || !thumbnail_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.query(
      `INSERT INTO cooking_videos (title, video_url, thumbnail_url, description, category, uploaded_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [title, video_url, thumbnail_url, description, category]
    );

    return NextResponse.json({ message: "Video metadata saved successfully" }, { status: 200 });
  } catch (error) {
    console.error("DB Save Error:", error);
    return NextResponse.json({ error: "Database insert failed" }, { status: 500 });
  }
}