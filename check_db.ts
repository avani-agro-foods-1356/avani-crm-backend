import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const ws = await prisma.workspace.findFirst();
  console.log("Workspace settings:", ws);

  const contacts = await prisma.contact.findMany({ take: 3, orderBy: { createdAt: 'desc' }});
  console.log("Contacts:", contacts);

  const logs = await prisma.message.findMany({ take: 5, orderBy: { timestamp: 'desc' }});
  console.log("Recent messages:", logs);
}

check().finally(() => prisma.$disconnect());
