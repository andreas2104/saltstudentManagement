import { verifyAdminAccess } from "@/lib/guards";
import { verify } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const accessError = await verifyAdminAccess(req);
        if(accessError) return accessError;
        let body: unknown;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json({ error: "Invalid JSON body"}, {status: 400});
        }

        const parsed = class.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                {
                    error:"validation failed"
                }
            )
        }
    }
}