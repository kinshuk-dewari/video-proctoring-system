"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoomForm() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId.trim() || !name.trim()) {
      setError("Room ID and Name are required");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // Call backend API to create/fetch candidate and session
      const res = await fetch("/api/init-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: roomId.trim(), name: name.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to join room");
        setLoading(false);
        return;
      }

      // Navigate to candidate page with sessionId
      router.push(`/candidate/${data.sessionId}?name=${encodeURIComponent(data.candidateName)}`);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1C1C1E] p-8 rounded-4xl shadow-lg w-full max-w-sm mx-auto flex flex-col items-center"
    >
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
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        type="submit"
        className={`w-full bg-[#EDEDED] text-xl font-bold text-[#010100] py-4 rounded-md transition-colors duration-200 ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#EDEDED]/80"
        }`}
        disabled={loading}
      >
        {loading ? "Joining..." : "Join Room"}
      </button>
    </form>
  );
}

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function RoomForm() {
//   const router = useRouter();
//   const [roomId, setRoomId] = useState("");
//   const [name, setName] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!roomId.trim()) {
//       setError("Room ID is required");
//       return;
//     }
//     setError("");

//     // router.push(`/candidate/${encodeURIComponent(roomId.trim())}`);
//     router.push(`/room/${encodeURIComponent(roomId.trim())}?name=${encodeURIComponent(name.trim())}`);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="bg-[#1C1C1E] p-8 rounded-4xl shadow-lg w-full max-w-sm mx-auto flex flex-col items-center">
//       <h2 className="text-white text-xl font-bold mb-6">Join Room</h2>
//       <div className="w-full border-[#EDEDED]/20 border-1 rounded-md overflow-hidden mb-6">
//         <input
//           type="text"
//           value={roomId}
//           onChange={(e) => setRoomId(e.target.value)}
//           className="w-full bg-transparent py-4 px-4 text-white placeholder-[#8E8E93] border-b border-[#545456] focus:outline-none"
//           placeholder="Enter Room ID"
//           required
//         />
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="w-full bg-transparent py-4 px-4 text-white placeholder-[#8E8E93] focus:outline-none"
//           placeholder="Enter Your Name"
//         />
//       </div>
//       {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//       <button
//         type="submit"
//         className="w-full bg-[#EDEDED] text-xl font-bold hover:bg-[#EDEDED]/80 text-[#010100] py-4 rounded-md transition-colors duration-200"
//       >
//         Join Room
//       </button>
//     </form>
//   );
// }