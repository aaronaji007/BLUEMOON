// app/api/forgotpassword/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db'; // Your PostgreSQL connection pool
import bcrypt from 'bcrypt';

export async function POST(req) {
    const { email, newPassword } = await req.json();

    try {
        // Check if the email exists
        const emailCheckResult = await pool.query('SELECT * FROM users_order WHERE email = $1', [email]);
        const user = emailCheckResult.rows[0];

        if (!user) {
            return NextResponse.json({ error: 'Account not found.' }, { status: 404 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password in the database
        await pool.query('UPDATE users_order SET password = $1 WHERE email = $2', [hashedPassword, email]);

        return NextResponse.json({ message: 'Password updated successfully!' });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Failed to update password.' }, { status: 500 });
    }
}