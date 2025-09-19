import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const sessions = await prisma.interviewSession.findMany({
      include: {
        candidate: { select: { id: true, name: true } },
        events: { orderBy: { createdAt: "asc" } },
        report: true,
      },
      orderBy: { startedAt: "desc" },
    });

    return NextResponse.json(
      sessions.map((session) => ({
        id: session.id,
        roomId: session.roomId,
        candidate: session.candidate,
        integrity: session.integrity,
        startedAt: session.startedAt,
        endedAt: session.endedAt,
        events: session.events,
        report: session.report,
      }))
    );
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
