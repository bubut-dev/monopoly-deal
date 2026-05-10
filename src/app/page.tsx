'use client';

import React, { useState, useCallback } from 'react';
import Game from '../components/Game';
import Lobby from '../components/Lobby';
import { useGame } from '../hooks/useGame';
import { useFirebaseGame } from '../hooks/useFirebaseGame';
import { ThemeId } from '../lib/themes/types';
import {
  createRoom,
  joinRoom,
  setPlayerReady,
  leaveRoom,
  generatePlayerId,
  RoomData,
} from '../lib/firebaseRooms';

type Screen = 'home' | 'local-setup' | 'local-game' | 'lobby' | 'online-game';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('home');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [playerId] = useState(() => generatePlayerId());
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState<ThemeId>('classic');

  // Local game hook
  const localGame = useGame();

  // Online game hook
  const firebaseGame = useFirebaseGame({
    roomCode,
    playerId,
    playerName,
    isActive: screen === 'online-game',
  });

  // Name is required
  const nameValid = playerName.trim().length >= 1 && playerName.trim().length <= 15;

  // Handle create room
  const handleCreateRoom = useCallback(async () => {
    if (!nameValid) return;
    setError('');

    const result = await createRoom(playerName.trim(), playerId, (data) => {
      setRoomData(data);
      if (data && data.status === 'playing') {
        setScreen('online-game');
      }
    });

    if (result) {
      setRoomCode(result.roomCode);
      setScreen('lobby');
    } else {
      setError('Failed to create room. Please try again.');
    }
  }, [nameValid, playerName, playerId]);

  // Handle join room
  const handleJoinRoom = useCallback(async () => {
    if (!nameValid || !joinCode.trim()) return;
    setError('');

    const success = await joinRoom(joinCode.trim(), playerName.trim(), playerId, (data) => {
      setRoomData(data);
      if (data && data.status === 'playing') {
        setScreen('online-game');
      }
    });

    if (success) {
      setRoomCode(joinCode.trim().toUpperCase());
      setScreen('lobby');
    } else {
      setError('Room not found, full, or game already in progress.');
    }
  }, [nameValid, playerName, playerId, joinCode]);

  // Handle ready toggle
  const handleReadyToggle = useCallback(async () => {
    if (!roomCode) return;
    const currentReady = roomData?.players[playerId]?.ready || false;
    await setPlayerReady(roomCode, playerId, !currentReady);
  }, [roomCode, playerId, roomData]);

  // Handle start game (host)
  const handleStartOnlineGame = useCallback(async () => {
    if (!roomData) return;
    const playerNames = Object.values(roomData.players)
      .filter((p) => p.connected)
      .map((p) => p.name);
    firebaseGame.startGame(playerNames.length, playerNames);
  }, [roomData, firebaseGame]);

  // Handle leave room
  const handleLeaveRoom = useCallback(async () => {
    if (roomCode) {
      await leaveRoom(roomCode, playerId);
    }
    setRoomCode('');
    setRoomData(null);
    setJoinCode('');
    setScreen('home');
  }, [roomCode, playerId]);

  // Handle local play
  const handleLocalPlay = useCallback(() => {
    setScreen('local-setup');
  }, []);

  // Handle back to home
  const handleBackToHome = useCallback(() => {
    setScreen('home');
    setError('');
  }, []);

  // Handle theme change
  const handleThemeChange = useCallback((newTheme: ThemeId) => {
    setTheme(newTheme);
  }, []);

  // ============================================
  // RENDER SCREENS
  // ============================================

  // Home Screen
  if (screen === 'home') {
    return (
      <main className="h-screen w-screen overflow-hidden">
        <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in px-4">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="text-5xl sm:text-7xl mb-4">{theme === 'bali' ? '🏝️' : '🃏'}</div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {theme === 'bali' ? 'BALI' : 'MONOPOLY'}
              <span className={`block sm:inline ${theme === 'bali' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                {' '}DEAL
              </span>
            </h1>
            <p className="text-white/40 text-sm mt-2 tracking-widest uppercase">
              Card Game
            </p>
          </div>

          {/* Name Input */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8 mb-6 max-w-sm w-full">
            <h2 className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-4 text-center">
              Your Name
            </h2>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && nameValid && handleCreateRoom()}
              placeholder="Enter your name..."
              maxLength={15}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/30 transition-all text-center text-lg font-semibold"
            />

            {error && (
              <p className="text-red-400 text-xs text-center mt-3">{error}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 max-w-sm w-full">
            {/* Play Locally */}
            <button
              onClick={handleLocalPlay}
              className="w-full py-3.5 rounded-xl font-bold text-lg
                bg-gradient-to-r from-emerald-400 to-green-500 text-black
                hover:from-emerald-300 hover:to-green-400
                shadow-lg shadow-green-400/20 hover:shadow-green-400/40
                transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              🎮 Play Locally
            </button>

            <div className="flex gap-3">
              {/* Create Room */}
              <button
                onClick={handleCreateRoom}
                disabled={!nameValid}
                className={`
                  flex-1 py-3.5 rounded-xl font-bold text-base transition-all duration-200
                  ${nameValid
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-300 hover:to-amber-400 shadow-lg shadow-yellow-400/20 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                  }
                `}
              >
                🏠 Create Room
              </button>

              {/* Join Room */}
              <button
                onClick={() => {
                  if (!nameValid) return;
                  // Show join dialog inline
                  const code = prompt('Enter room code:');
                  if (code && code.trim()) {
                    setJoinCode(code.trim());
                    // Trigger join
                    const joinAsync = async () => {
                      setError('');
                      const success = await joinRoom(
                        code.trim().toUpperCase(),
                        playerName.trim(),
                        playerId,
                        (data) => {
                          setRoomData(data);
                          if (data && data.status === 'playing') {
                            setScreen('online-game');
                          }
                        }
                      );
                      if (success) {
                        setRoomCode(code.trim().toUpperCase());
                        setScreen('lobby');
                      } else {
                        setError('Room not found, full, or game already in progress.');
                      }
                    };
                    joinAsync();
                  }
                }}
                disabled={!nameValid}
                className={`
                  flex-1 py-3.5 rounded-xl font-bold text-base transition-all duration-200
                  ${nameValid
                    ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                  }
                `}
              >
                🔗 Join Room
              </button>
            </div>
          </div>

          {/* Rules summary */}
          <div className="text-center text-white/30 text-xs max-w-xs space-y-1 mt-6">
            <p>Draw 2 cards per turn • Play up to 3 cards</p>
            <p>First to complete 3 property sets wins!</p>
          </div>
        </div>
      </main>
    );
  }

  // Local Game Setup / Game
  if (screen === 'local-setup' || screen === 'local-game') {
    return (
      <main className="h-screen w-screen overflow-hidden">
        <Game
          state={localGame.state}
          onDrawCards={localGame.drawCards}
          onPlayCard={localGame.playCard}
          onEndTurn={localGame.endTurn}
          onStartGame={(count) => {
            localGame.startGame(count);
            setScreen('local-game');
          }}
          onBackToHome={handleBackToHome}
          mode="local"
          theme={theme}
          onThemeChange={handleThemeChange}
        />
      </main>
    );
  }

  // Lobby
  if (screen === 'lobby') {
    return (
      <main className="h-screen w-screen overflow-hidden">
        <Lobby
          roomCode={roomCode}
          playerId={playerId}
          playerName={playerName}
          roomData={roomData}
          onReadyToggle={handleReadyToggle}
          onStartGame={handleStartOnlineGame}
          onLeave={handleLeaveRoom}
        />
      </main>
    );
  }

  // Online Game
  if (screen === 'online-game') {
    return (
      <main className="h-screen w-screen overflow-hidden">
        <Game
          state={firebaseGame.state}
          onDrawCards={firebaseGame.drawCards}
          onPlayCard={firebaseGame.playCard}
          onEndTurn={firebaseGame.endTurn}
          onStartGame={firebaseGame.startGame}
          onBackToHome={handleLeaveRoom}
          mode="online"
          isMyTurn={firebaseGame.isMyTurn}
          myPlayerIndex={firebaseGame.myPlayerIndex}
          roomCode={roomCode}
          theme={theme}
        />
      </main>
    );
  }

  return null;
}
