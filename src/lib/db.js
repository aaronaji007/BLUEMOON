import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

});


(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL connected!");
    client.release();
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err);
  }
})();

export default pool;
