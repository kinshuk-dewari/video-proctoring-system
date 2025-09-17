import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongoose } from "@/lib/db";
import Event from "@/models/Event";
import Session from "@/models/Session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectMongoose();

  const { sessionId } = req.query;

  if (!sessionId) return res.status(400).json({ error: "sessionId required" });

  try {
    const events = await Event.find({ sessionId });
    const session = await Session.findById(sessionId);

    const stats = events.reduce((acc: Record<string, number>, e: any) => {
      acc[e.type] = (acc[e.type] || 0) + 1;
      return acc;
    }, {});

    const integrityScore =
      100 -
      ((stats["look-away"] || 0) * 5 +
        (stats["no-face"] || 0) * 10 +
        (stats["multiple-faces"] || 0) * 15 +
        (stats["phone-detected"] || 0) * 20);

    res.json({
      session,
      stats,
      integrityScore: Math.max(0, integrityScore),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate report" });
  }
}
