const { pool } = require('../config/database');

async function create(data) {
  const [result] = await pool.execute('INSERT INTO contacts (name,email,phone,company,subject,message,status) VALUES (?,?,?,?,?,?,?)', [data.name, data.email, data.phone || null, data.company || null, data.subject || null, data.message, 'new']);
  return result.insertId;
}

async function findAll() {
  const [rows] = await pool.query('SELECT * FROM contacts ORDER BY id DESC');
  return rows;
}

async function updateStatus(id, status) {
  const [result] = await pool.execute('UPDATE contacts SET status=? WHERE id=?', [status, id]);
  return result.affectedRows > 0;
}

module.exports = { create, findAll, updateStatus };
