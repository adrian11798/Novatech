const model = require('../models/productModel');
const { clean, money } = require('../utils/validation');
const { sendError } = require('../utils/http');

async function list(req, res) {
  res.json(await model.findAll({ search: clean(req.query.search, 100), category: clean(req.query.category, 80) }));
}

async function get(req, res) {
  const product = await model.findById(req.params.id);
  if (!product || !product.active) return sendError(res, 404, 'Producto no encontrado.');
  res.json(product);
}

function normalizeBody(body) {
  const price = money(body.price);
  return {
    name: clean(body.name, 150),
    description: clean(body.description, 3000),
    category: clean(body.category, 80).toLowerCase(),
    price,
    image: clean(body.image, 500),
    specifications: body.specifications && typeof body.specifications === 'object' ? body.specifications : {},
    active: body.active !== false
  };
}

async function create(req, res) {
  const data = normalizeBody(req.body);
  if (!data.name || !data.description || !data.category || data.price === null || data.price < 0) return sendError(res, 400, 'Nombre, descripción, categoría y precio válido son obligatorios.');
  res.status(201).json(await model.create(data));
}

async function update(req, res) {
  const data = {};
  if (req.body.name !== undefined) data.name = clean(req.body.name, 150);
  if (req.body.description !== undefined) data.description = clean(req.body.description, 3000);
  if (req.body.category !== undefined) data.category = clean(req.body.category, 80).toLowerCase();
  if (req.body.image !== undefined) data.image = clean(req.body.image, 500) || null;
  if (req.body.price !== undefined) { data.price = money(req.body.price); if (data.price === null || data.price < 0) return sendError(res, 400, 'Precio inválido.'); }
  if (req.body.specifications !== undefined) data.specifications = req.body.specifications;
  if (req.body.active !== undefined) data.active = Boolean(req.body.active);
  const updated = await model.update(req.params.id, data);
  if (!updated) return sendError(res, 404, 'Producto no encontrado.');
  res.json(updated);
}

async function remove(req, res) {
  if (!await model.deactivate(req.params.id)) return sendError(res, 404, 'Producto no encontrado.');
  res.json({ ok: true, message: 'Producto desactivado.' });
}

module.exports = { list, get, create, update, remove };
