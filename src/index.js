import React from "react";
import ReactDOM from "react-dom";

import * as arrayUtils from "./utils/arrayUtils";

import "./index.scss";

const ROWS = 6;
const COLUMNS = 7;

const PLAYER_1 = "red";
const PLAYER_2 = "blue";

function Slot(props) {
    let colorClass = "", style = {};
    if (props.color) {
        colorClass = props.color;
    } else {
        style = {
            display: "none"
        };
    }
    const cssClass = "coin " + colorClass;
    return (
        <div className="slot" onClick={props.onClick}>
            <div className={cssClass} style={style} />
        </div>
    );
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = this._getInitialState();
    }

    _getInitialState() {
        return {
            slots: arrayUtils.createMultidimensionalArray(COLUMNS, ROWS),
            isPlayer1Next: true,
            gameOver: false,
            cheater: null
        };
    }

    handleClick(i) {
        if (this.state.gameOver) {
            return;
        }
        const currState = this.state;
        const slots = currState.slots.slice();
        const thisColumn = slots[i];
        if (thisColumn[ROWS - 1]) {
            return;
        }
        for (let j = 0; j < thisColumn.length; j++) {
            if (!thisColumn[j]) {
                thisColumn[j] = currState.isPlayer1Next
                    ? PLAYER_1
                    : PLAYER_2;
                break;
            }
        }
        slots[i] = thisColumn;
        currState.slots = slots;
        currState.isPlayer1Next = !currState.isPlayer1Next;
        const winner = calculateWinner(slots);
        const cheater = currState.cheater;
        if (winner) {
            currState.gameOver = true;
            if (cheater && winner !== cheater) {
                this.flipCoins();
            }
        }
        this.setState(currState);
    }

    resetBoard() {
        this.setState(this._getInitialState());
    }

    cheat() {
        if (this.state.cheater) {
            return;
        }
        const currState = this.state;
        currState.cheater = this.state.isPlayer1Next ? PLAYER_1 : PLAYER_2;
        console.log(currState.cheater);
        this.setState(currState);
    }

    flipCoins() {
        const slots = this.state.slots.slice();
        for (let i = 0; i < COLUMNS; i++) {
            for (let j = 0; j < ROWS; j++) {
                if (!slots[i][j]) {
                    continue;
                }
                slots[i][j] = slots[i][j] === PLAYER_1 ? PLAYER_2 : PLAYER_1;
            }
        }
        const currState = this.state;
        currState.slots = slots;
        this.setState(currState);
    }

    renderSlot(i, j) {
        return (
            <Slot
                color={this.state.slots[i][j]}
                column={i}
                row={j}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    renderColumn(i) {
        return (
            <div className="board-column">
                {this.renderSlot(i, 0)}
                {this.renderSlot(i, 1)}
                {this.renderSlot(i, 2)}
                {this.renderSlot(i, 3)}
                {this.renderSlot(i, 4)}
                {this.renderSlot(i, 5)}
            </div>
        );
    }

    render() {
        const winner = calculateWinner(this.state.slots);
        let status;
        let player;
        if (winner) {
            status = 'Winner: ';
            player = winner;
        } else {
            status = 'Next turn: ';
            player = this.state.isPlayer1Next ? PLAYER_1 : PLAYER_2;
        }
        const statusCssClass = "status " + player;
        return (
            <div>
                <div className={statusCssClass}>{status}{player.toUpperCase()}</div>
                <div className="board">
                    {this.renderColumn(0)}
                    {this.renderColumn(1)}
                    {this.renderColumn(2)}
                    {this.renderColumn(3)}
                    {this.renderColumn(4)}
                    {this.renderColumn(5)}
                    {this.renderColumn(6)}
                </div>
                <button className="reset" onClick={() => this.resetBoard()}>
                    Reset!
                </button>
                <div className="cheat-box" onMouseEnter={() => this.cheat()} />
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <Board />
            </div>
        );
    }
}

ReactDOM.render(<Game />, document.getElementById("root"));

// ===========================================================

function calculateWinner(slots) {
    let i; // Loop counters
    // Check 4-in-a-row in all columns
    for (i = 0; i < COLUMNS; i++) {
        const thisColumn = slots[i];
        const longestStreak = arrayUtils.findLongestStreak(thisColumn);
        if (longestStreak.length >= 4) {
            console.log('Winner: column ' + i);
            return longestStreak.value;
        }
    }
    // Check 4-in-a-row in all rows
    const rotatedSlots = arrayUtils.rotate(slots);
    for (i = 0; i < ROWS; i++) {
        const thisRow = rotatedSlots[i];
        const longestStreak = arrayUtils.findLongestStreak(thisRow);
        if (longestStreak.length >= 4) {
            console.log('Winner: row ' + i);
            return longestStreak.value;
        }
    }
    // Check 4-in-a-row in all left diagonals
    const leftDiagonals = arrayUtils.getLeftDiagonals(slots);
    for (i = 0; i < leftDiagonals.length; i++) {
        const thisDiagonal = leftDiagonals[i];
        const longestStreak = arrayUtils.findLongestStreak(thisDiagonal);
        if (longestStreak.length >= 4) {
            console.log('Winner: left diagonal ' + i);
            return longestStreak.value;
        }
    }
    // Check 4-in-a-row in all right diagonals
    const rightDiagonals = arrayUtils.getLeftDiagonals(rotatedSlots);
    for (i = 0; i < rightDiagonals.length; i++) {
        const thisDiagonal = rightDiagonals[i];
        const longestStreak = arrayUtils.findLongestStreak(thisDiagonal);
        if (longestStreak.length >= 4) {
            console.log('Winner: right diagonal ' + i);
            return longestStreak.value;
        }
    }
}
