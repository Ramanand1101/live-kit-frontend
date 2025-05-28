"use client";

import { useEffect, useRef, useState } from "react";
import {
  Room,
  RoomEvent,
  createLocalTracks,
  LocalVideoTrack,
} from "livekit-client";
import axios from "axios";
import styles from "@/app/room/room.module.css";

export default function RoomBase({ identity, roomName, isHost }) {
  const [joined, setJoined] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(isHost);
  const [participants, setParticipants] = useState([]);

  const localVideoRef = useRef(null);
  const remoteVideosRef = useRef({});
  const roomRef = useRef(null);
  const currentVideoTrackRef = useRef(null);
  const currentAudioTrackRef = useRef(null);

  useEffect(() => {
    if (identity && roomName) handleJoin();
  }, []);

  const handleJoin = async () => {
    try {
      const response = await axios.post(
        "https://live-kit-backend.onrender.com/api/get-token",
        {
          identity,
          roomName,
          isPublisher: true,
        }
      );

      const token = response.data.token;
      const room = new Room();
      roomRef.current = room;

      await room.connect("https://meet.lcmgo.com", token);

      let localTracks = [];

      if (isHost) {
        localTracks = await createLocalTracks({ audio: true, video: true });
      } else if (micEnabled) {
        localTracks = await createLocalTracks({ audio: true });
      }

      for (const track of localTracks) {
        await room.localParticipant.publishTrack(track);
      }

      const videoTrack = localTracks.find((t) => t.kind === "video");
      const audioTrack = localTracks.find((t) => t.kind === "audio");

      if (audioTrack) {
        currentAudioTrackRef.current = audioTrack;
      }

      if (isHost && videoTrack) {
        currentVideoTrackRef.current = videoTrack;
        setTimeout(() => {
          if (localVideoRef.current) {
            videoTrack.attach(localVideoRef.current);
          }
        }, 300);
      }

      setJoined(true);

      room.on(RoomEvent.ParticipantConnected, (p) =>
        setParticipants((prev) => [...prev, p.identity])
      );

      room.on(RoomEvent.ParticipantDisconnected, (p) =>
        setParticipants((prev) => prev.filter((id) => id !== p.identity))
      );

      const attachRemoteTrack = (track, participant) => {
        if (track.kind === "video") {
          let existingVideo = remoteVideosRef.current[participant.identity];
          if (existingVideo) {
            try {
              track.detach(existingVideo);
              existingVideo.srcObject = null;
              existingVideo.remove();
            } catch (e) {
              console.warn("Error cleaning up old video", e);
            }
            delete remoteVideosRef.current[participant.identity];
          }

          const container = document.getElementById("remote-container");
          if (!container) return;

          const videoEl = document.createElement("video");
          videoEl.autoplay = true;
          videoEl.playsInline = true;
          videoEl.width = 300;
          videoEl.style.borderRadius = "10px";
          videoEl.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
          container.appendChild(videoEl);

          remoteVideosRef.current[participant.identity] = videoEl;
          track.attach(videoEl);
        }

        if (track.kind === "audio") {
          const audioEl = document.createElement("audio");
          audioEl.autoplay = true;
          track.attach(audioEl);
          document.body.appendChild(audioEl);
        }
      };

      room.on(RoomEvent.TrackSubscribed, attachRemoteTrack);
      room.on(RoomEvent.TrackPublicationSubscribed, attachRemoteTrack);

      for (const p of room.remoteParticipants.values()) {
        for (const pub of p.trackPublications.values()) {
          if (pub.isSubscribed && pub.track) {
            attachRemoteTrack(pub.track, p);
          }
        }
      }
    } catch (err) {
      console.error("Join error", err);
      alert("Join failed.");
    }
  };

  const handleToggleCamera = async () => {
    const room = roomRef.current;
    if (!room) return;
    const existing = currentVideoTrackRef.current;

    if (cameraEnabled) {
      if (existing) {
        await room.localParticipant.unpublishTrack(existing);
        existing.stop();
        existing.detach();
        currentVideoTrackRef.current = null;
      }
      setCameraEnabled(false);
    } else {
      const [track] = await createLocalTracks({ video: true });
      await room.localParticipant.publishTrack(track);
      currentVideoTrackRef.current = track;
      track.attach(localVideoRef.current);
      setCameraEnabled(true);
    }
  };

  const handleToggleMic = async () => {
    const room = roomRef.current;
    if (!room) return;
    const existing = currentAudioTrackRef.current;

    if (micEnabled) {
      if (existing) {
        await room.localParticipant.unpublishTrack(existing);
        existing.stop();
        currentAudioTrackRef.current = null;
      }
      setMicEnabled(false);
    } else {
      const [track] = await createLocalTracks({ audio: true });
      await room.localParticipant.publishTrack(track);
      currentAudioTrackRef.current = track;
      setMicEnabled(true);
    }
  };

  const handleShareScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 15, max: 30 },
        },
      });

      const screenTrack = stream.getVideoTracks()[0];
      const room = roomRef.current;
      const existingTrack = currentVideoTrackRef.current;

      if (existingTrack) {
        await room.localParticipant.unpublishTrack(existingTrack);
        existingTrack.stop();
        existingTrack.detach();
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = null;
        }
      }

      const screenVideoTrack = new LocalVideoTrack(screenTrack);
      await room.localParticipant.publishTrack(screenVideoTrack, {
        simulcast: false,
        videoEncoding: {
          maxBitrate: 1500_000,
          maxFramerate: 15,
        },
      });
      screenVideoTrack.attach(localVideoRef.current);
      currentVideoTrackRef.current = screenVideoTrack;
      setCameraEnabled(false);

      screenTrack.onended = async () => {
        await room.localParticipant.unpublishTrack(screenVideoTrack);
        screenVideoTrack.stop();
        screenVideoTrack.detach();
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = null;
        }

        const [newCameraTrack] = await createLocalTracks({ video: true });
        await room.localParticipant.publishTrack(newCameraTrack);
        newCameraTrack.attach(localVideoRef.current);
        currentVideoTrackRef.current = newCameraTrack;
        setCameraEnabled(true);
      };
    } catch (err) {
      console.error("Screen share error", err);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>🎥 LCM-GO Room</h1>
      <h2>You’re in the room: <strong>{roomName}</strong></h2>

      {isHost && (
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          width="400"
          className={styles.video}
        />
      )}

      <div style={{ marginTop: 10 }}>
        {isHost && (
          <>
            <button onClick={handleToggleCamera} className={styles.button}>
              {cameraEnabled ? "Stop Camera" : "Start Camera"}
            </button>
            <button
              onClick={handleShareScreen}
              className={`${styles.button} ${styles.shareButton}`}
            >
              Share Screen
            </button>
          </>
        )}
        <button onClick={handleToggleMic} className={styles.micbutton}>
          {micEnabled ? "Mute Mic" : "Unmute Mic"}
        </button>
      </div>

      <div className={styles.participantList}>
        <h3>Participants:</h3>
        <ul>
          <li><strong>You:</strong> {identity}</li>
          {participants.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>

      <div id="remote-container" className={styles.remoteContainer}></div>
    </div>
  );
}
