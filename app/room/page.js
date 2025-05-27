// // app/live-kit/page.jsx
// "use client";

// import dynamic from "next/dynamic";

// const RoomPage = dynamic(() => import('@/roomPage/Roompage'), {
//   ssr: false,
// });

// export default function Page() {
//   return <RoomPage />;
// }
"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div style={{ padding: 40 }}>
      <h1>Join Room</h1>
      <button onClick={() => router.push('/room/host?room=demo&name=Host')}>
        Join as Host
      </button>
      <button onClick={() => router.push('/room/participant?room=demo&name=User')}>
        Join as Participant
      </button>
    </div>
  );
}
