import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const logs = await prisma.chatLog.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(logs);
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
