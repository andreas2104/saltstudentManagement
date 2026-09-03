import { DayOfWeek } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminAccess, verifyUserAccess } from "@/lib/guards";
import { prisma } from "@/lib/prisma";

const scheduleSchema = z.object({
  dayOfWeek: z.nativeEnum(DayOfWeek),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Format must be HH:mm (00:00–23:59)"),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Format must be HH:mm (00:00–23:59)"),
  classroom: z.string().optional(),
  assignmentId: z.number().int().positive("Assignment is required"),
  schoolYearId: z.number().int().positive("School year is required"),
});

function timesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return aStart < bEnd && aEnd > bStart;
}

export async function GET(req: NextRequest) {
  try {
    const accessError = await verifyUserAccess(req);
    if (accessError) return accessError;

    const { searchParams } = new URL(req.url);
    const dayOfWeek = searchParams.get("dayOfWeek");
    const schoolYearId = searchParams.get("schoolYearId");
    const assignmentId = searchParams.get("assignmentId");

    const where: Record<string, unknown> = {};
    if (dayOfWeek) where.dayOfWeek = dayOfWeek;
    if (schoolYearId) where.schoolYearId = Number(schoolYearId);
    if (assignmentId) where.assignmentId = Number(assignmentId);

    const schedules = await prisma.schedule.findMany({
      where,
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      include: {
        assignment: {
          include: {
            teacher: { select: { userId: true, name: true, lastname: true } },
            class: { select: { classId: true, name: true, level: true } },
            course: { select: { courseId: true, name: true, code: true } },
          },
        },
        schoolYear: { select: { schoolYearId: true, label: true } },
      },
    });

    return NextResponse.json(schedules);
  } catch (error) {
    console.error("GET /api/schedule error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const accessError = await verifyAdminAccess(req);
    if (accessError) return accessError;

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = scheduleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { dayOfWeek, startTime, endTime, classroom, assignmentId, schoolYearId } =
      parsed.data;

    if (startTime >= endTime) {
      return NextResponse.json(
        { error: "endTime must be after startTime" },
        { status: 400 },
      );
    }

    const assignment = await prisma.assignment.findUnique({
      where: { assignmentId },
      include: {
        teacher: { select: { userId: true, name: true, lastname: true } },
        class: { select: { classId: true, name: true } },
        course: { select: { courseId: true, name: true } },
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 },
      );
    }

    const schoolYear = await prisma.schoolYear.findUnique({
      where: { schoolYearId },
    });

    if (!schoolYear) {
      return NextResponse.json(
        { error: "School year not found" },
        { status: 404 },
      );
    }

    const existingSchedules = await prisma.schedule.findMany({
      where: {
        dayOfWeek,
        schoolYearId,
      },
      include: {
        assignment: {
          include: {
            teacher: { select: { userId: true, name: true, lastname: true } },
            class: { select: { classId: true, name: true } },
            course: { select: { courseId: true, name: true } },
          },
        },
      },
    });

    const conflicts: string[] = [];

    for (const existing of existingSchedules) {
      if (!timesOverlap(startTime, endTime, existing.startTime, existing.endTime)) {
        continue;
      }

      const existingTeacherId = existing.assignment.teacherId;
      if (existingTeacherId === assignment.teacherId) {
        const t = assignment.teacher;
        conflicts.push(
          `Teacher conflict: ${t.name} ${t.lastname} already has a class (${existing.assignment.course.name} – ${existing.assignment.class.name}) from ${existing.startTime} to ${existing.endTime}`,
        );
      }

      const existingClassId = existing.assignment.classId;
      if (existingClassId === assignment.classId) {
        const c = assignment.class;
        conflicts.push(
          `Class conflict: ${c.name} already has a course (${existing.assignment.course.name}) from ${existing.startTime} to ${existing.endTime}`,
        );
      }

      if (
        classroom &&
        existing.classroom &&
        classroom.toLowerCase() === existing.classroom.toLowerCase()
      ) {
        conflicts.push(
          `Classroom conflict: "${classroom}" is already occupied (${existing.assignment.course.name} – ${existing.assignment.class.name}) from ${existing.startTime} to ${existing.endTime}`,
        );
      }
    }

    if (conflicts.length > 0) {
      return NextResponse.json(
        { error: "Schedule conflict(s) detected", conflicts },
        { status: 409 },
      );
    }

    const schedule = await prisma.schedule.create({
      data: {
        dayOfWeek,
        startTime,
        endTime,
        classroom: classroom || null,
        assignmentId,
        schoolYearId,
      },
      include: {
        assignment: {
          include: {
            teacher: { select: { userId: true, name: true, lastname: true } },
            class: { select: { classId: true, name: true, level: true } },
            course: { select: { courseId: true, name: true, code: true } },
          },
        },
        schoolYear: { select: { schoolYearId: true, label: true } },
      },
    });

    return NextResponse.json(
      { message: "Schedule created successfully", schedule },
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint failed")
    ) {
      return NextResponse.json(
        { error: "This assignment already has a schedule for this school year" },
        { status: 409 },
      );
    }
    console.error("POST /api/schedule error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
