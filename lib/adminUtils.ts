import { PrismaClient, Role } from "@prisma/client";

export function isAdminEmail(email: string): boolean {
  const adminEmails =
    process.env.ADMIN_EMAIL?.split(",").map((e) =>
      e.trim().toLocaleLowerCase(),
    ) || [];
  return adminEmails.includes(email.toLocaleLowerCase());
}

export function getAdminEmails(): string[] {
  return (
    process.env.ADMIN_EMAIL?.split(",").map((e) => e.trim().toLowerCase()) || []
  );
}

export async function isFirstUser(prisma: PrismaClient): Promise<boolean> {
  const userCount = await prisma.user.count();
  return userCount === 0;
}

export async function determineUserRole(
  email: string,
  prisma: PrismaClient,
): Promise<Role> {
  const firstUser = await isFirstUser(prisma);
  const adminEmail = isAdminEmail(email);

  return firstUser || adminEmail ? Role.ADMIN : Role.INSTRUCTOR;
}

export async function isAdminUser(email: string, prisma: PrismaClient): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  return user?.role === Role.ADMIN;
}

