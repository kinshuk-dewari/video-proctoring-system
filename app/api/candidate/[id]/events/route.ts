import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request, { params }: { params: { id: string }}) {
  const roomId = params.id;
  const payload = await request.json().catch(() => ({}));
  const { type, metadata, timestamp } = payload;

  if (!type) return NextResponse.json({ error: "type required" }, { status: 400 });

  const session = await prisma.interviewSession.findUnique({ where: { roomId }});
  if (!session) return NextResponse.json({ error: "session not found" }, { status: 404 });

  const event = await prisma.eventLog.create({
    data: {
      sessionId: session.id,
      type,
      metadata,
      createdAt: timestamp ? new Date(timestamp) : undefined,
    },
  });

  return NextResponse.json({ ok: true, event });
}
