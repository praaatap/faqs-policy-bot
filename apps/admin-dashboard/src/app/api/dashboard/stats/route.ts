import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const [userCount, docCount, chatCount, recentLogs] = await Promise.all([
            prisma.user.count(),
            prisma.document.count(),
            prisma.chatLog.count(),
            prisma.chatLog.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
            }),
        ]);

        return NextResponse.json({
            stats: {
                users: userCount,
                documents: docCount,
                chats: chatCount,
            },
            recentLogs,
        });
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
