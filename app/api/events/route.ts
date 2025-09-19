import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { sessionId, type, metadata } = await req.json();

    if (!sessionId || !type) {
      return NextResponse.json(
        { error: "sessionId and type are required" },
        { status: 400 }
      );
    }

    // Make sure session exists
    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Create EventLog
    const event = await prisma.eventLog.create({
      data: {
        sessionId,
        type,
        metadata,
      },
    });

    return NextResponse.json({ success: true, event });
  } catch (err) {
    console.error("Error logging event:", err);
    return NextResponse.json(
      { error: "Failed to log event" },
      { status: 500 }
    );
  }
}
