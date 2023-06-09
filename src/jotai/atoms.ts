import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { saveGame } from "../tictacdb";

import {
  computeNextMove,
  isDisabledSquare,
  getGameState,
  GameHistory,
  getBoardFromHistory,
  Game,
  EMPTY_GAME,
} from "../tictactoe";

export const baseGameAtom = atom(EMPTY_GAME);

export const gameAtom = atom(
  (get) => get(baseGameAtom),
  (_, set, game: Game) => {
    set(baseGameAtom, game);
    saveGame(game);
  }
);

export const historyAtom = atom(
  (get) => get(gameAtom).history,
  (get, set, history: GameHistory) =>
    set(gameAtom, { ...get(gameAtom), history })
);

export const currentMoveAtom = atom(
  (get) => get(gameAtom).currentMove,
  (get, set, currentMove: number) =>
    set(gameAtom, { ...get(gameAtom), currentMove })
);

const boardAtom = atom((get) => getBoardFromHistory(get(gameAtom)));

export const squareFamily = atomFamily((index: number) =>
  atom(
    (get) => get(boardAtom)[index],
    (get, set) => {
      const isDisabled = get(isDisabledFamily(index));
      if (!isDisabled) {
        set(currentMoveAtom, get(currentMoveAtom) + 1);
        set(historyAtom, [...get(historyAtom), index]);
      }
    }
  )
);

export const isDisabledFamily = atomFamily((index: number) =>
  atom((get) => isDisabledSquare(get(boardAtom), index))
);

const clearFutureHistoryAtom = atom(null, (get, set) => {
  set(historyAtom, get(historyAtom).slice(0, get(currentMoveAtom)));
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

export const undoAtom = atom(null, (get, set) => {
  set(currentMoveAtom, get(currentMoveAtom) - 2);
});

export const canRedoAtom = atom((get) => {
  const numMoves = get(historyAtom).length;
  const currentMove = get(currentMoveAtom);
  return currentMove + 2 <= numMoves;
});

export const redoAtom = atom(null, (get, set) => {
  set(currentMoveAtom, get(currentMoveAtom) + 2);
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
