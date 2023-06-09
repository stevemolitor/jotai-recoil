import { BLANK, getBoardFromHistory, O, X } from "./tictactoe";

it("should return initially empty board", () => {
  // prettier-ignore
  expect(getBoardFromHistory({history: [], currentMove: 0})).toEqual([
    BLANK, BLANK, BLANK,
    BLANK, BLANK, BLANK,
    BLANK, BLANK, BLANK,
  ]);
});

it("should return game history", () => {
  // prettier-ignore
  expect(getBoardFromHistory({history: [0, 1, 2], currentMove: 3})).toEqual([
    X, O, X,
    BLANK, BLANK, BLANK,
    BLANK, BLANK, BLANK,
  ]);
});

it("should truncate to current move", () => {
  // prettier-ignore
  expect(getBoardFromHistory({history: [0, 1, 2], currentMove: 1})).toEqual([
    X, BLANK, BLANK,
    BLANK, BLANK, BLANK,
    BLANK, BLANK, BLANK,
  ]);
});
