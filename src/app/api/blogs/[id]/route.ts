//blogs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// PUT: Update blog by ID
export async function PUT(req: NextRequest) {
  try {
    const blogId = req.nextUrl.pathname.split("/").pop(); // Extract ID from the URL

    const formData = await req.formData();
    const category = formData.get("category") as string;
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const image = formData.get("image");
    const content: { heading: string; text: string }[] = [];

    // Parse content sections
    for (const key of formData.keys()) {
      if (key.startsWith("content")) {
        const match = key.match(/content\[(\d+)\]\[(heading|text)\]/);
        if (match) {
          const index = parseInt(match[1]);
          const field = match[2];
          const value = formData.get(key) as string;

          if (!content[index]) {
            content[index] = { heading: "", text: "" };
          }
          content[index][field as "heading" | "text"] = value;
        }
      }
    }

    // Update blog
    await pool.query(
      `UPDATE blogs SET category = $1, title = $2, subtitle = $3, image = $4 WHERE id = $5`,
      [category, title, subtitle, image ? image.toString() : null, blogId]
    );

    // Refresh blog sections
    await pool.query(`DELETE FROM blog_sections WHERE blog_id = $1`, [blogId]);
    for (const section of content) {
      await pool.query(
        `INSERT INTO blog_sections (blog_id, heading, text) VALUES ($1, $2, $3)`,
        [blogId, section.heading, section.text]
      );
    }

    return NextResponse.json({ message: "Blog updated successfully", alert: true });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Failed to update blog", alert: false }, { status: 500 });
  }
}

// DELETE: Delete blog by ID
export async function DELETE(req: NextRequest) {
  try {
    const blogId = req.nextUrl.pathname.split("/").pop(); // Extract ID

    await pool.query(`DELETE FROM blog_sections WHERE blog_id = $1`, [blogId]);
    await pool.query(`DELETE FROM blogs WHERE id = $1`, [blogId]);

    return NextResponse.json({ message: "Blog deleted successfully", alert: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ message: "Failed to delete blog", alert: false }, { status: 500 });
  }
}
