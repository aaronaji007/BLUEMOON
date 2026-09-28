// app/api/guestOrder/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
    try {
        const { firstName, lastName, mobileNumber, email, address, city, postCode, state, serviceType } = await req.json();

        console.log("Received data:", { firstName, lastName, mobileNumber, email, address, city, postCode, state, serviceType });

        if (!firstName || !lastName || !email || !serviceType) { // serviceType is now required
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        let insertQuery;
        let values;

        if (serviceType === "delivery" || serviceType === "DELIVERY")             {
            if (!address || !city || !postCode || !state) {
                return NextResponse.json({ error: "Delivery address is incomplete." }, { status: 400 });
            }

            insertQuery = `
                INSERT INTO users_order (first_name, last_name, phone_number, email, address, city, "postCode", state, service_type)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *;
            `;
            values = [firstName, lastName, mobileNumber, email, address, city, postCode, state, serviceType];
        } else {
            insertQuery = `
                INSERT INTO users_order (first_name, last_name, phone_number, email, service_type)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
            `;
            values = [firstName, lastName, mobileNumber, email, serviceType];
        }

        console.log("Before query execution");
        console.log("Insert Query:", insertQuery);
        console.log("Values:", values);

        const result = await pool.query(insertQuery, values);

        console.log("After query execution");
        console.log("Query result:", result.rows[0]);

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Error saving guest order:", error);
    
        return NextResponse.json({ error: "Failed to save guest order. " + error.message, status: 500 });
    }
}