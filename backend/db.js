const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl:
    process.env.DB_SSL === "true"
      ? { rejectUnauthorized: false } // Needed for Railway SSL
      : false,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Optional: Test database connection on startup
(async () => {
  try {
    const conn = await db.getConnection();
    console.log("✔️ MySQL Connected to:", process.env.DB_NAME);
    conn.release();
  } catch (err) {
    console.error("❌ MySQL Connection Failed:", err.message);
    console.error("Check your DB credentials or Railway Variables.");
  }
})();

module.exports = db;
