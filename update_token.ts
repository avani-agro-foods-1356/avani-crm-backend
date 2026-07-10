import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const token = "EAAdIUij5eSEBRwsJrB66lordjvB3xj5CcspAzbfmqe6SIbMUpYDzAQ7oHzX9PNGzqa592mEuyPZCF5qvgZAzVUMjcZBQauK9uStSecCxWAFxe7pcXCePcMcZCzu32yQCEN9ZBUBoRGY5bJ1vWvFfhMYaZAMGWOUYMXemZByOMvqqlIcmtT82nmhGZCq9yisebQZDZD";
  
  let workspace = await prisma.workspace.findFirst();
  if (workspace) {
    await prisma.workspace.update({
      where: { id: workspace.id },
      data: { whatsappToken: token }
    });
    console.log("Token updated in workspace!");
  } else {
    console.log("No workspace found to update.");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
