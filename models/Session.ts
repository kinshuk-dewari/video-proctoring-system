import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  candidateName: String,
  startTime: Date,
  endTime: Date,
  videoUrl: String, 
  stats: {
    focusLostCount: Number,
    noFaceCount: Number,
    multipleFacesCount: Number,
    phoneDetectedCount: Number
  }
});

export default mongoose.models.Session || mongoose.model("Session", SessionSchema);
