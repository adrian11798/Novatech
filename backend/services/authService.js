const crypto = require('crypto');

function createPasswordHash(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return { salt, hash };
}

function verifyPassword(password, salt, expectedHash) {
  const actual = createPasswordHash(password, salt).hash;
  return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expectedHash, 'hex'));
}

function createToken(user) {
  const payload = `${user.id}:${user.email}:${Date.now()}:${crypto.randomBytes(24).toString('hex')}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

module.exports = { createPasswordHash, verifyPassword, createToken };
