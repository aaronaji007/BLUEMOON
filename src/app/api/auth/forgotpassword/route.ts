// /api/auth/forgotpassword/route.ts

import { NextResponse } from "next/server";
import  pool  from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json({ message: "Email and new password are required." }, { status: 400 });
    }

    const userResult = await pool.query(
      `SELECT * FROM users WHERE email = $1 AND is_signed_up = true AND is_active = true`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ message: "Email not found or user not signed up." }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE users SET password = $1, reset_password = $2 WHERE email = $3`,
      [hashedPassword, newPassword, email]
    );

    return NextResponse.json({ message: "Password updated successfully." }, { status: 200 });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
