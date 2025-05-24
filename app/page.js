'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  const handleJoin = () => {
    if (!name || !room) return alert('Enter name and room');
    router.push(`/room?name=${name}&room=${room}&role=publisher`);
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-semibold mb-4">Join a LiveKit Room</h1>
      <input
        className="border p-2 mr-2"
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border p-2 mr-2"
        type="text"
        placeholder="Room Name"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleJoin}
      >
        Join Room
      </button>
    </div>
  );
}
