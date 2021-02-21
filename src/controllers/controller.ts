import { generateBoard, otherTeam, Team } from "../board";
import { canPlaceAt, detectWinner, isDrawState, isWinningState, placeAt, rowToPlaceAt } from "../models/game";
import {  displayGameOver, initView, updateAt, ViewMessage } from "../views/view";

const viewMessageToAction = new Map<ViewMessage, (data: unknown) => void>([
    [ViewMessage.MakeMove, col => makeMove(<number>col)]
]);

const board = generateBoard();

let currentTeam = Team.Red;

window.addEventListener("load", () => {
    initView(messageFromView);
});

// Callback that's passed into the view and is executed whenever the view sends a message to controller
function messageFromView(message: ViewMessage, data: unknown) {
    const action = viewMessageToAction.get(message);

    if (action === undefined) {
        throw `Controller doesn't support message: ${message}`
    } else {
        action(data);
    }
}

function makeMove(col: number) {
    if (canPlaceAt(col, board)) {
        const row = rowToPlaceAt(col, board);;
        
        placeAt(col, board, currentTeam);
        updateAt(row, col, currentTeam);
        checkForWin();

        currentTeam = otherTeam(currentTeam);
    }
}

// If someone has won, end game and show winner on screen
function checkForWin() {
    if (isWinningState(board)) {
        const winner = detectWinner(board);

        displayGameOver(winner);
    } else if (isDrawState(board)) {
        displayGameOver(null);
    }
}
