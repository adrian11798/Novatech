const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function num(name, fallback) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) ? value : fallback;
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: num('PORT', 3000),
  host: process.env.HOST || '0.0.0.0',
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: num('DB_PORT', 3306),
    name: process.env.DB_NAME || 'novatech_test',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  },
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  rateLimitWindowMs: num('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
  rateLimitMax: num('RATE_LIMIT_MAX', 300),
  adminApiKey: process.env.ADMIN_API_KEY || 'cambia-esta-clave-en-pruebas',
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: num('SMTP_PORT', 587),
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.SMTP_FROM || 'contacto@novatech-tech.com',
    to: process.env.SMTP_TO || 'contacto@novatech-tech.com'
  }
};
