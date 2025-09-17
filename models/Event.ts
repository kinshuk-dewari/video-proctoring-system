import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  sessionId: String,
  type: String, 
  timestamp: { type: Date, default: Date.now },
  details: mongoose.Schema.Types.Mixed
});

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
