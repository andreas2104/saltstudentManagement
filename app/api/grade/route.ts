import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyUserAccess } from "@/lib/guards";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const gradeSchema = z.object({
  value: z.number().min(0, "Value must be positive"),
  maxScore: z.number().min(1, "Max score must be at least 1").default(20),
  comment: z.string().optional(),
  studentId: z.number().int().positive("Student is required"),
  periodId: z.number().int().positive("Period is required"),
  assignmentId: z.number().int().positive("Assignment is required"),
});

export async function GET(req: NextRequest) {
  try {
    const accessError = await verifyUserAccess(req);
    if (accessError) return accessError;

    const { searchParams } = new URL(req.url);
    const assignmentId = searchParams.get("assignmentId");
    const studentId = searchParams.get("studentId");

    const where: Record<string, unknown> = {};
    if (assignmentId) where.assignmentId = Number(assignmentId);
    if (studentId) where.studentId = Number(studentId);

    const grades = await prisma.grade.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        student: true,
        period: true,
        assignment: true,
        createdBy: { select: { userId: true, name: true, lastname: true } },
      },
    });

    return NextResponse.json(grades);
  } catch (error) {
    console.error("GET /api/grade error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = gradeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { value, maxScore, comment, studentId, periodId, assignmentId } =
      parsed.data;

    const [student, period, assignment] = await Promise.all([
      prisma.student.findUnique({ where: { studentId } }),
      prisma.period.findUnique({ where: { periodId } }),
      prisma.assignment.findUnique({ where: { assignmentId } }),
    ]);

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    if (!period) {
      return NextResponse.json({ error: "Period not found" }, { status: 404 });
    }
    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 },
      );
    }

    const grade = await prisma.grade.create({
      data: {
        value,
        maxScore,
        comment: comment || null,
        studentId,
        periodId,
        assignmentId,
        createdById: user.userId,
      },
      include: {
        student: true,
        period: true,
        assignment: true,
        createdBy: { select: { userId: true, name: true, lastname: true } },
      },
    });

    return NextResponse.json(
      { message: "Grade created successfully", grade },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/grade error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { id, value, maxScore, comment } = body as {
      id: number;
      value?: number;
      maxScore?: number;
      comment?: string;
    };

    if (!id || value === undefined) {
      return NextResponse.json(
        { error: "Invalid request. 'id' and 'value' are required." },
        { status: 400 },
      );
    }

    const updatedGrade = await prisma.grade.update({
      where: { gradeId: id },
      data: {
        value,
        ...(maxScore !== undefined && { maxScore }),
        ...(comment !== undefined && { comment }),
      },
    });

    return NextResponse.json({
      message: "Grade updated successfully",
      grade: updatedGrade,
    });
  } catch (error) {
    console.error("PATCH /api/grade error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
