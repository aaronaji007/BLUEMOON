// /app/api/roles/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM roles ORDER BY id ASC");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, description, permissions } = await req.json();
    const result = await pool.query(
      "INSERT INTO roles (name, description, permissions) VALUES ($1, $2, $3::jsonb) RETURNING *", // Cast to JSONB
      [name, description, permissions]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Failed to create role:", error);
    return NextResponse.json({ error: "Failed to create role" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, name, description, permissions } = await req.json();
    const result = await pool.query(
      "UPDATE roles SET name = $1, description = $2, permissions = $3::jsonb WHERE id = $4 RETURNING *", // Cast to JSONB
      [name, description, permissions, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to update role:", error);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await pool.query("DELETE FROM roles WHERE id = $1", [id]);
    return NextResponse.json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Failed to delete role:", error);
    return NextResponse.json({ error: "Failed to delete role" }, { status: 500 });
  }
}