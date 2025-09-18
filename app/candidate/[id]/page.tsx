"use client";
import ObjectDetection from "@/components/proctoring/object-detection";
import Proctoring from "@/components/proctoring/Proctoring";

export default function Candidate() {
  return (
    <div className="p-6 flex flex-col items-center space-y-8 justify-center">
      {/* <h1 className="text-7xl pt-28 font-bold text-[#D8D9D8]">Candidate</h1>
      <ObjectDetection /> */}
      <h1 className="text-7xl pt-28 font-bold text-[#D8D9D8]">Proctoring</h1>
      <Proctoring />
    </div>
  );
}
 
  
// import { useProctoring } from "@/components/proctoring/useProctoring";


// export default function CandidateProctor({ roomId, candidateName }: {roomId:string, candidateName:string}) {
//   const { videoRef } = useProctoring({
//     roomId,
//     onEvent: (e) => console.log("Event logged", e),
//   });

//   return (
//     <div className="text-white">
//       <video ref={videoRef} autoPlay muted playsInline width={640} height={480} />
//       {/* your COCO canvas overlay component here */} kagskhasf
//     </div>
//   );
// }