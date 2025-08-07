import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  console.log('Nothing to seed by default.');
}
main().finally(async () => prisma.$disconnect());
