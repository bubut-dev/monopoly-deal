'use client';

import React, { useEffect, useState } from 'react';
import { RoomData } from '../lib/firebaseRooms';

interface LobbyProps {
  roomCode: string;
  playerId: string;
  playerName: string;
  roomData: RoomData | null;
  onReadyToggle: () => void;
  onStartGame: () => void;
  onLeave: () => void;
}

export default function Lobby({
  roomCode,
  playerId,
  playerName,
  roomData,
  onReadyToggle,
  onStartGame,
  onLeave,
}: LobbyProps) {
  const [copied, setCopied] = useState(false);
  const isHost = roomData?.host === playerId;

  const players = roomData ? Object.entries(roomData.players || {}) : [];
  const connectedCount = players.filter(([, p]) => Boolean(p?.connected)).length;
  const readyCount = players.filter(([, p]) => Boolean(p?.connected && p?.ready)).length;
  const canStart = connectedCount >= 2 && connectedCount <= 4 && readyCount === connectedCount && isHost;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in px-4">
      {/* Room Code */}
      <div className="mb-8 text-center">
        <div className="text-white/40 text-xs uppercase tracking-widest mb-2">
          Room Code
        </div>
        <div className="flex items-center gap-3">
          <div className="text-5xl sm:text-6xl font-black text-yellow-400 tracking-[0.3em] font-mono">
            {roomCode}
          </div>
          <button
            onClick={handleCopyCode}
            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all text-sm"
            title="Copy code"
          >
            {copied ? '✓' : '📋'}
          </button>
        </div>
        <div className="text-white/30 text-xs mt-2">
          Share this code with other players
        </div>
      </div>

      {/* Players List */}
      <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 p-6 w-full max-w-md mb-6">
        <h2 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-4 text-center">
          Players Connected: {connectedCount} <span className="text-white/35 normal-case">(2–4 to start)</span>
        </h2>

        <div className="space-y-2">
          {players.map(([id, player]) => {
            if (!player) return null;
            const isMe = id === playerId;
            const isHostPlayer = roomData?.host === id;
            return (
              <div
                key={id}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-xl border transition-all
                  ${isMe
                    ? 'border-yellow-400/40 bg-yellow-400/5'
                    : 'border-white/10 bg-white/5'
                  }
                  ${!player.connected ? 'opacity-50' : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      w-3 h-3 rounded-full
                      ${player.connected
                        ? player.ready
                          ? 'bg-green-400 shadow-sm shadow-green-400/50'
                          : 'bg-yellow-400 animate-pulse'
                        : 'bg-red-400'
                      }
                    `}
                  />
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {player.name}
                      {isMe && (
                        <span className="text-yellow-400/70 text-xs ml-1">(you)</span>
                      )}
                    </div>
                    <div className="text-[10px] text-white/40">
                      {player.connected
                        ? player.ready
                          ? 'Ready'
                          : 'Not ready'
                        : 'Disconnected'}
                    </div>
                  </div>
                </div>
                {isHostPlayer && (
                  <span className="text-[10px] bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded-full font-bold">
                    HOST
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Waiting for players message */}
        {connectedCount < 2 && (
          <p className="text-center text-white/30 text-xs mt-4 animate-pulse">
            Waiting for at least 2 players...
          </p>
        )}
        {connectedCount >= 2 && readyCount < connectedCount && (
          <p className="text-center text-white/30 text-xs mt-4 animate-pulse">
            Waiting for all players to ready up...
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-md">
        {/* Ready/Unready button */}
        <button
          onClick={onReadyToggle}
          className={`
            w-full py-3 rounded-xl font-bold text-lg transition-all duration-200
            ${roomData?.players[playerId]?.ready
              ? 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/10'
              : 'bg-gradient-to-r from-green-400 to-emerald-500 text-black hover:from-green-300 hover:to-emerald-400 shadow-lg shadow-green-400/20'
            }
            hover:scale-[1.02] active:scale-[0.98]
          `}
        >
          {roomData?.players[playerId]?.ready ? '✓ Ready (click to unready)' : '👍 Ready Up'}
        </button>

        {/* Start Game button (host only) */}
        {isHost && (
          <button
            onClick={onStartGame}
            disabled={!canStart}
            className={`
              w-full py-3 rounded-xl font-bold text-lg transition-all duration-200
              ${canStart
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-300 hover:to-amber-400 shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/40 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
              }
            `}
          >
            {connectedCount < 2
              ? 'Need 2+ players'
              : readyCount < connectedCount
                ? `Waiting for ${connectedCount - readyCount} player(s)...`
                : '🚀 Start Game'}
          </button>
        )}

        {/* Leave button */}
        <button
          onClick={onLeave}
          className="w-full py-2.5 rounded-xl font-semibold text-sm text-white/40 hover:text-red-400 hover:bg-red-400/10 border border-white/5 hover:border-red-400/20 transition-all"
        >
          Leave Room
        </button>
      </div>
    </div>
  );
}
