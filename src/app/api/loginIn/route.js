// app/api/loginIn/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        // Fetch user from DB
        const result = await pool.query("SELECT * FROM users_order WHERE email = $1", [email]);
        const user = result.rows[0];

        if (!user) {
            return NextResponse.json({ error: "Account not found." }, { status: 401 });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return NextResponse.json({ error: "Invalid password." }, { status: 401 });
        }

        // Return user details without leaking password
        delete user.password;
        return NextResponse.json({ message: "Login successful!", user });
    } catch (error) {
        console.error("❌ Login error:", error);
        return NextResponse.json({ error: "Failed to login." }, { status: 500 });
    }
}
