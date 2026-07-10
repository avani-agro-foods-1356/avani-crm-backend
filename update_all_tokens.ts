import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const token = "EAAdIUij5eSEBRwsJrB66lordjvB3xj5CcspAzbfmqe6SIbMUpYDzAQ7oHzX9PNGzqa592mEuyPZCF5qvgZAzVUMjcZBQauK9uStSecCxWAFxe7pcXCePcMcZCzu32yQCEN9ZBUBoRGY5bJ1vWvFfhMYaZAMGWOUYMXemZByOMvqqlIcmtT82nmhGZCq9yisebQZDZD";
  const phoneId = "1234724199716806";
  const geminiKey = "AQ.Ab8RN6LEXLzjLSthY_4lSRxc1gFWRaZU0dv6rFVFOW3QlDmVcw";
  
  let workspace = await prisma.workspace.findFirst();
  if (!workspace) {
    workspace = await prisma.workspace.create({ data: { name: 'Avani Loan Services Default' }});
  }

  await prisma.workspace.update({
    where: { id: workspace.id },
    data: { 
      whatsappToken: token,
      whatsappPhoneNumberId: phoneId,
      geminiApiKey: geminiKey
    }
  });
  console.log("All tokens and keys updated in the database!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
