import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.template.findMany().then(res => console.log(res)).finally(() => prisma.$disconnect());
