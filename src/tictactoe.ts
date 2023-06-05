// Tic Tac Toe constants, types, and pure utility functions

export const X = "X";
export const O = "O";
export const BLANK = " ";

export type SquareState = typeof X | typeof O | typeof BLANK;
export type GameHistory = number[];
export type BoardState = SquareState[];

export const getBoardFromHistory = (
  history: GameHistory,
  currentMove: number
) =>
  history.slice(0, currentMove).reduce<BoardState>((board, square, i) => {
    const player = i % 2 === 0 ? X : O;
    board[square] = player;
    return board;
  }, new Array(9).fill(BLANK));

// prettier-ignore
export const INITIAL_BOARD: BoardState = [
  " ", " ", " ",
  " ", " ", " ",
  " ", " ", " ",
];

const MAGIC_SQUARE = [8, 1, 6, 3, 5, 7, 4, 9, 2];

// prettier-ignore
const BOARD_LINES = [
  // rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  // columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  // diagonals
  [0, 4, 8],
  [2, 4, 6],
];

const sumLine = (board: BoardState, line: number[]) =>
  line.reduce((sum, index) => {
    const cell = board[index];
    const squareValue = MAGIC_SQUARE[index];
    if (cell === X) {
      return sum + squareValue;
    }
    if (cell === O) {
      return sum + squareValue * 2;
    }
    return sum;
  }, 0);

type GameState = "x-wins" | "o-wins" | "still-playing" | "tie";

export const getGameState = (board: BoardState): GameState => {
  const lineSums = BOARD_LINES.map((line) => sumLine(board, line));

  if (lineSums.includes(15)) {
    return "x-wins";
  }
  if (lineSums.includes(30)) {
    return "o-wins";
  }
  if (board.includes(BLANK)) {
    return "still-playing";
  }
  return "tie";
};

export const getGameStateLabel = (gameState: GameState) => {
  switch (gameState) {
    case "x-wins":
      return "X Wins!";
    case "o-wins":
      return "O Wins";
    case "still-playing":
      return "Still Playing…";
    case "tie":
      return "Tie";
  }
};

export const isDisabledSquare = (board: BoardState, index: number) =>
  board[index] !== BLANK || getGameState(board) !== "still-playing";

export const computeNextMove = (board: BoardState) => {
  const blankSquareIndexes = board
    .map((square, i) => (square === BLANK ? i : -1))
    .filter((i) => i >= 0);
  const move = Math.floor(Math.random() * blankSquareIndexes.length);
  return blankSquareIndexes[move];
};
