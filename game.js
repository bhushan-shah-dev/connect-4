console.log("Welcome to CONNECT-4!");

const NUM_ROWS = 6;
const NUM_COLUMNS = 7;

const gameState = {
    _currentPlayer: null,
    get currentPlayer() {
        return this._currentPlayer;
    },
    set currentPlayer(currentPlayer) {
        this._currentPlayer = currentPlayer;
        const body = document.getElementsByTagName("body")[0];
        body.style.boxShadow =
            "inset 0 0 100px var(--player-" + currentPlayer + "-color)";
    },
    board: new Array(NUM_COLUMNS)
        .fill(null)
        .map(() => new Array(NUM_ROWS).fill(null)),
};

const boardEventTarget = new EventTarget();
boardEventTarget.addEventListener("fillSlot", function (event) {
    // Update gameState
    gameState.board[event.detail.column][event.detail.slotToFill] =
        event.detail.player;

    // Update DOM
    document.getElementById("board").children[event.detail.column].children[
        event.detail.slotToFill
    ].style.backgroundColor = "var(--player-" + event.detail.player + "-color)";
});

const slotController = new AbortController();

function showSplashScreen() {
    // Add a button to the body
    const body = document.getElementsByTagName("body")[0];
    const startButton = document.createElement("button");
    startButton.type = "button";
    startButton.id = "start-button";
    startButton.textContent = "Start game!";
    body.appendChild(startButton);

    // Add an event handler to the click event of the button
    startButton.addEventListener("click", function () {
        // Remove this button
        startButton.remove();

        // Show game board
        setupBoard();
    });
}

function setupBoard() {
    // Set the current player randomly (either 0 or 1)
    gameState.currentPlayer = Math.floor(Math.random() * 2) % 2;

    // Add board to body
    const body = document.getElementsByTagName("body")[0];
    const board = document.createElement("div");
    board.id = "board";

    // Add columns to board
    for (let i = 0; i < NUM_COLUMNS; i++) {
        const column = document.createElement("div");
        column.className = "column";

        // Add slots to column
        for (let j = 0; j < NUM_ROWS; j++) {
            const slot = document.createElement("div");
            slot.className = "slot";
            slot.addEventListener("click", () => dropDisc(i, j), {
                signal: slotController.signal,
            });
            column.appendChild(slot);
        }
        board.appendChild(column);
    }

    body.appendChild(board);
}

function dropDisc(column, row) {
    // Get bottom-most free slot in this column
    const slotToFill = gameState.board[column].indexOf(null);

    // If none available, do nothing
    if (slotToFill === -1) return;

    // Fill slot with current player disc
    boardEventTarget.dispatchEvent(
        new CustomEvent("fillSlot", {
            detail: {
                column,
                slotClicked: row,
                slotToFill,
                player: gameState.currentPlayer,
            },
        })
    );

    // Check winning condition
    const winner = checkWinner(column, slotToFill);
    if (winner !== null) {
        displayWinner(winner);
        return;
    }

    // Toggle current player
    gameState.currentPlayer = 1 - gameState.currentPlayer;
}

function checkWinner(column, row) {
    const currentColumn = gameState.board[column];
    const currentRow = gameState.board.map((c) => c[row]);
    const currentDiagonal1 = gameState.board
        .map((c, i) => c[column + row - i])
        .filter((val) => typeof val !== "undefined");
    const currentDiagonal2 = gameState.board
        .map((c, i) => c[i + row - column])
        .filter((val) => typeof val !== "undefined");

    const lists = [currentColumn, currentRow, currentDiagonal1, currentDiagonal2];

    let longestStreakValue = null;

    outer: for (let i = 0; i < lists.length; i++) {
        let list = lists[i];
        let longestStreak = 0;
        let currentStreakValue = null;
        longestStreakValue = null;
        for (let j = 0; j < list.length; j++) {
            let val = list[j];
            if (val === null) {
                // Empty slot, reset current streak
                longestStreak = 0;
                currentStreakValue = null;
                continue;
            }
            if (val === currentStreakValue) {
                // Current streak increases
                longestStreak++;
            } else {
                // Current streak resets to 1
                longestStreak = 1;
                currentStreakValue = val;
            }
            if (longestStreak === 4) {
                longestStreakValue = currentStreakValue;
                break outer;
            }
        }
    }

    return longestStreakValue;
}

function displayWinner(winner) {
    // Add translucent overlay
    const body = document.getElementsByTagName("body")[0];
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    body.appendChild(overlay);

    // Add winner message at the top
    const winnerMessage = document.createElement('div');
    winnerMessage.id = 'winner-msg';
    winnerMessage.innerText = (winner ? "BLUE" : "RED") + " wins!";
    body.appendChild(winnerMessage);

    slotController.abort();
}

showSplashScreen();
