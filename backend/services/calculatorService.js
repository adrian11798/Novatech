const PRICING = Object.freeze({
  office: { base: 950, workstation: 'Workstations Office', server: 'NAS Backup 8TB' },
  dev: { base: 1450, workstation: 'Workstations Mid-Range', server: 'NAS Backup 16TB' },
  heavy: { base: 2300, workstation: 'Workstations High Performance', server: 'Servidor + almacenamiento 32TB' }
});

function calculateEstimate(users, operation, redundancy) {
  let normalizedUsers = Number(users);
  if (!Number.isFinite(normalizedUsers)) normalizedUsers = 25;
  normalizedUsers = Math.round(normalizedUsers / 5) * 5;
  normalizedUsers = Math.max(5, Math.min(200, normalizedUsers));

  const op = PRICING[operation] ? operation : 'office';
  const red = redundancy === 'high' ? 'high' : 'standard';
  const cfg = PRICING[op];
  const redundancyFactor = red === 'high' ? 1.25 : 1;
  const estimatedTotal = Math.round(cfg.base * normalizedUsers * redundancyFactor * 100) / 100;
  const switches = Math.max(1, Math.ceil(normalizedUsers / 24));

  return {
    users: normalizedUsers,
    operation: op,
    redundancy: red,
    base_per_user: cfg.base,
    redundancy_factor: redundancyFactor,
    estimated_total: estimatedTotal,
    workstation: cfg.workstation,
    switches,
    server: cfg.server,
    currency: 'MXN'
  };
}

module.exports = { PRICING, calculateEstimate };
