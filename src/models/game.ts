import { Board, isOnBoard, Position, SIZE, Team } from "../board"

export const enum ModelMessage {
    UpdateTile
}

// Number of tiles needed to be connected to win
const IN_ROW_WIN = 4;

export function placeAt(col: number, board: Board, team: Team) {
    const row = rowToPlaceAt(col, board);

    if (row < SIZE) {
        board[row][col] = team;
    }

    return board;
}

export function canPlaceAt(col: number, board: Board) {
    return rowToPlaceAt(col, board) !== -1
}

export function isWinningState(board: Board) {
    return detectWinner(board) !== null;
}

export function detectWinner(board: Board) {
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            const horizontalWin = detectWinnerAt([row, col], ([row, col]) => [row + 1, col], board);
            const verticalWin = detectWinnerAt([row, col], ([row, col]) => [row, col + 1], board);
            const diagonalDownWin = detectWinnerAt([row, col], ([row, col]) => [row + 1, col + 1], board);
            const diagonalUpWin = detectWinnerAt([row, col], ([row, col]) => [row - 1, col + 1], board);
            const winner = getWinner(horizontalWin, verticalWin, diagonalDownWin, diagonalUpWin);

            if (winner !== null) {
                return winner;
            }
        }
    }

    return null;
}

export function isDrawState(board: Board) {
    return board.every(row =>
        row.every(tile =>
            tile !== null
        )
    )
}

// Given a column, return the row that a tile should be placed at, taking into account the current tiles on the board
export function rowToPlaceAt(col: number, board: Board) {
    let row = -1;

    while (isTileBelowEmpty(row, col, board)) {
        row++;
    }

    return row;
}

function getWinner(horizontalWin: Team, verticalWin: Team, diagonalDownWin: Team, diagonalUpWin: Team) {
    return [horizontalWin, verticalWin, diagonalDownWin, diagonalUpWin].reduce((winner: Team, curr: Team) => {
        if (curr !== null) {
            return curr;
        } else if (winner !== null) {
            return winner;
        } else {
            return null;
        }
    });
}

function isTileBelowEmpty(row: number, col: number, board: Board) {
    return row < SIZE - 1 && board[row + 1][col] === null;
}

// Detect a winner from a specific position and at a specific orientation
function detectWinnerAt([row, col]: Position, nextPos: (prev: Position) => Position, board: Board) {
    for (let i = 0; i < IN_ROW_WIN - 1; i++) {
        const [nextRow, nextCol] = nextPos([row, col]);

        if (!isOnBoard(nextRow, nextCol) || board[row][col] !== board[nextRow][nextCol]) {
            return null;
        }

        row = nextRow;
        col = nextCol;
    }

    return board[row][col];
}








