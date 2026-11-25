const model = require('../models/quoteModel');
const { clean, email } = require('../utils/validation');
const { sendError } = require('../utils/http');

async function create(req, res) {
  const c = req.body.customer || {};
  const customer = {
    name: clean(c.name || req.body.customer_name, 100),
    email: email(c.email || req.body.customer_email),
    phone: clean(c.phone || req.body.customer_phone, 30),
    company: clean(c.company || req.body.company, 150)
  };
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  if (!customer.name || !customer.email) return sendError(res, 400, 'Se requiere nombre y un correo válido.');
  if (!items.length) return sendError(res, 400, 'Agrega al menos un producto o estimación.');
  const result = await model.createQuote({ customer, items, notes: clean(req.body.notes, 3000) });
  res.status(201).json({ ok: true, ...result, message: 'Cotización guardada correctamente.' });
}

async function list(req, res) { res.json(await model.findAll()); }
async function get(req, res) { const quote = await model.findById(req.params.id); if (!quote) return sendError(res, 404, 'Cotización no encontrada.'); res.json(quote); }
async function status(req, res) { const value = clean(req.body.status, 30); if (!['pending', 'review', 'sent', 'approved', 'rejected', 'closed'].includes(value)) return sendError(res, 400, 'Estatus inválido.'); if (!await model.updateStatus(req.params.id, value)) return sendError(res, 404, 'Cotización no encontrada.'); res.json({ ok: true, message: 'Estatus actualizado.' }); }

module.exports = { create, list, get, status };
