const { pool } = require('../config/database');

async function findByEmail(email) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email=? LIMIT 1', [email]);
  return rows[0] || null;
}

async function create({ name, email, passwordHash, passwordSalt, role = 'user' }) {
  const [result] = await pool.execute('INSERT INTO users (name,email,password_hash,password_salt,role) VALUES (?,?,?,?,?)', [name, email, passwordHash, passwordSalt, role]);
  return result.insertId;
}

module.exports = { findByEmail, create };
