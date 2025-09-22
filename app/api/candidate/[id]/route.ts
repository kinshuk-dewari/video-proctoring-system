import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, roomId } = await req.json();

    if (!name || !roomId) {
      return NextResponse.json({ error: "Name and Room ID are required" }, { status: 400 });
    }

    // Step 1: Create candidate
    const candidate = await prisma.candidate.create({
      data: { name },
    });

    // Step 2: Create interview session linked to candidate + roomId
    const session = await prisma.interviewSession.create({
      data: {
        roomId,
        candidateId: candidate.id,
      },
    });

    return NextResponse.json({ candidate, session }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating candidate/session:", error.message);
    } else {
      console.error("Unexpected error creating candidate/session:", error);
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
