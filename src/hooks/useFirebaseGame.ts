'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, GameAction, PropertyColor } from '../lib/types';
import { gameReducer, initialState } from '../lib/gameReducer';
import {
  writeGameState,
  onGameStateChange,
  setRoomStatus,
  markConnected,
} from '../lib/firebaseRooms';

interface UseFirebaseGameOptions {
  roomCode: string;
  playerId: string;
  playerName: string;
  isActive: boolean; // true when game is in 'playing' status
}

export function useFirebaseGame({
  roomCode,
  playerId,
  playerName,
  isActive,
}: UseFirebaseGameOptions) {
  const [state, setState] = useState<GameState>(initialState);
  const [isSyncing, setIsSyncing] = useState(false);
  const localPlayerIndex = useRef<number>(0);
  const isWritingRef = useRef(false);

  // Map playerId to player index
  const getPlayerIndex = useCallback(
    (s: GameState): number => {
      // In multiplayer, we need to figure out which player index we are
      // The players array is ordered by join order
      return localPlayerIndex.current;
    },
    []
  );

  // Listen to game state from Firebase
  useEffect(() => {
    if (!isActive || !roomCode) return;

    // Mark as connected
    markConnected(roomCode, playerId);

    const unsubscribe = onGameStateChange(roomCode, (gameState) => {
      if (!gameState) return;

      const gs = gameState as Partial<GameState>;

      // Defensive guard: RTDB can briefly emit incomplete snapshots during transitions.
      // Ignore partial payloads until all array fields needed by the UI are present.
      if (
        !Array.isArray(gs.players) ||
        !Array.isArray(gs.drawPile) ||
        !Array.isArray(gs.discardPile) ||
        typeof gs.currentPlayerIndex !== 'number' ||
        typeof gs.turnPhase !== 'string'
      ) {
        return;
      }

      const playersShapeValid = gs.players.every(
        (p) => p && Array.isArray((p as any).hand) && Array.isArray((p as any).bank) && Array.isArray((p as any).properties)
      );
      if (!playersShapeValid) {
        return;
      }

      const safeState = gs as GameState;
      setState(safeState);

      // Find our player index using stable room player IDs first (authoritative).
      if (Array.isArray(safeState.playerClientIds) && safeState.playerClientIds.length > 0) {
        const mappedIdx = safeState.playerClientIds.indexOf(playerId);
        if (mappedIdx >= 0) {
          localPlayerIndex.current = mappedIdx;
          return;
        }
      }

      // Fallback for legacy states without playerClientIds.
      const idx = safeState.players.findIndex(
        (p) => p.name === playerName || p.id.toString() === playerId
      );
      if (idx >= 0) {
        localPlayerIndex.current = idx;
      }
    });

    return () => {
      unsubscribe();
    };
  }, [roomCode, playerId, playerName, isActive]);

  // Helper to dispatch and sync to Firebase
  const dispatchAndSync = useCallback(
    (action: GameAction) => {
      if (isWritingRef.current) return;

      isWritingRef.current = true;
      try {
        const newState = gameReducer(state, action);
        setState(newState);

        // Check for game over - update room status
        if (newState.turnPhase === 'gameover' && state.turnPhase !== 'gameover') {
          setRoomStatus(roomCode, 'finished');
        }

        // Write to Firebase
        writeGameState(roomCode, newState);
      } finally {
        isWritingRef.current = false;
      }
    },
    [state, roomCode]
  );

  // Only allow actions when it's this player's turn
  const isMyTurn = state.currentPlayerIndex === localPlayerIndex.current;

  const startGame = useCallback(
    (playerCount: number, playerNames?: string[], playerClientIds?: string[]) => {
      if (isWritingRef.current) return;

      isWritingRef.current = true;
      try {
        // Create initial state with player names
        const startState = gameReducer(initialState, {
          type: 'START_GAME',
          playerCount,
        });

        // Override player names with the actual names from the lobby
        const playersWithNames = startState.players.map((p, i) => ({
          ...p,
          name: playerNames?.[i] || `Player ${i + 1}`,
        }));

        const newState = {
          ...startState,
          players: playersWithNames,
          playerClientIds: playerClientIds ?? [],
        };

        // Find our index
        let idx = -1;
        if (Array.isArray(playerClientIds) && playerClientIds.length > 0) {
          idx = playerClientIds.indexOf(playerId);
        }
        if (idx < 0) {
          idx = newState.players.findIndex((p) => p.name === playerName);
        }
        if (idx >= 0) {
          localPlayerIndex.current = idx;
        }

        setState(newState);
        writeGameState(roomCode, newState);
        setRoomStatus(roomCode, 'playing');
      } finally {
        isWritingRef.current = false;
      }
    },
    [roomCode, playerName]
  );

  const drawCards = useCallback(
    (count: number) => {
      if (!isMyTurn) return;
      dispatchAndSync({ type: 'DRAW_CARDS', count });
    },
    [isMyTurn, dispatchAndSync]
  );

  const playCard = useCallback(
    (
      cardInstanceId: string,
      options?: {
        targetPlayerId?: number;
        targetPropertyColor?: PropertyColor;
        targetCardInstanceId?: string;
        ownCardInstanceId?: string;
        chosenColor?: PropertyColor;
      }
    ) => {
      if (!isMyTurn) return;
      dispatchAndSync({
        type: 'PLAY_CARD',
        cardInstanceId,
        ...options,
      });
    },
    [isMyTurn, dispatchAndSync]
  );

  const endTurn = useCallback(() => {
    if (!isMyTurn) return;
    dispatchAndSync({ type: 'END_TURN' });
  }, [isMyTurn, dispatchAndSync]);

  const discardCards = useCallback(
    (cardInstanceIds: string[]) => {
      if (!isMyTurn) return;
      dispatchAndSync({ type: 'DISCARD_CARDS', cardInstanceIds });
    },
    [isMyTurn, dispatchAndSync]
  );

  const cancelAction = useCallback(() => {
    if (!isMyTurn) return;
    dispatchAndSync({ type: 'CANCEL_ACTION' });
  }, [isMyTurn, dispatchAndSync]);

  return {
    state,
    isMyTurn,
    myPlayerIndex: localPlayerIndex.current,
    startGame,
    drawCards,
    playCard,
    endTurn,
    discardCards,
    cancelAction,
    isSyncing,
  };
}
