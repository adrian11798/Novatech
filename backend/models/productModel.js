const { pool } = require('../config/database');

function parse(row) {
  if (!row) return row;
  let specifications = row.specifications;
  if (typeof specifications === 'string') {
    try { specifications = JSON.parse(specifications); } catch { specifications = {}; }
  }
  return { ...row, price: Number(row.price), specifications: specifications || {} };
}

async function findAll({ search, category, includeInactive = false } = {}) {
  const where = [];
  const params = [];
  if (!includeInactive) where.push('active=1');
  if (category && category !== 'all') { where.push('category=?'); params.push(category); }
  if (search) {
    const like = `%${search}%`;
    where.push('(name LIKE ? OR description LIKE ? OR category LIKE ? OR CAST(specifications AS CHAR) LIKE ?)');
    params.push(like, like, like, like);
  }
  const sql = `SELECT id,name,description,category,price,image,specifications,active,created_at,updated_at FROM products ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY id`;
  const [rows] = await pool.execute(sql, params);
  return rows.map(parse);
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT id,name,description,category,price,image,specifications,active,created_at,updated_at FROM products WHERE id=?', [id]);
  return parse(rows[0]);
}

async function create(data) {
  const [result] = await pool.execute('INSERT INTO products (name,description,category,price,image,specifications,active) VALUES (?,?,?,?,?,?,?)', [data.name, data.description, data.category, data.price, data.image || null, JSON.stringify(data.specifications || {}), data.active === false ? 0 : 1]);
  return findById(result.insertId);
}

async function update(id, data) {
  const fields = [];
  const values = [];
  for (const key of ['name', 'description', 'category', 'image']) {
    if (data[key] !== undefined) { fields.push(`${key}=?`); values.push(data[key] || null); }
  }
  if (data.price !== undefined) { fields.push('price=?'); values.push(data.price); }
  if (data.specifications !== undefined) { fields.push('specifications=?'); values.push(JSON.stringify(data.specifications || {})); }
  if (data.active !== undefined) { fields.push('active=?'); values.push(data.active ? 1 : 0); }
  if (!fields.length) return findById(id);
  values.push(id);
  const [result] = await pool.execute(`UPDATE products SET ${fields.join(',')} WHERE id=?`, values);
  if (!result.affectedRows) return null;
  return findById(id);
}

async function deactivate(id) {
  const [result] = await pool.execute('UPDATE products SET active=0 WHERE id=?', [id]);
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, create, update, deactivate };
