const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

async function main() {
  const prisma = new PrismaClient();
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync('password123', salt, 100000, 64, 'sha512').toString('hex');
  const passwordHash = `pbkdf2_sha512$100000$${salt}$${hash}`;

  const user = await prisma.user.upsert({
    where: { email: 'admin@phase5.com' },
    update: { name: 'Admin User', passwordHash },
    create: { name: 'Admin User', email: 'admin@phase5.com', passwordHash },
  });

  console.log('Demo user ready:', user.email);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
