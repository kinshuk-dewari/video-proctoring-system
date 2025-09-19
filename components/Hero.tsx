"use client";
import { useRouter } from "next/navigation";
import { Button1, Button2 } from "./ui/Button"

export default function Hero(){
  const router = useRouter();
  
  return (
    <section className="py-28 mt-48 flex flex-col items-center space-y-18 text-[#D8D9D8]">
      <h1 className="text-7xl font-extrabold text-center ">
        The Proctored Video Interview
      </h1>
      <p className="text-xl text-[#888888] text-center leading-relaxed">
        <span className="text-[#EDEDED]"> Your AI </span>
        Driven Video Proctoring for Online Interviews, <br />
        monitoring for focus, fairness, and exam integrity.
      </p>
      <div className="flex gap-4">
        <Button1 onClick={() => router.push('/interviewer')}>Future Aspect</Button1>
        <Button2 onClick={() => router.push('/candidate')}>Take Interview</Button2>
      </div>
    </section>
  );
}
