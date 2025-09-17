"use client";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-xl w-full bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Video Proctoring — Interviewer</h1>
        <div className="flex gap-2">
          <button
            onClick={() => createRoom()}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Create random room
          </button>
          <input
            ref={customInputRef}
            id="custom"
            placeholder="custom room id"
            className="border p-2 rounded flex-1"
          />
          <button
            onClick={() => {
              const value = customInputRef.current?.value;
              createRoom(value);
            }}
            className="px-3 py-2 bg-green-600 text-white rounded"
          >
            Create
          </button>
        </div>
        {roomId && (
          <div className="mt-4">
            Room: <span className="font-mono">{roomId}</span>
            <div className="mt-2">
              <a className="text-sm text-blue-700 underline" href={`/api/room/${roomId}`}>
                Open Room
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}