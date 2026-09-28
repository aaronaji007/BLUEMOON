// /app/api/gallery/get/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
    try {
        const result = await pool.query("SELECT id, type, src, alt, title, category FROM gallery ORDER BY id DESC");
        return NextResponse.json({ success: true, items: result.rows });
    } catch (error) {
        console.error("GET error:", error);
        return NextResponse.json({ success: false, error });
    }
}