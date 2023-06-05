import { atom } from "jotai";
import { atomFamily } from "jotai/utils";

import {
  computeNextMove,
  isDisabledSquare,
  getGameState,
  GameHistory,
  getBoardFromHistory,
} from "../tictactoe";

export const historyAtom = atom([] as GameHistory);
export const currentMoveAtom = atom(0);

const boardAtom = atom((get) =>
  getBoardFromHistory(get(historyAtom), get(currentMoveAtom))
);

export const squareFamily = atomFamily((index: number) =>
  atom(
    (get) => get(boardAtom)[index],
    (get, set) => {
      const isDisabled = get(isDisabledFamily(index));
      if (!isDisabled) {
        set(currentMoveAtom, (currentMove) => currentMove + 1);
        set(historyAtom, (history) => [...history, index]);
      }
    }
  )
);

export const isDisabledFamily = atomFamily((index: number) =>
  atom((get) => isDisabledSquare(get(boardAtom), index))
);

const clearFutureHistoryAtom = atom(null, (get, set) => {
  set(historyAtom, (history) => history.slice(0, get(currentMoveAtom)));
});

const playerMoveAtom = atom(null, (_, set, index: number) => {
  set(clearFutureHistoryAtom);
  set(squareFamily(index));
});

const computerMoveAtom = atom(null, (get, set) => {
  const board = get(boardAtom);
  const nextIndex = computeNextMove(board);
  set(squareFamily(nextIndex));
});

export const moveAtom = atom(null, (_, set, index: number) => {
  set(playerMoveAtom, index); // make X move
  set(computerMoveAtom); // make O move
});

export const gameStateAtom = atom((get) => getGameState(get(boardAtom)));

export const canUndoAtom = atom((get) => get(currentMoveAtom) > 0);

export const undoAtom = atom(null, (_, set) => {
  set(currentMoveAtom, (currentMove) => currentMove - 2);
});

export const canRedoAtom = atom((get) => {
  const numMoves = get(historyAtom).length;
  const currentMove = get(currentMoveAtom);
  return currentMove + 2 <= numMoves;
});
3;

export const redoAtom = atom(null, (_, set) => {
  set(currentMoveAtom, (currentMove) => currentMove + 2);
});

export const canResetAtom = atom((get) => {
  const history = get(historyAtom);
  const currentMove = get(currentMoveAtom);

  return history.length !== 0 || currentMove !== 0;
});

export const resetGameAtom = atom(null, (_, set) => {
  set(historyAtom, []);
  set(currentMoveAtom, 0);
});
