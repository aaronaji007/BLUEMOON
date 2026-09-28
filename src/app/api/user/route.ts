// app/api/user/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
  }

  try {
    const query = 'SELECT phone_number, address, city, "postCode", state FROM users_order WHERE email =  ORDER BY id DESC LIMIT 1';
    const result = await pool.query(query, [email]);

    if (result.rows.length > 0) {
      return NextResponse.json(result.rows[0]);
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
