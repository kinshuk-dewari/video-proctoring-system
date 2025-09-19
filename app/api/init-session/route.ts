// app/api/init-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomId, name } = body;

    if (!roomId || !name) {
      return NextResponse.json({ error: "roomId and name are required" }, { status: 400 });
    }

    // Find or create candidate
    let candidate = await prisma.candidate.findFirst({ where: { name } });
    if (!candidate) {
      candidate = await prisma.candidate.create({ data: { name } });
    }

    // Find or create interview session
    let session = await prisma.interviewSession.findFirst({
      where: { roomId, candidateId: candidate.id },
    });

    if (!session) {
      session = await prisma.interviewSession.create({
        data: { roomId, candidateId: candidate.id },
      });
    }

    return NextResponse.json({
      sessionId: session.id,
      candidateName: candidate.name,
    });
  } catch (err) {
    console.error("Init session error:", err);
    return NextResponse.json({ error: "Failed to initialize session" }, { status: 500 });
  }
}
