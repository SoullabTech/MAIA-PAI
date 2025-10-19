import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateInviteCode(name: string): string {
  // Generate invite code from name + random
  const cleanName = name.toLowerCase().replace(/\s+/g, '-');
  const random = Math.random().toString(36).substring(2, 8);
  return `${cleanName}-${random}`;
}

async function addBetaTester() {
  // Add Jude Epstein as beta tester
  const inviteCode = generateInviteCode('Jude Epstein');

  const jude = await prisma.betaTester.upsert({
    where: { email: 'jude_epstein@sbcglobal.net' },
    update: {
      inviteCode, // Update code if already exists
    },
    create: {
      name: 'Jude Epstein',
      email: 'jude_epstein@sbcglobal.net',
      status: 'invited',
      accessLevel: 'standard',
      inviteCode,
      notes: 'Beta tester - initial cohort',
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

  console.log('✅ Beta tester added:', jude);
  console.log('📧 Invite code:', jude.inviteCode);
  console.log('\nShare this URL with Jude:');
  console.log(`${baseUrl}/signup?invite=${jude.inviteCode}`);
  console.log('\nOr just share the invite code: ' + jude.inviteCode);
}

addBetaTester()
  .catch((e) => {
    console.error('Error adding beta tester:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
