const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const { pool, testConnection } = require('./config/database');
const { asyncHandler, sendError } = require('./utils/http');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const productRoutes = require('./routes/productRoutes');
const contactRoutes = require('./routes/contactRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');

const app = express();
const frontendPath = path.resolve(__dirname, '..', 'frontend');

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: env.corsOrigin === '*' ? true : env.corsOrigin, credentials: false }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(rateLimit({ windowMs: env.rateLimitWindowMs, limit: env.rateLimitMax, standardHeaders: 'draft-8', legacyHeaders: false }));

app.get('/api/health', asyncHandler(async (req, res) => {
  let database = 'disconnected';
  try { await testConnection(); database = 'connected'; } catch (e) { database = `error: ${e.code || e.message}`; }
  res.json({ ok: database === 'connected', storage: 'PostgreSQL', database, environment: env.nodeEnv, timestamp: new Date().toISOString() });
}));

app.get('/api', (req, res) => res.json({ ok: true, name: 'NovaTech API', version: '3.0.0', storage: 'PostgreSQL' }));
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/calculator', calculatorRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);

app.use(express.static(frontendPath));
app.get(/^(?!\/api(?:\/|$)).*$/, (req, res) => res.sendFile(path.join(frontendPath, 'index.html')));
app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    await testConnection();
    console.log(`PostgreSQL conectado: ${env.db.host}:${env.db.port}/${env.db.name}`);
  } catch (error) {
    console.error('No se pudo conectar a PostgreSQL. Revisa DATABASE_URL en las variables de entorno.');
    console.error(error.message);
    process.exitCode = 1;
    return;
  }
  app.listen(env.port, env.host, () => console.log(`NovaTech ejecutándose en http://${env.host}:${env.port}`));
}

if (require.main === module) start();

module.exports = app;
