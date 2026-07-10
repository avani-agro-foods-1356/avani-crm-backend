import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const workspace = await prisma.workspace.updateMany({
    data: { whatsappBusinessAccountId: '27595529416700307' }
  });
  console.log(workspace);
}
run().finally(() => prisma.$disconnect());
