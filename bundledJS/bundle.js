(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otherTeam = exports.containsBoard = exports.areBoardsEqual = exports.isOnBoard = exports.deepCopy = exports.generateBoard = exports.SIZE = void 0;
exports.SIZE = 7;
function generateBoard() {
    var board = [];
    for (var row = 0; row < exports.SIZE; row++) {
        board.push([]);
        for (var col = 0; col < exports.SIZE; col++) {
            board[row].push(null);
        }
    }
    return board;
}
exports.generateBoard = generateBoard;
function deepCopy(board) {
    return JSON.parse(JSON.stringify(board));
}
exports.deepCopy = deepCopy;
function isOnBoard(row, col) {
    return row >= 0 && row < exports.SIZE && col >= 0 && col < exports.SIZE;
}
exports.isOnBoard = isOnBoard;
function areBoardsEqual(board1, board2) {
    return JSON.stringify(board1) === JSON.stringify(board2);
}
exports.areBoardsEqual = areBoardsEqual;
function containsBoard(board, boards) {
    return boards.some(function (curr) { return areBoardsEqual(curr, board); });
}
exports.containsBoard = containsBoard;
function otherTeam(team) {
    return team === 1 /* Red */ ? 0 /* Yellow */ : 1 /* Red */;
}
exports.otherTeam = otherTeam;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var board_1 = require("../board");
var game_1 = require("../models/game");
var view_1 = require("../views/view");
var viewMessageToAction = new Map([
    [0 /* MakeMove */, function (col) { return makeMove(col); }]
]);
var board = board_1.generateBoard();
var currentTeam = 1 /* Red */;
window.addEventListener("load", function () {
    view_1.initView(messageFromView);
});
// Callback that's passed into the view and is executed whenever the view sends a message to controller
function messageFromView(message, data) {
    var action = viewMessageToAction.get(message);
    if (action === undefined) {
        throw "Controller doesn't support message: " + message;
    }
    else {
        action(data);
    }
}
function makeMove(col) {
    if (game_1.canPlaceAt(col, board)) {
        var row = game_1.rowToPlaceAt(col, board);
        ;
        game_1.placeAt(col, board, currentTeam);
        view_1.updateAt(row, col, currentTeam);
        checkForWin();
        currentTeam = board_1.otherTeam(currentTeam);
    }
}
// If someone has won, end game and show winner on screen
function checkForWin() {
    if (game_1.isWinningState(board)) {
        var winner = game_1.detectWinner(board);
        view_1.displayGameOver(winner);
    }
    else if (game_1.isDrawState(board)) {
        view_1.displayGameOver(null);
    }
}

},{"../board":1,"../models/game":3,"../views/view":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rowToPlaceAt = exports.isDrawState = exports.detectWinner = exports.isWinningState = exports.canPlaceAt = exports.placeAt = void 0;
var board_1 = require("../board");
// Number of tiles needed to be connected to win
var IN_ROW_WIN = 4;
function placeAt(col, board, team) {
    var row = rowToPlaceAt(col, board);
    if (row < board_1.SIZE) {
        board[row][col] = team;
    }
    return board;
}
exports.placeAt = placeAt;
function canPlaceAt(col, board) {
    return rowToPlaceAt(col, board) !== -1;
}
exports.canPlaceAt = canPlaceAt;
function isWinningState(board) {
    return detectWinner(board) !== null;
}
exports.isWinningState = isWinningState;
function detectWinner(board) {
    for (var row = 0; row < board_1.SIZE; row++) {
        for (var col = 0; col < board_1.SIZE; col++) {
            var horizontalWin = detectWinnerAt([row, col], function (_a) {
                var row = _a[0], col = _a[1];
                return [row + 1, col];
            }, board);
            var verticalWin = detectWinnerAt([row, col], function (_a) {
                var row = _a[0], col = _a[1];
                return [row, col + 1];
            }, board);
            var diagonalDownWin = detectWinnerAt([row, col], function (_a) {
                var row = _a[0], col = _a[1];
                return [row + 1, col + 1];
            }, board);
            var diagonalUpWin = detectWinnerAt([row, col], function (_a) {
                var row = _a[0], col = _a[1];
                return [row - 1, col + 1];
            }, board);
            var winner = getWinner(horizontalWin, verticalWin, diagonalDownWin, diagonalUpWin);
            if (winner !== null) {
                return winner;
            }
        }
    }
    return null;
}
exports.detectWinner = detectWinner;
function isDrawState(board) {
    return board.every(function (row) {
        return row.every(function (tile) {
            return tile !== null;
        });
    });
}
exports.isDrawState = isDrawState;
// Given a column, return the row that a tile should be placed at, taking into account the current tiles on the board
function rowToPlaceAt(col, board) {
    var row = -1;
    while (isTileBelowEmpty(row, col, board)) {
        row++;
    }
    return row;
}
exports.rowToPlaceAt = rowToPlaceAt;
function getWinner(horizontalWin, verticalWin, diagonalDownWin, diagonalUpWin) {
    return [horizontalWin, verticalWin, diagonalDownWin, diagonalUpWin].reduce(function (winner, curr) {
        if (curr !== null) {
            return curr;
        }
        else if (winner !== null) {
            return winner;
        }
        else {
            return null;
        }
    });
}
function isTileBelowEmpty(row, col, board) {
    return row < board_1.SIZE - 1 && board[row + 1][col] === null;
}
// Detect a winner from a specific position and at a specific orientation
function detectWinnerAt(_a, nextPos, board) {
    var row = _a[0], col = _a[1];
    for (var i = 0; i < IN_ROW_WIN - 1; i++) {
        var _b = nextPos([row, col]), nextRow = _b[0], nextCol = _b[1];
        if (!board_1.isOnBoard(nextRow, nextCol) || board[row][col] !== board[nextRow][nextCol]) {
            return null;
        }
        row = nextRow;
        col = nextCol;
    }
    return board[row][col];
}

},{"../board":1}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAt = exports.displayGameOver = exports.initView = void 0;
var board_1 = require("../board");
var tileToColor = new Map([
    [1 /* Red */, "red"],
    [0 /* Yellow */, "yellow"]
]);
var teamToText = new Map([
    [1 /* Red */, "Red"],
    [0 /* Yellow */, "Yellow"]
]);
var notifyController;
function initView(notif) {
    notifyController = notif;
    initBoard();
    initTileClickListeners();
}
exports.initView = initView;
function displayGameOver(winningTeam) {
    showGameOverMessage(winningTeam);
    disableBoardClicks();
    blurBoard();
}
exports.displayGameOver = displayGameOver;
function updateAt(row, col, team) {
    var tileDOM = tileAt(row, col);
    var tileColor = tileToColor.get(team);
    if (tileColor !== undefined) {
        tileDOM.style.backgroundColor = tileColor;
    }
    else {
        throw "Team " + team + " isn't supported by the view";
    }
}
exports.updateAt = updateAt;
function showGameOverMessage(winningTeam) {
    var gameOverDOM = document.querySelector("#game-over");
    if (winningTeam !== null) {
        gameOverDOM.textContent = "Game over, " + teamToText.get(winningTeam) + " wins";
    }
    else {
        gameOverDOM.textContent = "Game has ended in a draw!";
    }
    gameOverDOM.style.visibility = "visible";
}
function blurBoard() {
    var boardDOM = document.querySelector("#board");
    boardDOM.style.opacity = "0.2";
}
function disableBoardClicks() {
    for (var row = 0; row < board_1.SIZE; row++) {
        for (var col = 0; col < board_1.SIZE; col++) {
            tileAt(row, col).style.pointerEvents = "none";
        }
    }
}
function initTileClickListeners() {
    for (var row = 0; row < board_1.SIZE; row++) {
        var _loop_1 = function (col) {
            tileAt(row, col).addEventListener("click", function () {
                notifyController(0 /* MakeMove */, col);
            });
        };
        for (var col = 0; col < board_1.SIZE; col++) {
            _loop_1(col);
        }
    }
}
function tileAt(row, col) {
    var elem = document.querySelector("#r" + row + "c" + col);
    if (elem !== null) {
        return elem;
    }
    else {
        throw "element not found at row: " + row + ", col: " + col;
    }
}
function initBoard() {
    var board = document.querySelector("#board");
    for (var col = 0; col < board_1.SIZE; col++) {
        board.append(createCol(col));
    }
}
function createCol(col) {
    var newCol = document.createElement("div");
    newCol.className = "col";
    for (var row = 0; row < board_1.SIZE; row++) {
        newCol.append(createTile(row, col));
    }
    return newCol;
}
function createTile(row, col) {
    var newTile = document.createElement("div");
    newTile.className = "circle";
    newTile.id = "r" + row + "c" + col;
    return newTile;
}

},{"../board":1}]},{},[2,3,4,1]);
