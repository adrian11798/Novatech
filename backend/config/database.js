const { Pool } = require('pg');
const env = require('./env');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false, max: 5 });
function translate(sql) {
  let i = 0;
  let q = sql.replace(/\?/g, () => `$${++i}`);
  q = q.replace(/CAST\(specifications AS CHAR\)/gi, 'CAST(specifications AS TEXT)');
  // PostgreSQL returns generated identifiers explicitly; preserve the MySQL-shaped model API.
  if (/^\s*INSERT\s+INTO\s+(\w+)/i.test(q) && !/\bRETURNING\b/i.test(q)) q += ' RETURNING id';
  return q;
}
function mysqlResult(result, isInsert=false) {
  return { rows: result.rows, insertId: isInsert && result.rows[0] ? Number(result.rows[0].id) : undefined, affectedRows: result.rowCount || 0 };
}
const adapter = {
 async query(sql, params=[]) {
   const isInsert = /^\s*INSERT\s+/i.test(sql);
   const r = await pool.query(translate(sql), params);
   return isInsert ? [mysqlResult(r, true)] : [r.rows];
 },
 async execute(sql, params=[]) {
   const isInsert = /^\s*INSERT\s+/i.test(sql);
   const r = await pool.query(translate(sql), params);
   return isInsert ? [mysqlResult(r, true)] : (/^\s*SELECT\s+/i.test(sql) ? [r.rows] : [mysqlResult(r)]);
 },
 async getConnection() {
   const client = await pool.connect();
   return {
     async beginTransaction(){ await client.query('BEGIN'); },
     async commit(){ await client.query('COMMIT'); },
     async rollback(){ await client.query('ROLLBACK'); },
     async execute(sql, params=[]) {
       const isInsert = /^\s*INSERT\s+/i.test(sql);
       const r = await client.query(translate(sql), params);
       return isInsert ? [mysqlResult(r, true)] : (/^\s*SELECT\s+/i.test(sql) ? [r.rows] : [mysqlResult(r)]);
     },
     release(){ client.release(); }
   };
 }
};
async function testConnection(){ await pool.query('SELECT 1'); return true; }
module.exports = { pool: adapter, testConnection };
