import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Correct clinic_setup__expansion
  const clinicExisting = await prisma.template.findFirst({ where: { name: 'clinic_setup__expansion' } });
  if (clinicExisting) {
    const newClinicContent = `Hello Doctor, planning to upgrade your clinic or buy new medical equipment? AVANI LOAN SERVICES offers specialized Doctor Loans with high limits and low interest rates designed just for medical professionals.

Reply STOP to unsubscribe`;
    await prisma.template.update({
      where: { id: clinicExisting.id },
      data: { content: newClinicContent }
    });
    console.log("Fixed clinic_setup__expansion");
  }

  // Ensure instant_approval_focus is exact
  const instantExisting = await prisma.template.findFirst({ where: { name: 'instant_approval_focus' } });
  if (instantExisting) {
    const newInstantContent = `Hi Sachin, looking for funds for a medical emergency, wedding, or travel? AVANI LOAN SERVICES offers instant Personal Loans starting at just 10.5% p.a. Minimal documentation and fast 24-hour disbursal!

Reply STOP to unsubscribe`;
    await prisma.template.update({
      where: { id: instantExisting.id },
      data: { content: newInstantContent }
    });
    console.log("Fixed instant_approval_focus");
  }

}

main().catch(console.error).finally(() => prisma.$disconnect());
