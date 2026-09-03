import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";
const dbPath = databaseUrl.startsWith("file:")
  ? databaseUrl.substring(5)
  : databaseUrl;
const adapter = new PrismaBetterSqlite3({ url: dbPath });

const prisma = new PrismaClient({ adapter });

export interface SeedResult {
  admin: { email: string; password: string };
  instructors: { email: string; password: string; userId: number }[];
  supervisors: { email: string; password: string; userId: number }[];
  schoolYearId: number;
  classId: number;
  courseId: number;
  periodId: number;
  studentId: number;
}

const TEST_PASSWORD = "1234";

export async function seedDatabase(): Promise<SeedResult> {
  const adminEmail = "e2e.admin@test.com";
  const adminPassword = "admin1234";

  const upsertUser = async (
    email: string,
    role: "ADMIN" | "INSTRUCTOR",
    name: string,
    lastname: string,
  ) => {
    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      return existing;
    }
    const hashed = await bcrypt.hash(TEST_PASSWORD, 10);
    return prisma.user.create({
      data: {
        name,
        lastname,
        contact: "0000000000",
        email,
        role,
        password: hashed,
        status: "ACTIVE",
      },
    });
  };

  const hashedAdmin = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      name: "E2EAdmin",
      lastname: "Test",
      contact: "0000000000",
      email: adminEmail,
      role: "ADMIN",
      password: hashedAdmin,
      status: "ACTIVE",
    },
    update: {},
  });

  const instructor1 = await upsertUser(
    "e2e.teacher1@test.com",
    "INSTRUCTOR",
    "Teacher1",
    "One",
  );
  const instructor2 = await upsertUser(
    "e2e.teacher2@test.com",
    "INSTRUCTOR",
    "Teacher2",
    "Two",
  );
  const supervisor1 = await upsertUser(
    "e2e.supervisor1@test.com",
    "INSTRUCTOR",
    "Supervisor1",
    "One",
  );
  const supervisor2 = await upsertUser(
    "e2e.supervisor2@test.com",
    "INSTRUCTOR",
    "Supervisor2",
    "Two",
  );

  const schoolYear = await prisma.schoolYear.upsert({
    where: { schoolYearId: 1 },
    create: {
      label: "E2E Year",
      startDate: new Date("2026-09-01"),
      endDate: new Date("2027-06-30"),
      status: "ACTIVE",
      schoolYearId: 1,
    },
    update: {},
  });

  const cls = await prisma.class.upsert({
    where: { classId: 1 },
    create: {
      name: "E2E Class",
      level: "E2E",
      status: "ACTIVE",
      schoolYearId: schoolYear.schoolYearId,
      classId: 1,
    },
    update: {},
  });

  const course = await prisma.course.upsert({
    where: { courseId: 1 },
    create: {
      name: "E2E Course",
      code: "E2E-1",
      coefficient: 2,
      statusCourse: "ACTIVE",
      courseId: 1,
    },
    update: {},
  });

  const period = await prisma.period.upsert({
    where: { periodId: 1 },
    create: {
      label: "E2E Period",
      startDate: new Date("2026-09-01"),
      endDate: new Date("2026-12-20"),
      status: "DRAFT",
      schoolYearId: schoolYear.schoolYearId,
      periodId: 1,
    },
    update: {},
  });

  const assignment = await prisma.assignment.upsert({
    where: {
      teacherId_classId_courseId_schoolYearId: {
        teacherId: instructor1.userId,
        classId: cls.classId,
        courseId: course.courseId,
        schoolYearId: schoolYear.schoolYearId,
      },
    },
    create: {
      teacherId: instructor1.userId,
      classId: cls.classId,
      courseId: course.courseId,
      schoolYearId: schoolYear.schoolYearId,
    },
    update: {},
  });

  const student = await prisma.student.upsert({
    where: { studentId: 1 },
    create: {
      studentId: 1,
      registrationNumber: "E2E-STU-001",
      lastname: "Doe",
      firstname: "Jane",
      gender: "FEMALE",
      birthDate: new Date("2010-05-15"),
      status: "ACTIVE",
      classId: cls.classId,
    },
    update: {},
  });

  return {
    admin: { email: adminEmail, password: adminPassword },
    instructors: [
      { email: instructor1.email, password: TEST_PASSWORD, userId: instructor1.userId },
      { email: instructor2.email, password: TEST_PASSWORD, userId: instructor2.userId },
    ],
    supervisors: [
      { email: supervisor1.email, password: TEST_PASSWORD, userId: supervisor1.userId },
      { email: supervisor2.email, password: TEST_PASSWORD, userId: supervisor2.userId },
    ],
    schoolYearId: schoolYear.schoolYearId,
    classId: cls.classId,
    courseId: course.courseId,
    periodId: period.periodId,
    studentId: student.studentId,
  };
}

// Allow running directly with ts-node/esbuild when invoked as a CLI, e.g.:
//   node --import tsx scripts/seed-e2e.ts
if (process.argv[1] && process.argv[1].endsWith("seed-e2e.ts")) {
  seedDatabase()
    .then((r) => {
      console.log("Seeded:", JSON.stringify(r, null, 2));
      return prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error("Seed failed:", e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
