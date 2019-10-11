import * as array2d from "array2d";

export function createMultidimensionalArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createMultidimensionalArray.apply(this, args);
    }

    return arr;
}

export function findLongestStreak(arr) {
    if (!Array.isArray(arr) || !arr.length) {
        throw new Error(arr + ' must be an array with at least one item');
    }
    let prevValue;
    let currStreakLength = 0;
    let maxStreakLength = 0;
    let maxStreakValue;
    for (let i = 0; i < arr.length; i++) {
        if (!arr[i]) {
            currStreakLength = 0;
            continue;
        }
        if (arr[i] === prevValue) {
            currStreakLength += 1;
        } else {
            currStreakLength = 1;
        }
        if (maxStreakLength < currStreakLength) {
            maxStreakLength = currStreakLength;
            maxStreakValue = arr[i];
        }
        prevValue = arr[i];
    }
    return {
        length: maxStreakLength,
        value: maxStreakValue
    };
}

export function rotate(arr) {
    if (!Array.isArray(arr) || !arr.length || !Array.isArray(arr[0]) || !arr[0].length) {
        throw new Error(arr + ' must be a 2D array');
    }
    return array2d.lrotate(arr);
}

export function getLeftDiagonals(arr) {
    if (!Array.isArray(arr) || !arr.length || !Array.isArray(arr[0]) || !arr[0].length) {
        throw new Error(arr + ' must be a 2D array');
    }
    const rows = arr.length;
    const cols = arr[0].length;
    const diagonals = [];
    for (let i = 0; i < rows + cols - 2; i++) {
        const currDiagonal = [];
        for (let j = 0; j < rows; j++) {
            for (let k = 0; k < cols; k++) {
                if (j + k === i) {
                    currDiagonal.push(arr[j][k]);
                }
            }
        }
        diagonals.push(currDiagonal);
    }
    return diagonals;
}
