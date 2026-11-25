const env = require('../config/env');
const { sendError } = require('../utils/http');

function requireAdminKey(req, res, next) {
  const key = req.get('x-admin-key') || '';
  if (!key || key !== env.adminApiKey) return sendError(res, 401, 'Se requiere una clave administrativa válida.');
  next();
}

module.exports = { requireAdminKey };
