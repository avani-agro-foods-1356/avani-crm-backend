import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const token = "EAAdIUij5eSEBR1tjZASBLA9WFpRZAZCEI7ShLfEvwC2ZBECvMNPbZAL2Erkd5LJbP6mVK2ZB9tpkS2PFxSwTpSL0uNBd1onmthi1eiZCDkE0XWPYx6W8dikLOLMbxPq1KimnaT4nV9E2JzxUFkNyS9xBiKUZB248NS5gUcQWk7GLTsQZBUWF4SzkpOazCo3XIBAZDZD";
  
  let workspace = await prisma.workspace.findFirst();
  if (workspace) {
    await prisma.workspace.update({
      where: { id: workspace.id },
      data: { whatsappToken: token }
    });
    console.log("New token successfully applied to database!");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
