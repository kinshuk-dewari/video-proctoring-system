// app/api/report/[sessionId]/route.ts
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  const sessionId = params?.sessionId; // ✅ correctly await param

  if (!sessionId)
    return NextResponse.json(
      { error: "Missing sessionId" },
      { status: 400 }
    );

  try {
    // Fetch session with candidate and events
    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: {
        candidate: true,
        events: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!session)
      return NextResponse.json({ error: "Session not found" }, { status: 404 });

    const events = session.events.map((e) => ({
      id: e.id,
      type: e.type,
      createdAt: e.createdAt,
      metadata: e.metadata ?? {},
    }));

    // Compute duration
    const startedAt = session.startedAt;
    const endedAt = session.endedAt || new Date();
    const durationMinutes = Math.round(
      (endedAt.getTime() - startedAt.getTime()) / 60000
    );

    const focusLostCount = events.filter((e) => e.type === "LOOK_AWAY").length;

    const suspiciousEvents = events.filter((e) =>
      ["MULTIPLE_FACES", "ABSENCE", "PHONE_NOTES"].includes(e.type)
    );

    let deductions = focusLostCount * 2 + suspiciousEvents.length * 5;
    const integrityScore = Math.max(0, 100 - deductions);

    return NextResponse.json({
      sessionId: session.id,
      candidateName: session.candidate.name,
      durationMinutes,
      focusLostCount,
      suspiciousEvents,
      integrityScore,
      events,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch session events" },
      { status: 500 }
    );
  }
}
