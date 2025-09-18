import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const custom = typeof body?.roomId === 'string' && body.roomId.trim();
    const roomId = custom ? body.roomId.trim() : uuidv4().slice(0, 8);
    // optionally persist the room to DB here
    return NextResponse.json({ roomId }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
