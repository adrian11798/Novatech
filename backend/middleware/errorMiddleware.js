const { sendError } = require('../utils/http');

function notFound(req, res) {
  sendError(res, 404, `Endpoint no encontrado: ${req.method} ${req.originalUrl}`);
}

function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}`, err);
  if (res.headersSent) return next(err);
  const status = Number(err.statusCode || err.status) || 500;
  sendError(res, status, status === 500 ? 'Error interno del servidor.' : err.message);
}

module.exports = { notFound, errorHandler };
