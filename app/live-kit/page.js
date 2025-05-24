"use client";

import { useState, useRef } from "react";
import {
  Room,
  RoomEvent,
  createLocalTracks,
  LocalVideoTrack,
} from "livekit-client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import JoinForm from "./JoinForm";

export default function LiveKitPage() {
  const searchParams = useSearchParams();
  const [identity, setIdentity] = useState(searchParams.get("name") || "");
  const [roomName, setRoomName] = useState(searchParams.get("room") || "");
  const [isPublisher, setIsPublisher] = useState(searchParams.get("role") !== "audience");
  const [joined, setJoined] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [participants, setParticipants] = useState([]);

  const localVideoRef = useRef(null);
  const remoteVideosRef = useRef({});
  const roomRef = useRef(null);
  const currentVideoTrackRef = useRef(null);

  const handleJoin = async () => {
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_TOKEN_ENDPOINT,
        {
          identity,
          roomName,
          isPublisher,
        }
      );

      const token = response.data.token;
      const room = new Room();
      roomRef.current = room;

      await room.connect("ws://localhost:7880", token);

      if (isPublisher) {
        const localTracks = await createLocalTracks({ audio: true, video: true });
        console.log("🎥 Created local tracks:", localTracks.map(t => t.kind));

        for (const track of localTracks) {
          await room.localParticipant.publishTrack(track);
        }

        const videoTrack = localTracks.find((t) => t.kind === "video");
        if (videoTrack) {
          currentVideoTrackRef.current = videoTrack;
          setTimeout(() => {
            if (localVideoRef.current) {
              videoTrack.attach(localVideoRef.current);
              console.log("✅ Local video attached.");
            }
          }, 300);
        }
      }

      setJoined(true);

      room.on(RoomEvent.ParticipantConnected, (participant) => {
        console.log("👤 Participant connected:", participant.identity);
        setParticipants((prev) => [...prev, participant.identity]);
      });

      room.on(RoomEvent.ParticipantDisconnected, (participant) => {
        setParticipants((prev) => prev.filter((id) => id !== participant.identity));
      });

   const attachRemoteTrack = (track, participant) => {
  if (track.kind === "video") {
    let videoEl = remoteVideosRef.current[participant.identity];
    if (!videoEl) {
      const container = document.getElementById("remote-container");
      if (!container) {
        console.warn("❌ remote-container not found in DOM yet.");
        return;
      }

      videoEl = document.createElement("video");
      videoEl.autoplay = true;
      videoEl.playsInline = true;
      videoEl.width = 300;
      videoEl.style.borderRadius = "10px";
      videoEl.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
      container.appendChild(videoEl);
      remoteVideosRef.current[participant.identity] = videoEl;
    }

    track.attach(videoEl);
    console.log(`📡 Attached video track from ${participant.identity}`);
  }
};


      room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        console.log("📡 TrackSubscribed from", participant.identity);
        attachRemoteTrack(track, participant);
      });

      room.on(RoomEvent.TrackPublicationSubscribed, (track, publication, participant) => {
        console.log("📡 TrackPublicationSubscribed from", participant.identity);
        attachRemoteTrack(track, participant);
      });

      room.on(RoomEvent.TrackPublished, (publication, participant) => {
        console.log("🪄 TrackPublished", participant.identity, publication.kind);
      });

      // Attach already connected participants' tracks
      for (const participant of room.remoteParticipants.values()) {
        for (const publication of participant.trackPublications.values()) {
          if (publication.isSubscribed && publication.track) {
            attachRemoteTrack(publication.track, participant);
          }
        }
      }

    } catch (err) {
      console.error("❌ Error joining room:", err);
      alert("Failed to join room. See console for details.");
    }
  };

  const handleToggleCamera = async () => {
    const room = roomRef.current;
    if (!room || !room.localParticipant) return;

    const existingTrack = currentVideoTrackRef.current;

    if (cameraEnabled) {
      if (existingTrack) {
        await room.localParticipant.unpublishTrack(existingTrack);
        existingTrack.stop();
        existingTrack.detach();
        currentVideoTrackRef.current = null;
      }
      setCameraEnabled(false);
    } else {
      const [videoTrack] = await createLocalTracks({ video: true });
      await room.localParticipant.publishTrack(videoTrack);
      currentVideoTrackRef.current = videoTrack;
      videoTrack.attach(localVideoRef.current);
      setCameraEnabled(true);
    }
  };

  const handleShareScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = stream.getVideoTracks()[0];

      const room = roomRef.current;
      if (!room || !room.localParticipant) return;

      const existingTrack = currentVideoTrackRef.current;
      if (existingTrack) {
        await room.localParticipant.unpublishTrack(existingTrack);
        existingTrack.stop();
        existingTrack.detach();
      }

      const livekitScreenTrack = new LocalVideoTrack(screenTrack);
      await room.localParticipant.publishTrack(livekitScreenTrack);
      livekitScreenTrack.attach(localVideoRef.current);
      currentVideoTrackRef.current = livekitScreenTrack;
      setCameraEnabled(false);
    } catch (err) {
      console.error("❌ Screen sharing error:", err);
      alert("Screen sharing failed or permission denied.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🎥 LiveKit Video Room</h1>

      {!joined ? (
        <JoinForm
          identity={identity}
          roomName={roomName}
          isPublisher={isPublisher}
          onIdentityChange={setIdentity}
          onRoomNameChange={setRoomName}
          onIsPublisherChange={setIsPublisher}
          onJoin={handleJoin}
        />
      ) : (
        <>
          <h2 style={{ marginTop: 20 }}>
            You’re in the room: <strong>{roomName}</strong>
          </h2>

          {isPublisher && (
            <>
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                width="400"
                style={styles.video}
              />
              <div style={{ marginTop: 10 }}>
                <button onClick={handleToggleCamera} style={styles.button}>
                  {cameraEnabled ? "Stop Camera" : "Start Camera"}
                </button>
                <button
                  onClick={handleShareScreen}
                  style={{
                    ...styles.button,
                    backgroundColor: "#16a34a",
                    marginLeft: 10,
                  }}
                >
                  Share Screen
                </button>
              </div>
            </>
          )}

          <div style={styles.participantList}>
            <h3>Participants:</h3>
            <ul>
              <li><strong>You:</strong> {identity}</li>
              {participants.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>

          <div id="remote-container" style={styles.remoteContainer} />
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: 30,
    fontFamily: "sans-serif",
    textAlign: "center",
    maxWidth: 900,
    margin: "0 auto",
  },
  heading: {
    fontSize: "2.2rem",
    marginBottom: 30,
    color: "#333",
  },
  video: {
    borderRadius: 10,
    marginTop: 20,
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#1d4ed8",
    color: "#fff",
    fontSize: "1rem",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  participantList: {
    marginTop: 30,
    textAlign: "left",
    display: "inline-block",
  },
  remoteContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
    marginTop: 30,
  },
};
