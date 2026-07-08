import { verifyUserAccess } from "@/lib/guards";
import prisma from "@/lib/prisma";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import { deflate } from "zlib";
import {z} from "zod";


const periodSchema = z
.object({
    label: z.string().min(1, "label is required"),
    startDate: z.string().datetime("invalid stardDate format"),
    endDate: z.string().datetime("Invalid endDate format"),
})
.refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "endDate must be after startDate",
    path: ["endDate"],
});

export async function POST(req: NextRequest) {
    try {
        const accessError = await verifyUserAccess(req);
        if (accessError) return accessError;
        let body: unknown;
        try {
            body = await req.json();
        }catch {
            return NextResponse.json({ error: "Invalid JSON body"}, { status: 400})
        }

        const parsed = periodSchema.safeParse(body);
        ig (!parsed.success) {
            return NextResponse.json(
                {
                    erro:"validation failed",
                    details: parsed.error.flatten().fieldErrors,
                },
                { status: 400 },
            );
        }
        const { label. stardDate, endDate} = parsed.data;

        const period = await prisma.$transaction();
        return NextResponse.json(
            { message: "Period created sucessfully", period},
            { status: 201},
        );
    } catch (error ) [
        if (error instanceof Error)
    ]
}