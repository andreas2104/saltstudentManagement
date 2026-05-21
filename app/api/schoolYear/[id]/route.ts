import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminUser } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await isAdminUser(req);
    if (!isAdmin) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { id } = await params;
    const schoolYearId = Number(id);

    if (isNaN(schoolYearId)) {
      return NextResponse.json({ error: "Invalid school year ID" }, { status: 400 });
    }

    await prisma.schoolYear.delete({
      where: { schoolYearId },
    });

    return NextResponse.json({ message: "School year deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/schoolYear/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
