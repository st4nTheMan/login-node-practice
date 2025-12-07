const mysql = require("mysql2/promise");

// Create connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "my_website",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
async function testConnection() {
  try {
    await pool.query("SELECT 1");
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

testConnection();

// Helper functions for database operations
const db = {
  findOne: async (username) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    return rows[0];
  },

  create: async (userData) => {
    const { firstName, lastName, username, email, password } = userData;
    const [result] = await pool.query(
      "INSERT INTO users (firstName, lastName, username, email, password) VALUES (?, ?, ?, ?, ?)",
      [firstName, lastName, username, email, password]
    );
    return result;
  },

  updateOne: async (condition, updates) => {
    const { username } = condition;
    const { firstName, lastName, email } = updates;
    const [result] = await pool.query(
      "UPDATE users SET firstName = ?, lastName = ?, email = ? WHERE username = ?",
      [firstName, lastName, email, username]
    );
    return result;
  },

  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
  }
};

module.exports = db;