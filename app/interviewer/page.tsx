"use client";
import { Button1,Button2 } from '@/components/ui/Button';
import { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [roomId, setRoomId] = useState<string>('');
  const customInputRef = useRef<HTMLInputElement>(null);

  function createRoom(customId?: string) {
    const id = customId?.trim() || uuidv4().slice(0, 8);
    setRoomId(id);
    const url = `${window.location.origin}/room/${id}`;
    navigator.clipboard.writeText(url).catch(() => {});
  }
  

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="max-w-xl w-full p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-[#808080]">Video Proctoring — Interviewer</h1>
        <div className="flex gap-2">
          <Button1 onClick={() => createRoom()}>Create random room </Button1>
          <input
            ref={customInputRef}
            id="custom"
            placeholder="custom room id"
            className="border-[#EDEDED]/20 border text-[#808080] p-2 rounded flex-1"
          />
          <Button2
            onClick={() => {
              const value = customInputRef.current?.value;
              createRoom(value);
            }}
          >
            Create
          </Button2>
        </div>
        {roomId && (
          <div className="mt-4">
            Room: <span className="text-2xl text-[#808080]">{roomId}</span>
            <div className="mt-2">
              <a className="text-xl text-[#808080] underline" href={`/api/room/${roomId}`}>
                Open Room
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}