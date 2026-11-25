const { pool } = require('../config/database');

async function findAll() {
  const [rows] = await pool.query('SELECT id,title,category,summary,content,published_at,active FROM articles WHERE active=1 ORDER BY published_at DESC, id DESC');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT id,title,category,summary,content,published_at,active FROM articles WHERE id=? AND active=1', [id]);
  return rows[0] || null;
}

module.exports = { findAll, findById };
