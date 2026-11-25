const userModel = require('../models/userModel');
const { createPasswordHash, verifyPassword, createToken } = require('../services/authService');
const { clean, email } = require('../utils/validation');
const { sendError } = require('../utils/http');

async function register(req, res) {
  const name = clean(req.body.name, 100);
  const userEmail = email(req.body.email);
  const password = String(req.body.password || '');
  if (!name || !userEmail || password.length < 6) return sendError(res, 400, 'Nombre, correo válido y contraseña de mínimo 6 caracteres son obligatorios.');
  if (await userModel.findByEmail(userEmail)) return sendError(res, 409, 'El correo ya está registrado.');
  const hash = createPasswordHash(password);
  const id = await userModel.create({ name, email: userEmail, passwordHash: hash.hash, passwordSalt: hash.salt });
  res.status(201).json({ ok: true, id, message: 'Usuario registrado correctamente.' });
}

async function login(req, res) {
  const userEmail = email(req.body.email);
  const password = String(req.body.password || '');
  const user = userEmail ? await userModel.findByEmail(userEmail) : null;
  if (!user || !verifyPassword(password, user.password_salt, user.password_hash)) return sendError(res, 401, 'Credenciales incorrectas.');
  res.json({ ok: true, token: createToken(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}

module.exports = { register, login };
