import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: "test@gmail.com" },
  });
  console.log(
    "User found:",
    user ? { ...user, password: "[REDACTED]" } : "Not found",
  );
  if (user) {
    console.log("Password length:", user.password.length);
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
