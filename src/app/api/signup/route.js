// app/api/signup/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        const { firstName, lastName, email, password, phoneNumber, address, city, postCode, state, serviceType } = await req.json();

        if (!firstName || !lastName || !email || !password || !phoneNumber || !serviceType) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if email already exists
        const existingUser = await pool.query("SELECT email FROM users_order WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return NextResponse.json({ error: "Email address already exists" }, { status: 409 }); // Changed status to 409
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        let insertQuery;
        let values;

        if (serviceType === "delivery" || serviceType === "DELIVERY")
        {
            if (!address || !city || !postCode || !state) {
                return NextResponse.json({ error: "Delivery address is incomplete." }, { status: 400 });
            }

            insertQuery = `
                INSERT INTO users_order (first_name, last_name, email, password, phone_number, address, city, "postCode", state, service_type)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING *;
            `;
            values = [firstName, lastName, email, hashedPassword, phoneNumber, address, city, postCode, state, serviceType];
        } else {
            insertQuery = `
                INSERT INTO users_order (first_name, last_name, email, password, phone_number, service_type)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;
            `;
            values = [firstName, lastName, email, hashedPassword, phoneNumber, serviceType];
        }

        console.log("SQL Query:", insertQuery);
        console.log("SQL Values:", values);

        const result = await pool.query(insertQuery, values);

        console.log("Database Result:", result.rows[0]);

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Error creating account:", error);
        return NextResponse.json({ error: "Failed to create account. " + error.message }, { status: 500 });
    }
}