'use client';

import { useReducer, useCallback } from 'react';
import { GameState, GameAction, PropertyColor } from '../lib/types';
import { gameReducer, initialState } from '../lib/gameReducer';

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = useCallback((playerCount: number) => {
    dispatch({ type: 'START_GAME', playerCount });
  }, []);

  const drawCards = useCallback((count: number) => {
    dispatch({ type: 'DRAW_CARDS', count });
  }, []);

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
      dispatch({
        type: 'PLAY_CARD',
        cardInstanceId,
        ...options,
      });
    },
    []
  );

  const endTurn = useCallback(() => {
    dispatch({ type: 'END_TURN' });
  }, []);

  const discardCards = useCallback((cardInstanceIds: string[]) => {
    dispatch({ type: 'DISCARD_CARDS', cardInstanceIds });
  }, []);

  const cancelAction = useCallback(() => {
    dispatch({ type: 'CANCEL_ACTION' });
  }, []);

  return {
    state,
    startGame,
    drawCards,
    playCard,
    endTurn,
    discardCards,
    cancelAction,
  };
}
