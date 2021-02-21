export type Board = Team[][];

export type Position = [number, number];

export const enum Team {
    Yellow,
    Red,
}

export const SIZE = 7;

export function generateBoard(): Team[][]  {
    const board = [];

    for (let row = 0; row < SIZE; row++) {
        board.push([]);

        for (let col = 0; col < SIZE; col++) {
            board[row].push(null);
        }
    }

    return board;
}

export function deepCopy(board: Board) {
    return JSON.parse(JSON.stringify(board));
}

export function isOnBoard(row: number, col: number): boolean {
    return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
}

export function areBoardsEqual(board1: Board, board2: Board) {
    return JSON.stringify(board1) === JSON.stringify(board2);
}

export function containsBoard(board: Board, boards: Board[]) {
    return boards.some(curr => areBoardsEqual(curr, board));
}

export function otherTeam(team: Team) {
    return team === Team.Red ? Team.Yellow : Team.Red;
}

