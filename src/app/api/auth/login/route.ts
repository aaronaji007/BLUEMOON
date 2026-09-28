// /api/auth/login/route.ts

import { NextResponse } from "next/server";
import  pool  from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { usernameOrEmail, password } = await req.json();

    const query = `
      SELECT * FROM users 
      WHERE email = $1 AND is_signed_up = true AND is_active = true
    `;

    const result = await pool.query(query, [usernameOrEmail]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "User not found or not registered." }, { status: 404 });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ message: "Invalid password." }, { status: 401 });
    }

    // You can also update last_login, login_time, etc. here if needed
    await pool.query(`
      UPDATE users SET last_login = CURRENT_TIMESTAMP, is_signed_in = true 
      WHERE user_id = $1
    `, [user.user_id]);

    return NextResponse.json({ 
      message: "Login successful", 
      name: user.name, 
      user_id: user.user_id,
      role: user.role 
    }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
