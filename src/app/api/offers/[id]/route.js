//api/offers/[id]/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Ensure this points to your PostgreSQL connection

// ✅ Update Offer (PUT Request)
export async function PUT(request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // Extract the last part of the URL as 'id'

    // Validate the 'id'
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid or missing 'id' in URL." }, { status: 400 });
    }

    const body = await request.json();
    const { selectedItems, totalPrice, discountedPrice, offerType, startDate, endDate } = body;

    // Fetch the current offer details from the database
    const existingOffer = await pool.query("SELECT * FROM offers WHERE id = $1", [id]);
    if (existingOffer.rowCount === 0) {
      return NextResponse.json({ error: "Offer not found." }, { status: 404 });
    }

    const currentOffer = existingOffer.rows[0];

    // Use existing values if a field is not provided
    const updatedSelectedItems = selectedItems ? JSON.stringify(selectedItems) : currentOffer.selected_items;
    const updatedTotalPrice = totalPrice ?? currentOffer.total_price;
    const updatedDiscountedPrice = discountedPrice ?? currentOffer.discounted_price;
    const updatedOfferType = offerType ?? currentOffer.offer_type;
    const updatedStartDate = startDate ?? currentOffer.start_date;
    const updatedEndDate = endDate ?? currentOffer.end_date;

    // Update query
    const query = `
      UPDATE offers
      SET selected_items = $1, total_price = $2, discounted_price = $3, offer_type = $4, start_date = $5, end_date = $6
      WHERE id = $7
      RETURNING *;
    `;
    const values = [
      updatedSelectedItems,
      updatedTotalPrice,
      updatedDiscountedPrice,
      updatedOfferType,
      updatedStartDate,
      updatedEndDate,
      id,
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({ message: "Offer updated successfully!", offer: result.rows[0] });
  } catch (error) {
    console.error("Error updating offer:", error);
    return NextResponse.json({ error: "Failed to update offer." }, { status: 500 });
  }
}

// ✅ Delete Offer (DELETE Request)
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // Extract the last part of the URL as 'id'

    // Validate the 'id'
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid or missing 'id' in URL." }, { status: 400 });
    }

    // Delete query
    const query = "DELETE FROM offers WHERE id = $1 RETURNING *;";
    const values = [id];

    const result = await pool.query(query, values);

    // Check if the record was deleted
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Offer not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Offer deleted successfully!", offer: result.rows[0] });
  } catch (error) {
    console.error("Error deleting offer:", error);
    return NextResponse.json({ error: "Failed to delete offer." }, { status: 500 });
  }
}