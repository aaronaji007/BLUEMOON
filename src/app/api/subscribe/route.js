import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 

});

export async function POST(req) {
  try {
    const { name, email } = await req.json();

    if (!name || !email) {
      return new Response(JSON.stringify({ error: "Name and email are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const query = "INSERT INTO subscribe (name, email) VALUES ($1, $2) RETURNING *";
    const values = [name, email];

    try {
      const result = await pool.query(query, values);
      return new Response(
        JSON.stringify({ message: "Subscription successful!", subscriber: result.rows[0] }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      // Check for duplicate email error (unique constraint violation)
      if (error.code === "23505") {
        return new Response(
          JSON.stringify({ error: "You are already subscribed!" }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }
      throw error; // Handle other errors
    }
  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}