import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET all roles with user_type "Internal Users"
export async function GET() {
  try {
    const result = await pool.query(
      "SELECT * FROM roles WHERE user_type = 'Internal Users' ORDER BY created_at DESC"
    );
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error); // ✅ Log the error
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// POST - Add a new role
export async function POST(req) {
  try {
    const { name, description, permissions } = await req.json();
    
    // Automatically set the user type as "Internal Users"
    const userType = "Internal Users";

    const result = await pool.query(
      'INSERT INTO roles (name, description, permissions, user_type) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, JSON.stringify(permissions), userType]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("POST Error:", error); // ✅ Log the error
    return NextResponse.json({ error: 'Failed to insert role' }, { status: 500 });
  }
}

// DELETE a role
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await pool.query('DELETE FROM roles WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Role deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error); // ✅ Log the error
    return NextResponse.json({ error: 'Failed to delete role' }, { status: 500 });
  }
}

// PUT - Update a role
export async function PUT(req) {
  try {
    const { id, name, description, permissions } = await req.json();
    const result = await pool.query(
      'UPDATE roles SET name = $1, description = $2, permissions = $3 WHERE id = $4 RETURNING *',
      [name, description, JSON.stringify(permissions), id]
    );
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error); // ✅ Log the error
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }
}
