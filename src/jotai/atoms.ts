import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { atomFamily } from "jotai/utils";

import {
  X,
  O,
  SquareState,
  computeNextMove,
  isDisabledSquare,
  getGameState,
  INITIAL_BOARD,
} from "../tictactoe";

const boardAtom = atomWithImmer(INITIAL_BOARD);

export const squareFamily = atomFamily((index: number) =>
  atom(
    (get) => get(boardAtom)[index],
    (get, set, value: SquareState) => {
      const isDisabled = get(isDisabledFamily(index));
      if (!isDisabled) {
        set(boardAtom, (board) => {
          board[index] = value;
        });
      }
    }
  )
);

export const isDisabledFamily = atomFamily((index: number) =>
  atom((get) => isDisabledSquare(get(boardAtom), index))
);

export const moveAtom = atom(null, (get, set, index: number) => {
  set(squareFamily(index), X);
  const board = get(boardAtom);
  const nextIndex = computeNextMove(board);
  set(squareFamily(nextIndex), O);
});

export const gameStateAtom = atom((get) => getGameState(get(boardAtom)));

export const resetGameAtom = atom(null, (_, set) => {
  set(boardAtom, INITIAL_BOARD);
});
