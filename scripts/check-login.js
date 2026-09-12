const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

function verifyPassword(password, storedHash) {
  const parts = storedHash.split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2_sha512') {
    return false;
  }
  const [, iterations, salt, hash] = parts;
  const candidate = crypto
    .pbkdf2Sync(password, salt, Number(iterations), 64, 'sha512')
    .toString('hex');
  return crypto.timingSafeEqual(
    new Uint8Array(Buffer.from(candidate)),
    new Uint8Array(Buffer.from(hash))
  );
}

async function main() {
  const prisma = new PrismaClient();
  const email = 'admin@phase5.com';
  const password = 'password123';

  const user = await prisma.user.findUnique({ where: { email } });
  console.log('user found:', !!user);
  if (!user) return;
  console.log('hash prefix:', user.passwordHash.slice(0, 30));
  console.log('verify:', verifyPassword(password, user.passwordHash));
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
