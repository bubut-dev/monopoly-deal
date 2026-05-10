import { database } from './firebase';
import {
  ref,
  set,
  get,
  update,
  remove,
  onValue,
  onDisconnect,
  serverTimestamp,
  push,
  child,
} from 'firebase/database';

// ============================================
// TYPES
// ============================================

export interface RoomPlayer {
  name: string;
  connected: boolean;
  ready: boolean;
  joinedAt: number;
}

export interface RoomData {
  host: string;
  status: 'lobby' | 'playing' | 'finished';
  players: Record<string, RoomPlayer>;
  createdAt: number;
}

export type RoomListener = (room: RoomData | null) => void;
export type PlayerCountListener = (count: number) => void;

// ============================================
// HELPERS
// ============================================

/** Generate a random 5-char room code */
function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I, O, 0, 1 for clarity
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/** Generate a unique player ID */
export function generatePlayerId(): string {
  return 'p_' + Math.random().toString(36).substring(2, 10);
}

// ============================================
// ROOM MANAGEMENT
// ============================================

/**
 * Create a new room and join it as host.
 * Returns { roomCode, playerId } or null if creation failed.
 */
export async function createRoom(
  playerName: string,
  playerId: string,
  onRoomUpdate: RoomListener
): Promise<{ roomCode: string } | null> {
  // Try up to 5 times to find an unused code
  for (let attempt = 0; attempt < 5; attempt++) {
    const roomCode = generateRoomCode();
    const roomRef = ref(database, `rooms/${roomCode}`);

    // Check if room already exists
    const snapshot = await get(roomRef);
    if (snapshot.exists()) continue;

    // Create the room
    const roomData: RoomData = {
      host: playerId,
      status: 'lobby',
      players: {
        [playerId]: {
          name: playerName,
          connected: true,
          ready: false,
          joinedAt: Date.now(),
        },
      },
      createdAt: Date.now(),
    };

    await set(roomRef, roomData);

    // Set up presence (on disconnect)
    const playerRef = ref(database, `rooms/${roomCode}/players/${playerId}`);
    await onDisconnect(playerRef).update({ connected: false });

    // Listen for room changes
    const unsubscribe = onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        onRoomUpdate(snapshot.val() as RoomData);
      } else {
        onRoomUpdate(null);
      }
    });

    // Store unsubscribe for cleanup
    (createRoom as any)._unsubscribes = (createRoom as any)._unsubscribes || {};
    (createRoom as any)._unsubscribes[roomCode] = unsubscribe;

    return { roomCode };
  }

  return null;
}

/**
 * Join an existing room.
 * Returns true if joined successfully, false if room doesn't exist or is full/playing.
 */
export async function joinRoom(
  roomCode: string,
  playerName: string,
  playerId: string,
  onRoomUpdate: RoomListener
): Promise<boolean> {
  const roomRef = ref(database, `rooms/${roomCode}`);
  const snapshot = await get(roomRef);

  if (!snapshot.exists()) return false;

  const roomData = snapshot.val() as RoomData;

  // Can't join if game is in progress or finished
  if (roomData.status !== 'lobby') return false;

  // Check max players (connected players only)
  // Prevent stale disconnected entries from blocking new joins.
  const connectedPlayerCount = Object.values(roomData.players).filter((p) => p.connected).length;
  if (connectedPlayerCount >= 4) return false;

  // Add player to room
  const playerData: RoomPlayer = {
    name: playerName,
    connected: true,
    ready: false,
    joinedAt: Date.now(),
  };

  await update(child(roomRef, `players/${playerId}`), playerData);

  // Set up presence
  const playerRef = ref(database, `rooms/${roomCode}/players/${playerId}`);
  await onDisconnect(playerRef).update({ connected: false });

  // Listen for room changes
  const unsubscribe = onValue(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      onRoomUpdate(snapshot.val() as RoomData);
    } else {
      onRoomUpdate(null);
    }
  });

  (createRoom as any)._unsubscribes = (createRoom as any)._unsubscribes || {};
  (createRoom as any)._unsubscribes[roomCode] = unsubscribe;

  return true;
}

/**
 * Set player ready status.
 */
export async function setPlayerReady(
  roomCode: string,
  playerId: string,
  ready: boolean
): Promise<void> {
  await update(
    ref(database, `rooms/${roomCode}/players/${playerId}`),
    { ready }
  );
}

/**
 * Update room status (e.g., start game).
 */
export async function setRoomStatus(
  roomCode: string,
  status: 'lobby' | 'playing' | 'finished'
): Promise<void> {
  await update(ref(database, `rooms/${roomCode}`), { status });
}

/**
 * Remove a player from a room.
 */
export async function leaveRoom(
  roomCode: string,
  playerId: string
): Promise<void> {
  const playerRef = ref(database, `rooms/${roomCode}/players/${playerId}`);
  // Cancel onDisconnect
  await onDisconnect(playerRef).cancel();
  await remove(playerRef);

  // Check if room is now empty, if so delete it
  const roomRef = ref(database, `rooms/${roomCode}`);
  const snapshot = await get(child(roomRef, 'players'));
  if (snapshot.exists()) {
    const remaining = Object.keys(snapshot.val());
    if (remaining.length === 0) {
      await remove(roomRef);
    } else {
      // If the leaving player was host, transfer host to first remaining player
      const roomSnapshot = await get(roomRef);
      if (roomSnapshot.exists()) {
        const roomData = roomSnapshot.val() as RoomData;
        if (roomData.host === playerId) {
          await update(roomRef, { host: remaining[0] });
        }
      }
    }
  }
}

/**
 * Write game state to Firebase.
 */
export async function writeGameState(
  roomCode: string,
  gameState: unknown
): Promise<void> {
  await set(ref(database, `rooms/${roomCode}/gameState`), gameState);
}

/**
 * Listen to game state changes.
 */
export function onGameStateChange(
  roomCode: string,
  callback: (gameState: unknown | null) => void
): () => void {
  const gameStateRef = ref(database, `rooms/${roomCode}/gameState`);
  return onValue(gameStateRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback(null);
    }
  });
}

/**
 * Stop listening to a room.
 */
export function unsubscribeRoom(roomCode: string): void {
  const unsubs = (createRoom as any)._unsubscribes || {};
  if (unsubs[roomCode]) {
    unsubs[roomCode]();
    delete unsubs[roomCode];
  }
}

/**
 * Mark player as connected (for reconnection).
 */
export async function markConnected(
  roomCode: string,
  playerId: string
): Promise<void> {
  await update(
    ref(database, `rooms/${roomCode}/players/${playerId}`),
    { connected: true }
  );
  const playerRef = ref(database, `rooms/${roomCode}/players/${playerId}`);
  await onDisconnect(playerRef).update({ connected: false });
}
