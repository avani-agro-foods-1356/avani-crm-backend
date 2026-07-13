import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.message.findMany({ where: { direction: 'INBOUND' }, orderBy: { timestamp: 'desc' }, take: 10 }).then(res => console.log(res)).finally(() => prisma.$disconnect());
