// app/page.js
"use client";
import { useRouter } from "next/navigation";
import styles from "./Landing.module.css";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🚀 Welcome to LiveKit Connect</h1>
      <p className={styles.subtitle}>Join or create a room to start your live video session.</p>

      <div className={styles.buttons}>
        <button onClick={() => router.push("/join")} className={styles.primary}>
          Join a Room
        </button>
        <button onClick={() => router.push("/room?name=guest&room=demo&role=audience")} className={styles.secondary}>
          Join Demo Room
        </button>
      </div>
    </div>
  );
}
