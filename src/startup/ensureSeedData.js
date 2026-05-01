const prisma = require('../lib/prisma');
const { seed } = require('../../prisma/seed');

const ensureSeedData = async () => {
  // minimal check: if we already have pumps, assume seed was done
  const pumpCount = await prisma.pump.count().catch(() => 0);
  if (pumpCount > 0) return;

  await seed();
};

module.exports = { ensureSeedData };

