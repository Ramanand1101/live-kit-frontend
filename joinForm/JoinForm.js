// components/JoinForm.jsx
"use client";

export default function JoinForm({
  identity,
  setIdentity,
  roomName,
  setRoomName,
  isLoading,
  handleJoin,
  title
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-black/20 z-0"></div>
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            <p className="text-white/70">Enter your name and room to continue</p>
          </div>

          <div className="space-y-4">
           <input
  type="text"
  placeholder="Your Name"
  value={identity}
  onChange={(e) => setIdentity(e.target.value)}
  className="w-full p-4 bg-white/5 text-white placeholder-white/40 rounded-lg border border-white/20 focus:ring-2 focus:ring-purple-400 outline-none"
/>
            <input
              type="text"
              placeholder="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full p-4 bg-white/5 text-white placeholder-white/40 rounded-lg border border-white/20 focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          <button
            onClick={handleJoin}
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 disabled:opacity-50"
          >
            {isLoading ? "Joining..." : title}
          </button>

          <div className="text-center">
            <p className="text-white/50 text-sm">Powered by LCM-GO</p>
          </div>
        </div>
      </div>
    </div>
  );
}
