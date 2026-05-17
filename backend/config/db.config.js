// Import the pg module
const { Pool } = require("pg");
require("dotenv").config();

// Create the connection pool using the Supabase Connection URI
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for a secure connection to Supabase
  },
});

// Prepare a function that will execute the SQL queries asynchronously
async function query(sql, params) {
  // Postgres returns result info inside an object; the actual rows live in .rows
  const res = await pool.query(sql, params);
  return res.rows;
}

// Handles transactions seamlessly while maintaining MySQL-style syntax compatibility
async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Compatibility Wrapper: Maps MySQL's .execute() array destructuring
    // to PostgreSQL's client object so you don't have to rewrite your controller logic.
    const mysqlCompatibilityClient = {
      execute: async (sql, params) => {
        const res = await client.query(sql, params);
        return [res.rows, null]; // Simulates the [rows, fields] format of mysql2
      },
      query: async (sql, params) => {
        const res = await client.query(sql, params);
        return [res.rows, null];
      },
    };

    const result = await callback(mysqlCompatibilityClient);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// Export the query function and transaction wrapper for use in the application
module.exports = { query, withTransaction };
