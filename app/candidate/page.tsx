"use client";

import RoomForm from "@/components/RoomForm";

export default function Candidate() {

  return (
    <div className="p-6 flex flex-col items-center space-y-8 justify-center">
      <h1 className="text-7xl pt-28 font-bold text-[#D8D9D8] pb-12">Candidate</h1>
      <RoomForm />
    </div>
  );
}
