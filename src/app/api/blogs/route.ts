// src/app/api/blogs/route.ts
import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT 
        blogs.id, 
        blogs.category, 
        blogs.title, 
        blogs.subtitle, 
        blogs.image, 
        json_agg(json_build_object('heading', blog_sections.heading, 'text', blog_sections.text)) AS content
      FROM blogs
      LEFT JOIN blog_sections ON blogs.id = blog_sections.blog_id
      GROUP BY blogs.id
      ORDER BY blogs.created_at DESC;
    `);
    client.release();
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const category = formData.get('category') as string;
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const imageFile = formData.get('image') as File;
    const content = [];
    let index = 0;
    while (formData.has(`content[${index}][heading]`)) {
      content.push({
        heading: formData.get(`content[${index}][heading]`) as string,
        text: formData.get(`content[${index}][text]`) as string,
      });
      index++;
    }

    if (!imageFile) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const imageBuffer = await imageFile.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');

    const client = await pool.connect();

    const result = await client.query(
      'INSERT INTO blogs (category, title, subtitle, image) VALUES ($1, $2, $3, $4) RETURNING id',
      [category, title, subtitle, imageBase64]
    );
    const blogId = result.rows[0].id;

    for (const section of content) {
      await client.query(
        'INSERT INTO blog_sections (blog_id, heading, text) VALUES ($1, $2, $3)',
        [blogId, section.heading, section.text]
      );
    }

    client.release();
    return NextResponse.json({ message: 'Blog added successfully', alert: true }, { status: 201 }); // Added alert: true
  } catch (error) {
    console.error('Error adding blog:', error);
    return NextResponse.json({ error: 'Internal server error', alert: false }, { status: 500 }); // Added alert: false
  }
}