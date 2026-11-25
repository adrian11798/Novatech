const { pool } = require('../config/database');

async function create(data) {
  const [result] = await pool.execute('INSERT INTO calculator_requests (users,operation,redundancy,estimated_total,result_json) VALUES (?,?,?,?,?)', [data.users, data.operation, data.redundancy, data.estimated_total, JSON.stringify(data)]);
  return result.insertId;
}

async function findAll() {
  const [rows] = await pool.query('SELECT * FROM calculator_requests ORDER BY id DESC');
  return rows.map(r => ({ ...r, estimated_total: Number(r.estimated_total) }));
}

module.exports = { create, findAll };
