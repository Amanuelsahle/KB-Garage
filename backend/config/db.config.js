// Import the mysql2 module Promise Wrapper
const mysql = require("mysql2/promise");
// Prepare connection parameters we use to connect to the database
const dbConfig = {
  connectionLimit: 10,

  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
};
// socketPath: process.env.DB_SOCKET_PATH,
// Create the connection pool
const pool = mysql.createPool(dbConfig);
// Prepare a function that will execute the SQL queries asynchronously
async function query(sql, params) {
  const [rows, fields] = await pool.execute(sql, params);
  return rows;
}

async function withTransaction(callback) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

// Export the query function for use in the application
module.exports = { query, withTransaction };
