const model = require('../models/calculatorModel');
const { calculateEstimate } = require('../services/calculatorService');
const { clean } = require('../utils/validation');

async function calculate(req, res) {
  const result = calculateEstimate(req.body.users, clean(req.body.operation || req.body.type, 50), clean(req.body.redundancy, 50));
  const id = await model.create(result);
  res.status(201).json({ ok: true, id, ...result });
}

async function list(req, res) { res.json(await model.findAll()); }

module.exports = { calculate, list };
