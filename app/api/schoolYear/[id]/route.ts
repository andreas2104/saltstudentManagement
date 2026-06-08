import { Prisma } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { verifyAdminAccess } from "@/lib/guards";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const accessError = await verifyAdminAccess(req);
    if (accessError) return accessError;

    const { id } = await params;
    const schoolYear = await prisma.schoolYear.findUnique({
      where: { schoolYearId: Number(id) },
    });

    if (!schoolYear) {
      return NextResponse.json(
        { error: "School year not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(schoolYear);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const accessError = await verifyAdminAccess(req);
    if (accessError) return accessError;

    const { id } = await params;
    const schoolYear = await prisma.schoolYear.findUnique({
      where: { schoolYearId: Number(id) },
    });

    if (!schoolYear) {
      return NextResponse.json(
        { error: "School year not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(schoolYear);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const accessError = await verifyAdminAccess(req);
    if (accessError) return accessError;
    const { id } = await params;
    const schoolYearId = Number(id);

    if (Number.isNaN(schoolYearId)) {
      return NextResponse.json(
        { error: "Invalid school year ID" },
        { status: 400 },
      );
    }

    await prisma.schoolYear.delete({
      where: { schoolYearId },
    });

    return NextResponse.json({ message: "School year deleted successfully" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "School year  not found" },
          { status: 404 },
        );
      }
    }
    console.error("DELETE /api/schoolYear/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
