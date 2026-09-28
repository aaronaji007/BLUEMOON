// /api/reservation/route.js
import { NextResponse } from "next/server";
import db from "@/lib/db";
import nodemailer from "nodemailer"; // 👉 Import Nodemailer

export async function POST(req) {
  try {
    console.log("✅ API HIT: /api/reservation");

    const body = await req.json();
    console.log("📦 Received Data:", body);

    const { name, phone, email, date, fromTime, toTime, guests, tableNumber } = body;

    if (!name || !phone || !email || !date || !fromTime || !toTime || !guests || !tableNumber) {
      console.error("❌ Missing Fields:", body);
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Step 1: Check for conflicting reservation
    const conflictQuery = `
      SELECT 1 FROM reservations
      WHERE table_number = $1
        AND reservation_date = $2
        AND ($3::time, $4::time) OVERLAPS (reservation_start_time, reservation_end_time)
    `;
    const conflictValues = [tableNumber, date, fromTime, toTime];
    const conflictResult = await db.query(conflictQuery, conflictValues);

    if (conflictResult.rows.length > 0) {
      console.warn("⚠️ Table already reserved for this slot:", tableNumber);
      return NextResponse.json({ success: false, message: "Table not available for the selected time." }, { status: 409 });
    }
    
    // Step 2: Insert reservation
    const insertQuery = `
      INSERT INTO reservations
        (name, phone, email, reservation_date, reservation_time, reservation_start_time, reservation_end_time, no_of_guest, status, table_number)
      VALUES 
        ($1, $2, $3, $4, NOW(), $5, $6, $7, 'Confirmed', $8)
    `;
    const insertValues = [name, phone, email, date, fromTime, toTime, guests, tableNumber];

    await db.query(insertQuery, insertValues);
    console.log("✅ Reservation inserted successfully.");

    // Step 3: Send email to reservations@bluemoonrestaurants.com
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com", // The address of the post office
      port: 465, // The specific line/channel at the post office
      secure: true, // A way to make sure the communication is private
      auth: {
        user: process.env.SMTP_USER, // Your username at the post office
        pass: process.env.SMTP_PASS, // Your password at the post office
      },
    });


    const mailOptions = {
      from: `"${name} (${email})" <${process.env.SMTP_USER}>`,
      to: "reservations@bluemoonrestaurants.com", // your restaurant reservation email
      subject: `New Table Reservation from ${name}`,
      html: `
        <h3>New Reservation Request</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>From:</strong> ${fromTime}</p>
        <p><strong>To:</strong> ${toTime}</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p><strong>Table Number:</strong> ${tableNumber}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Email sent successfully.");

    return NextResponse.json({ success: true, message: "Reservation successful" }, { status: 200 });

  } catch (error) {
    console.error("🔥 Server Error:", error.message);
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 });
  }
}
