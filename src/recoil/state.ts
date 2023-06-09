import {
  atom,
  selector,
  selectorFamily,
  useRecoilCallback,
  useRecoilTransaction_UNSTABLE as useRecoilTransaction,
} from "recoil";
import {
  computeNextMove,
  GameHistory,
  getBoardFromHistory,
  getGameState,
  isDisabledSquare,
  SquareState,
} from "../tictactoe";

export const historyState = atom<GameHistory>({
  key: "history",
  default: [],
});

export const currentMoveState = atom<number>({
  key: "currentMove",
  default: 0,
});

const boardState = selector({
  key: "board",
  get: ({ get }) =>
    getBoardFromHistory({
      history: get(historyState),
      currentMove: get(currentMoveState),
    }),
});

export const squareState = selectorFamily<SquareState, number>({
  key: "squareState",
  get:
    (index) =>
    ({ get }) =>
      get(boardState)[index],
});

export const isDisabledState = selectorFamily<boolean, number>({
  key: "isDisabled",
  get:
    (index) =>
    ({ get }) =>
      isDisabledSquare(get(boardState), index),
});

// export const moveState = selector<any>({
//   key: "move",
//   get: () => 0,
//   set: ({ get, set }, index: number) => {
//     set(squareState(index), X);
//
//     // does not see update:
//     const board = get(boardState);
//     const nextIndex = computeNextMove(board);
//     set(squareState(nextIndex), O);
//   },
// });

// export const useMove = (index: number) =>
//   useRecoilCallback(({ snapshot, set }) => async () => {
//     set(squareState(index), X);
//
//     // does not see update:
//     const board = await snapshot.getPromise(boardState);
//     const nextIndex = computeNextMove(board);
//     set(squareState(nextIndex), O);
//   });

// export const useMove = (index: number) =>
//   useRecoilTransaction(({ get, set }) => () => {
//
//     // throws https://cdn.zappy.app/5cb3d88d301ca783b6a7dc1ddda4fd64.png - can't call writeable selectors in transactions
//     set(squareState(index), X);
//     const board = get(boardState);
//     const nextIndex = computeNextMove(board);
//     set(squareState(nextIndex), O);
//   });

export const useMove = (index: number) =>
  useRecoilTransaction(({ get, set }) => () => {
    // get history with future (redo) history sliced off
    const currentMove = get(currentMoveState);
    const history = get(historyState);
    const historyWithNoFutureHistory = [...history.slice(0, currentMove)];

    // make X move
    const historyAfterXMove = [...historyWithNoFutureHistory, index];

    // make computer move
    const nextIndex = computeNextMove(
      getBoardFromHistory({
        history: historyAfterXMove,
        currentMove: currentMove + 1,
      })
    );
    const historyAfterOMove = [...historyAfterXMove, nextIndex];

    // set new history, current move states
    set(historyState, historyAfterOMove);
    set(currentMoveState, currentMove + 2);
  });

export const gameStateState = selector({
  key: "gameState",
  get: ({ get }) => getGameState(get(boardState)),
});

export const canUndoState = selector({
  key: "canUndo",
  get: ({ get }) => {
    console.log("currentMoveState", get(currentMoveState));
    return get(currentMoveState) > 0;
  },
});

export const useUndo = () =>
  useRecoilCallback(({ set }) => () => {
    set(currentMoveState, (currentMove) => currentMove - 2);
  });

export const canRedoState = selector({
  key: "canRedo",
  get: ({ get }) => {
    const numMoves = get(historyState).length;
    const currentMove = get(currentMoveState);
    return currentMove + 2 <= numMoves;
  },
});

export const useRedo = () =>
  useRecoilCallback(({ set }) => () => {
    set(currentMoveState, (currentMove) => currentMove + 2);
  });

export const canResetState = selector({
  key: "canReset",
  get: ({ get }) =>
    get(historyState).length !== 0 || get(currentMoveState) !== 0,
});

export const useResetGame = () =>
  useRecoilTransaction(({ set }) => () => {
    set(historyState, []);
    set(currentMoveState, 0);
  });
