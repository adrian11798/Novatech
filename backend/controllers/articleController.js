const model = require('../models/articleModel');
const { sendError } = require('../utils/http');

async function list(req, res) { res.json(await model.findAll()); }
async function get(req, res) { const article = await model.findById(req.params.id); if (!article) return sendError(res, 404, 'Artículo no encontrado.'); res.json(article); }

module.exports = { list, get };
