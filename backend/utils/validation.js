function clean(value, max = 5000) {
  return String(value ?? '').trim().slice(0, max);
}

function email(value) {
  const v = clean(value, 150).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? v : null;
}

function positiveInt(value, min, max) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) return null;
  return n;
}

function money(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100) / 100;
}

module.exports = { clean, email, positiveInt, money };
