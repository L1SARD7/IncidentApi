require('dotenv').config();
const app = require('./app');
const prisma = require('./lib/prisma');
const { ensureSeedData } = require('./startup/ensureSeedData');
const { ensureDbSchema } = require('./startup/ensureDbSchema');

const PORT = Number(process.env.PORT || 3000);

const start = async () => {
  try {
    await ensureDbSchema();
    await prisma.$connect();
    await ensureSeedData();

    app.listen(PORT, () => {
      console.log(`Incident API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();