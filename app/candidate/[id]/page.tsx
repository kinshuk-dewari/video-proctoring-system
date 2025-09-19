"use client";

import FinalProctoringOG from "@/components/proctoring/FinalProctoringOG";
import { Button2 } from "@/components/ui/Button";
import { useParams, useSearchParams, useRouter } from "next/navigation";

export default function CandidatePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  // Get sessionId from dynamic route (/candidate/[id])
  const sessionId = params?.id as string;

  // Get candidateName from query string (?name=kk)
  const candidateName = (searchParams.get("name") as string) || "Candidate";

  const handleEndSession = () => {
    router.push(`/report/${sessionId}`);
  };

  return (
    <div className="p-6 flex flex-col items-center space-y-8 justify-center">
      <h1 className="text-7xl pt-28 font-bold text-[#EDEDED]">Your Interview has Started</h1>
      <p className="text-2xl px-4 font-bold text-[#D8D9D8]">Toggle on Start to begin</p>
      <FinalProctoringOG sessionId={sessionId} candidateName={candidateName} />
      <div className="mt-4">
        <Button2 onClick={handleEndSession}>End Session</Button2>
      </div>
    </div>
  );
}
