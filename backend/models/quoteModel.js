const { pool } = require('../config/database');

function parseJson(value) {
  if (value == null || typeof value === 'object') return value;
  try { return JSON.parse(value); } catch { return value; }
}

async function createQuote(data) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [quoteResult] = await conn.execute('INSERT INTO quotes (quote_number,customer_name,customer_email,customer_phone,company,notes,total,status) VALUES (?,?,?,?,?,?,?,?)', ['PENDING', data.customer.name, data.customer.email, data.customer.phone || null, data.customer.company || null, data.notes || null, 0, 'pending']);
    const id = quoteResult.insertId;
    const number = `NT-${new Date().getFullYear()}-${String(id).padStart(6, '0')}`;
    await conn.execute('UPDATE quotes SET quote_number=? WHERE id=?', [number, id]);

    let total = 0;
    for (const item of data.items) {
      const quantity = Math.max(1, Math.min(10000, Number(item.quantity) || 1));
      let productId = Number(item.product_id || item.id) || null;
      let name = String(item.name || '').trim();
      let unitPrice = Number(item.unit_price ?? item.price);
      let details = item.details ?? null;
      if (productId) {
        const [products] = await conn.execute('SELECT id,name,price FROM products WHERE id=? AND active=1', [productId]);
        if (!products.length) throw new Error(`Producto ${productId} no encontrado.`);
        name = products[0].name;
        unitPrice = Number(products[0].price);
      }
      if (!name || !Number.isFinite(unitPrice) || unitPrice < 0) throw new Error('Uno de los elementos de la cotización es inválido.');
      const subtotal = Math.round(unitPrice * quantity * 100) / 100;
      total += subtotal;
      await conn.execute('INSERT INTO quote_items (quote_id,product_id,item_type,item_name,quantity,unit_price,subtotal,details_json) VALUES (?,?,?,?,?,?,?,?)', [id, productId, item.item_type || 'product', name, quantity, unitPrice, subtotal, details ? JSON.stringify(details) : null]);
    }
    total = Math.round(total * 100) / 100;
    await conn.execute('UPDATE quotes SET total=? WHERE id=?', [total, id]);
    await conn.commit();
    return { id, quote_number: number, total };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

async function findAll() {
  const [rows] = await pool.query('SELECT * FROM quotes ORDER BY id DESC');
  return rows.map(r => ({ ...r, total: Number(r.total) }));
}

async function findById(id) {
  const [quotes] = await pool.execute('SELECT * FROM quotes WHERE id=?', [id]);
  if (!quotes.length) return null;
  const [items] = await pool.execute('SELECT * FROM quote_items WHERE quote_id=? ORDER BY id', [id]);
  return { ...quotes[0], total: Number(quotes[0].total), items: items.map(i => ({ ...i, unit_price: Number(i.unit_price), subtotal: Number(i.subtotal), details_json: parseJson(i.details_json) })) };
}

async function updateStatus(id, status) {
  const [result] = await pool.execute('UPDATE quotes SET status=? WHERE id=?', [status, id]);
  return result.affectedRows > 0;
}

module.exports = { createQuote, findAll, findById, updateStatus };
