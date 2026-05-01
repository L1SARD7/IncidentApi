const { execSync } = require('child_process');

const ensureDbSchema = async () => {
  // For a learning project, keep startup simple: ensure schema exists.
  // Avoid regenerating Prisma Client on every start (can fail on Windows due to file locks).
  execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
};

module.exports = { ensureDbSchema };

