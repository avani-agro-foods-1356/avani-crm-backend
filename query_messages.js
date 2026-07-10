const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: 'postgresql://postgres.zqemrmzijlaysvfxygst:Samarth%4013566666@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true' } } });
async function main() {
  const messages = await prisma.message.findMany({
    orderBy: { timestamp: 'desc' },
    take: 20
  });
  console.log(JSON.stringify(messages, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
