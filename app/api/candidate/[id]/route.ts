// import { NextResponse } from 'next/server';
// import { v4 as uuidv4 } from 'uuid';

// export async function POST(req: Request) {
//   try {
//     const body = await req.json().catch(() => ({}));
//     const custom = typeof body?.roomId === 'string' && body.roomId.trim();
//     const roomId = custom ? body.roomId.trim() : uuidv4().slice(0, 8);
//     // optionally persist the room to DB here
//     return NextResponse.json({ roomId }, { status: 201 });
//   } catch (err) {
//     return NextResponse.json({ error: 'failed' }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request, { params }: { params: { id: string }}) {
  const roomId = params.id;
  const body = await request.json().catch(() => ({}));
  const { candidateName } = body;

  if (!candidateName) return NextResponse.json({ error: "candidateName required" }, { status: 400 });

  // create or reuse candidate
  let candidate = await prisma.candidate.findFirst({ where: { name: candidateName }});
  if (!candidate) {
    candidate = await prisma.candidate.create({ data: { name: candidateName }});
  }

  // create session
  const session = await prisma.interviewSession.create({
    data: {
      roomId,
      candidateId: candidate.id,
    },
  });

  return NextResponse.json({ session });
}

export async function GET(request: Request, { params }: { params: { id: string }}) {
  const roomId = params.id;
  const session = await prisma.interviewSession.findUnique({
    where: { roomId },
    include: { events: true, candidate: true, videos: true },
  });
  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ session });
}

