const model = require('../models/contactModel');
const { clean, email } = require('../utils/validation');
const { sendError } = require('../utils/http');
const { sendContactNotification } = require('../services/emailService');

async function create(req, res) {
  const data = {
    name: clean(req.body.name, 100),
    email: email(req.body.email),
    phone: clean(req.body.phone, 30),
    company: clean(req.body.company, 150),
    subject: clean(req.body.subject, 150),
    message: clean(req.body.message, 5000)
  };
  if (!data.name || !data.email || !data.message) return sendError(res, 400, 'Nombre, correo y mensaje son obligatorios.');
  const id = await model.create(data);
  let emailResult = { sent: false, configured: false };
  try { emailResult = await sendContactNotification(data); } catch (e) { console.error('[SMTP]', e.message); }
  res.status(201).json({ ok: true, id, saved_to_mysql: true, email: emailResult, message: 'Mensaje guardado en la base de pruebas.' });
}

async function list(req, res) { res.json(await model.findAll()); }

async function updateStatus(req, res) {
  const status = clean(req.body.status, 30) || 'new';
  if (!['new', 'read', 'contacted', 'closed'].includes(status)) return sendError(res, 400, 'Estatus inválido.');
  if (!await model.updateStatus(req.params.id, status)) return sendError(res, 404, 'Mensaje no encontrado.');
  res.json({ ok: true, message: 'Estatus actualizado.' });
}

module.exports = { create, list, updateStatus };
