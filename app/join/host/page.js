// app/join/host/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import JoinForm from "@/joinForm/JoinForm";

export default function HostJoinPage() {
  const [identity, setIdentity] = useState("");
  const [roomName, setRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleJoin = () => {
    if (!identity || !roomName) {
      alert("Please enter your name and room name.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      router.push(`/room/host?name=${encodeURIComponent(identity)}&room=${encodeURIComponent(roomName)}`);
    }, 1000);
  };

  return (
    <JoinForm
      identity={identity}
      setIdentity={setIdentity}
      roomName={roomName}
      setRoomName={setRoomName}
      isLoading={isLoading}
      handleJoin={handleJoin}
      title="Join as Host"
    />
  );
}
