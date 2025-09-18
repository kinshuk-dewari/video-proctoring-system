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
    <div className="p-6 flex flex-col items-center space-y-8 justify-center ">
      <div className="rounded shadow">
        <h1 className="text-7xl pt-28 font-bold text-[#D8D9D8]">Interviewer</h1>
 
        <div className="flex gap-2 pt-12 flex-col">
          <input
            ref={customInputRef}
            id="custom"
            placeholder="custom room id"
            className="border-[#EDEDED]/20 border text-[#808080] p-2 rounded-md flex-1"
          />
          <Button1
            onClick={() => {
              const value = customInputRef.current?.value;
              createRoom(value);
            }}
          >
            Create custom room
          </Button1>
          <Button2 onClick={() => createRoom()}>Create random room </Button2>
        {roomId && (
        <div className="mt-4 text-2xl text-center text-[#808080]">
            Room: <span className=" text-[#808080]">{roomId}</span>
            <div className="mt-2">
              <a className="text-xl text-[#808080] underline" href={`/room/${roomId}`}>
                Open Room
              </a>

            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}