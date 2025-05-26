// app/live-kit/page.jsx
"use client";

import dynamic from "next/dynamic";

const RoomPage = dynamic(() => import('@/roomPage/Roompage'), {
  ssr: false,
});

export default function Page() {
  return <RoomPage />;
}
