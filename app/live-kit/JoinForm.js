"use client";

export default function JoinForm({
  identity,
  roomName,
  isPublisher,
  onIdentityChange,
  onRoomNameChange,
  onIsPublisherChange,
  onJoin,
}) {
  return (
    <div style={styles.joinForm}>
      <input
        placeholder="Your Name"
        value={identity}
        onChange={(e) => onIdentityChange(e.target.value)}
        style={styles.input}
      />
      <input
        placeholder="Room Name"
        value={roomName}
        onChange={(e) => onRoomNameChange(e.target.value)}
        style={styles.input}
      />
      <label style={styles.checkbox}>
        <input
          type="checkbox"
          checked={isPublisher}
          onChange={(e) => onIsPublisherChange(e.target.checked)}
        />
        &nbsp; Publish Camera/Mic
      </label>
      <button onClick={onJoin} style={styles.button}>
        Join Room
      </button>
    </div>
  );
}

const styles = {
  joinForm: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 15,
  },
  input: {
    padding: 10,
    width: "100%",
    maxWidth: 300,
    fontSize: "1rem",
    borderRadius: 5,
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#1d4ed8",
    color: "#fff",
    fontSize: "1rem",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    marginTop: 10,
  },
  checkbox: {
    fontSize: "0.95rem",
    color: "#444",
  },
};
