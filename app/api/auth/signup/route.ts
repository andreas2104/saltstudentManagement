import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { determineUserRole, isFirstUser } from "@/lib/adminUtils";
import { SignupFormSchema } from "@/lib/definition";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  console.log("post signup runnn..");
  try {
    const body = await req.json();
    const parsed = SignupFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "validation failed",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, lastname, email, password, contact } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "email already exists",
          errors: {
            email: ["this email is already in use"],
          },
        },
        { status: 400 },
      );
    }

    const isFirst = await isFirstUser(prisma);
    const role = await determineUserRole(email, prisma);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        lastname,
        email: email.toLowerCase(),
        contact,
        role,
        password: hashedPassword,
      },
      select: {
        userId: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    let message = "Account created successfully";
    if (isFirst) {
      message = "Welcome to the platform you're the first user";
    } else if (role === "ADMIN") {
      message = "Admin created successfully";
    }
    const response = NextResponse.json(
      {
        message,
        user: {
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        isFirstUser: isFirst,
      },
      { status: 201 },
    );

    return response;
  } catch (error) {
    console.error("Registration error: ", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace",
    );
    console.error(
      "Error message:",
      error instanceof Error ? error.message : String(error),
    );
    return NextResponse.json({ message: "Server error " }, { status: 500 });
  }
}
