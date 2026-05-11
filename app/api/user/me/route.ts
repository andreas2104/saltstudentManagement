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
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 },
      );
    }

    // 1. Verify Token
    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        userId: number;
        email: string;
        role: string;
      };
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.json({ message: "Invalid session" }, { status: 401 });
    }

    // 2. Fetch User
    const user = await prisma.user.findUnique({
      where: { userId: decoded.userId },
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
    console.error("GET /api/user/me error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 },
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: number;
    };
    const body = await req.json();
    const { name, email, password } = body;

    const updateData: { name?: string; email?: string; password?: string } = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No data provided to update" },
        { status: 400 },
      );
    }

    const updatedUser = await prisma.user.update({
      where: { userId: decoded.userId },
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
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("PATCH /api/user/me error:", error);
    return NextResponse.json(
      { message: "Error updating profile" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 },
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: number;
    };

    await prisma.user.delete({
      where: { userId: decoded.userId },
    });

    const response = NextResponse.json({
      message: "Account deleted successfully",
    });
    response.cookies.delete("token");

    return response;
  } catch (error) {
    console.error("DELETE /api/user/me error:", error);
    return NextResponse.json(
      { message: "Error deleting account" },
      { status: 500 },
    );
  }
}
