import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Invalid video ID' }, { status: 400 });
  }

  try {
    const { title, description, category } = await req.json();

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields in the request body' },
        { status: 400 }
      );
    }

    const query = `
      UPDATE cooking_videos
      SET title = \$1, description = \$2, category = \$3, updated_at = NOW()
      WHERE id = \$4
    `;
    const values = [title, description, category, parseInt(id, 10)];

    const result = await db.query(query, values);

    if ((result.rowCount ?? 0) > 0) {
      return NextResponse.json({ message: 'Video metadata updated successfully' });
    } else {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Database update error:', error);
    return NextResponse.json({ error: 'Failed to update video metadata' }, { status: 500 });
  }
}
