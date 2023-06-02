import {
  atom,
  selector,
  selectorFamily,
  useRecoilTransaction_UNSTABLE as useRecoilTransaction,
} from "recoil";
import {
  BoardState,
  computeNextMove,
  getGameState,
  INITIAL_BOARD,
  isDisabledSquare,
  O,
  SquareState,
  X,
} from "../tictactoe";

const boardState = atom({
  key: "board",
  default: INITIAL_BOARD,
});

export const squareState = selectorFamily<SquareState, number>({
  key: "squareState",
  get:
    (index) =>
    ({ get }) =>
      get(boardState)[index],
  set:
    (index) =>
    ({ get, set }, value) => {
      const isDisabled = get(isDisabledState(index));
      if (!isDisabled) {
        const board = get(boardState);
        const newBoard = [
          ...board.slice(0, index),
          value,
          ...board.slice(index + 1),
        ] as BoardState;
        set(boardState, newBoard);
      }
    },
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
    const board = get(boardState);
    const boardAfterXMove: BoardState = [
      ...board.slice(0, index),
      X,
      ...board.slice(index + 1),
    ];
    const nextIndex = computeNextMove(boardAfterXMove);
    const boardAfterOMove: BoardState = [
      ...boardAfterXMove.slice(0, nextIndex),
      O,
      ...boardAfterXMove.slice(nextIndex + 1),
    ];
    set(boardState, boardAfterOMove);
  });

export const gameStateState = selector({
  key: "gameState",
  get: ({ get }) => getGameState(get(boardState)),
});
