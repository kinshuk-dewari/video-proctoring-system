"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoomForm() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId.trim()) {
      setError("Room ID is required");
      return;
    }
    setError("");

    router.push(`/candidate/${encodeURIComponent(roomId.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#1C1C1E] p-8 rounded-4xl shadow-lg w-full max-w-sm mx-auto flex flex-col items-center">
      <h2 className="text-white text-xl font-bold mb-6">Join Room</h2>
      <div className="w-full border-[#EDEDED]/20 border-1 rounded-md overflow-hidden mb-6">
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full bg-transparent py-4 px-4 text-white placeholder-[#8E8E93] border-b border-[#545456] focus:outline-none"
          placeholder="Enter Room ID"
          required
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-transparent py-4 px-4 text-white placeholder-[#8E8E93] focus:outline-none"
          placeholder="Enter Your Name"
        />
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <button
        type="submit"
        className="w-full bg-[#EDEDED] text-xl font-bold hover:bg-[#EDEDED]/80 text-[#010100] py-4 rounded-md transition-colors duration-200"
      >
        Join Room
      </button>
    </form>
  );
}