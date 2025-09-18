"use client";

import { use } from "react"; // <-- new React hook
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import FinalProctoring from "@/components/proctoring/FinalProctoring";
import { Button1, Button2 } from "@/components/ui/Button";

export default function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params); // ✅ unwrap the promise
  const searchParams = useSearchParams();
  const router = useRouter();

  const candidateName = searchParams.get("name"); 
  const isInterviewer = !candidateName;

  const [detectionActive, setDetectionActive] = useState(false);

  const handleStart = () => {
    setDetectionActive(true);
    // TODO: call API to "start session"
  };

  const handleEnd = () => {
    setDetectionActive(false);
    // TODO: call API to "end session"
    if (isInterviewer) {
      router.push(`/report/${roomId}`);
    } else {
      router.push("/candidate");
    }
  };

  return (
    <div className="p-6 flex flex-col items-center space-y-8 justify-center">
      <h1 className="text-5xl font-bold text-[#D8D9D8]">Room {roomId}</h1>
      <p className="text-xl text-[#808080]">
        {isInterviewer ? "You are the Interviewer" : `Candidate: ${candidateName}`}
      </p>

      {detectionActive ? (
        <FinalProctoring sessionId={roomId} candidateName={candidateName || ""} />
      ) : (
        <p className="text-[#808080] italic">Detection not started yet</p>
      )}

      {isInterviewer && (
        <div className="flex gap-4 mt-6">
          {!detectionActive ? (
            <Button1 onClick={handleStart}>Start Detection</Button1>
          ) : (
            <Button2 onClick={handleEnd}>End Session</Button2>
          )}
        </div>
      )}
    </div>
  );
}
