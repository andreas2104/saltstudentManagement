import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const events = await prisma.event.findMany();
  console.log("Events count:", events.length);
  if (events.length > 0) {
    console.log("First event:", JSON.stringify(events[0], null, 2));
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
