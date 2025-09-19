// app/api/report/[reportId]/route.ts
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

interface EventMetadata {
  message?: string;
  timestamp?: string;
  candidateName?: string;
}

export async function GET(
  req: Request,
  context: { params: { reportId: string } }
) {
  try {
    const reportId = context.params.reportId;

    if (!reportId) {
      return NextResponse.json({ error: "Missing reportId" }, { status: 400 });
    }

    // Fetch report with session, candidate, and events
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        session: {
          include: {
            candidate: true,
            events: { orderBy: { createdAt: "asc" } },
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Transform data for frontend
    const reportData = {
      id: report.id,
      sessionId: report.sessionId,
      candidateName: report.session.candidate.name,
      integrityScore: report.integrity,
      durationMinutes: report.session.endedAt
        ? Math.floor(
            (report.session.endedAt.getTime() - report.session.startedAt.getTime()) /
              1000 /
              60
          )
        : Math.floor((new Date().getTime() - report.session.startedAt.getTime()) / 1000 / 60),
      focusLostCount: report.session.events.filter((e) => {
        const metadata = e.metadata as EventMetadata | undefined;
        return (
          e.type === "FocusDetection" &&
          metadata?.message?.toLowerCase().includes("lost")
        );
      }).length,
      suspiciousEvents: report.session.events.filter((e) => {
        const metadata = e.metadata as EventMetadata | undefined;
        if (!metadata?.message) return false;
        const msg = metadata.message.toLowerCase();
        return (
          (e.type === "FocusDetection" &&
            (msg.includes("multiple faces") || msg.includes("absence"))) ||
          (e.type === "ObjectDetection" &&
            (msg.includes("phone") || msg.includes("book") || msg.includes("notes")))
        );
      }),
      events: report.session.events.map((e) => ({
        id: e.id,
        type: e.type,
        createdAt: e.createdAt,
        metadata: e.metadata,
      })),
    };

    return NextResponse.json(reportData);
  } catch (err) {
    console.error("Error fetching report:", err);
    return NextResponse.json({ error: "Failed to fetch report" }, { status: 500 });
  }
}
