import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongoose } from "@/lib/db";
import Event from "@/models/Event";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectMongoose();

  if (req.method === "POST") {
    try {
      const event = await Event.create(req.body);
      return res.status(201).json(event);
    } catch (err) {
      return res.status(500).json({ error: "Failed to log event" });
    }
  }

  if (req.method === "GET") {
    const events = await Event.find().sort({ timestamp: -1 });
    return res.json(events);
  }

  res.status(405).json({ error: "Method not allowed" });
}
