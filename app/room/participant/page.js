"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

const RoomBase = dynamic(() => import("@/roomPage/RoomBase"), {
  ssr: false,
});

export default function ParticipantPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Participant";
  const room = searchParams.get("room") || "demo-room";

  return <RoomBase identity={name} roomName={room} isHost={false} />;
}
