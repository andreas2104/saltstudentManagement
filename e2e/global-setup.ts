import { seedDatabase } from "../scripts/seed-e2e";
import { FullConfig } from "@playwright/test";

export default async function globalSetup(_config: FullConfig) {
  const seeded = await seedDatabase();
  console.log("[global-setup] Database seeded:", {
    admin: seeded.admin.email,
    instructors: seeded.instructors.length,
    supervisors: seeded.supervisors.length,
  });
}
