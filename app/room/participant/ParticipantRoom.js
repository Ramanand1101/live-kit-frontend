'use client';

import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const RoomBase = dynamic(() => import('@/roomPage/RoomBase'), { ssr: false });

export default function ParticipantRoomClient() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'Participant';
  const room = searchParams.get('room') || 'demo-room';

  return <RoomBase identity={name} roomName={room} isHost={false} />;
}
