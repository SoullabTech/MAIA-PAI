import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addBetaTester() {
  // Add Jude Epstein as beta tester
  const jude = await prisma.betaTester.upsert({
    where: { email: 'jude_epstein@sbcglobal.net' },
    update: {},
    create: {
      name: 'Jude Epstein',
      email: 'jude_epstein@sbcglobal.net',
      status: 'invited',
      accessLevel: 'standard',
      notes: 'Beta tester - initial cohort',
    },
  });

  console.log('✅ Beta tester added:', jude);
}

addBetaTester()
  .catch((e) => {
    console.error('Error adding beta tester:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
