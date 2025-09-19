import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    // Fetch session + events + candidate
    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: {
        candidate: true,
        events: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const now = new Date();
    const endTime = session.endedAt || now;
    const durationMinutes = Math.floor(
      (endTime.getTime() - session.startedAt.getTime()) / 1000 / 60
    );

    // Compute focus lost count
    const focusLostCount = session.events.filter((e) => {
      if (!e.metadata) return false;
      const meta = e.metadata as { message?: string };
      return e.type === "FocusDetection" && meta.message?.toLowerCase().includes("lost");
    }).length;

    // Compute suspicious events
    const suspiciousEvents = session.events.filter((e) => {
      if (!e.metadata) return false;
      const meta = e.metadata as { message?: string };
      const msg = meta.message?.toLowerCase() || "";
      return (
        (e.type === "FocusDetection" &&
          (msg.includes("multiple faces") || msg.includes("absence"))) ||
        (e.type === "ObjectDetection" &&
          (msg.includes("phone") || msg.includes("book") || msg.includes("notes")))
      );
    });

    // Integrity calculation
    let integrityScore = 100 - suspiciousEvents.length * 5;
    if (integrityScore < 0) integrityScore = 0;

    const reportDetails = {
      candidateName: session.candidate.name,
      durationMinutes,
      focusLostCount,
      suspiciousEvents,
      integrityScore,
      events: session.events.map((e) => ({
        id: e.id,
        type: e.type,
        createdAt: e.createdAt,
        metadata: e.metadata,
      })),
    };

    // Save report
    const report = await prisma.report.create({
      data: {
        sessionId: session.id,
        integrity: integrityScore,
        details: reportDetails,
      },
    });

    return NextResponse.json({ message: "Report generated", report });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
