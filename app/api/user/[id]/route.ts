import type { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

const getSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token || !process.env.JWT_SECRET) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const userId = Number(id);

    if (Number.isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    // Only Admin or the user themselves can view full details (though GET usually is more permissive in some apps, here we restrict)
    if (session.role !== "ADMIN" && session.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { userId },
      select: {
        userId: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/user/[id] error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const userId = Number(id);

    if (Number.isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    // Only Admin or the user themselves can update
    if (session.role !== "ADMIN" && session.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, role, oldPassword, newPassword } = body;

    const currentUser = await prisma.user.findUnique({
      where: { userId },
    });

    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updateData: {
      name?: string;
      email?: string;
      role?: Role;
      password?: string;
    } = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();

    if (role && session.role === "ADMIN") {
      updateData.role = role;
    }

    if (newPassword) {
      if (!oldPassword) {
        return NextResponse.json(
          { message: "Old password is required to set a new password" },
          { status: 400 },
        );
      }

      const isMatch = await bcrypt.compare(oldPassword, currentUser.password);
      if (!isMatch) {
        return NextResponse.json(
          { message: "Current password (old password) is incorrect" },
          { status: 400 },
        );
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { userId },
      data: updateData,
      select: {
        userId: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("PUT /api/user/[id] error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const userId = Number(id);

    if (Number.isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { userId },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/user/[id] error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
