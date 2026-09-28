//app/api/updatevideo/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PATCH(req: NextRequest) {
  try {
    const { id, title, description, category } = await req.json();

    if (!id || !title || !description || !category) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const result = await db.query(
      `
      UPDATE cooking_videos
      SET title = $1, description = $2, category = $3
      WHERE id = $4
      RETURNING id, title, video_url, thumbnail_url, description, category
      `,
      [title, description, category, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Video updated', video: result.rows[0] });
  } catch (error) {
    console.error('Update Video Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
