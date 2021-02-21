import { SIZE, Team } from "../board";

export const enum ViewMessage {
    MakeMove
}

const tileToColor = new Map([
    [Team.Red, "red"],
    [Team.Yellow, "yellow"]
]);

const teamToText = new Map([
    [Team.Red, "Red"],
    [Team.Yellow, "Yellow"]
]);

let notifyController: (message: ViewMessage, data: unknown) => void;

export function initView(notif: (message: ViewMessage, data: unknown) => void) {
    notifyController = notif;

    initBoard();
    initTileClickListeners();
}

export function displayGameOver(winningTeam: Team) {
    showGameOverMessage(winningTeam);
    disableBoardClicks();
    blurBoard();
}

export function updateAt(row: number, col: number, team: Team) {
    const tileDOM = tileAt(row, col);
    const tileColor = tileToColor.get(team);

    if (tileColor !== undefined) {
        tileDOM.style.backgroundColor = tileColor;
    } else {
        throw `Team ${team} isn't supported by the view`;
    }
}

function showGameOverMessage(winningTeam: Team) {
    const gameOverDOM = <HTMLHeadingElement> document.querySelector("#game-over");

    if (winningTeam !== null) {
        gameOverDOM.textContent = `Game over, ${teamToText.get(winningTeam)} wins`;
    } else {
        gameOverDOM.textContent = "Game has ended in a draw!";
    }

    gameOverDOM.style.visibility = "visible";
}

function blurBoard() {
    const boardDOM = <HTMLDivElement> document.querySelector("#board");

    boardDOM.style.opacity = "0.2";
}

function disableBoardClicks() {
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            tileAt(row, col).style.pointerEvents = "none";
        }
    }
}

function initTileClickListeners() {
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            tileAt(row, col).addEventListener("click", () => {
                notifyController(ViewMessage.MakeMove, col);
            });
        }
    }
}

function tileAt(row: number, col: number): HTMLDivElement {
    const elem = document.querySelector(`#r${row}c${col}`);

    if (elem !== null) {
        return <HTMLDivElement>elem;
    } else {
        throw `element not found at row: ${row}, col: ${col}`;
    }
}

function initBoard() {
    const board: HTMLDivElement = document.querySelector("#board");

    for (let col = 0; col < SIZE; col++) {
        board.append(createCol(col));
    }
}

function createCol(col: number) {
    const newCol = document.createElement("div");

    newCol.className = "col";

    for (let row = 0; row < SIZE; row++) {
        newCol.append(createTile(row, col));
    }

    return newCol;
}

function createTile(row: number, col: number) {
    const newTile = document.createElement("div");

    newTile.className = "circle";
    newTile.id = `r${row}c${col}`;

    return newTile;
}
