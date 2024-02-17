export const puzzleSettings = { X: 9, Y: 9, Region: 3, minValue: 1, maxValue: 9, minChar: 'A', maxChar: 'I' };

export const rowsLetterToNumber = (rowLetter) => {
    return rowLetter.charCodeAt(0) - 64;
};

export const rowsNumberToLetter = (rowNumber) => {
    return String.fromCharCode(65 + rowNumber - 1);
};

export const puzzleStringToGrid = (puzzleString) => {
    const matrix = [];

    let row = [];
    let col = 0;

    for (let i = 0; i < puzzleString.length; i++) {
        if (col === 0) {
            row = [];
        }

        const char = puzzleString.charAt(i);
        const value = char === '.' ? 0 : parseInt(char, 10);
        row.push(value);

        col++;

        if (col === puzzleSettings.Y) {
            matrix.push(row);
            col = 0;
        }
    }
    return matrix;
}

export const gridToPuzzleString = grid => {
    return grid.map(row => row.join('')).join('').replaceAll('0', '.');
}

export const getValidationPattern = () => {
    const validCharactersPattern = `^[${puzzleSettings.minValue}-${puzzleSettings.maxValue}.]+$`;
    return new RegExp(validCharactersPattern);
}

export const isCharacterInRange = (char) => {
    const pattern = `^[${puzzleSettings.minChar}-${puzzleSettings.maxChar}]$`;
    return new RegExp(pattern).test(char);
}

export const isNumberInRange = (number) => {
    const pattern = `^[${puzzleSettings.minValue}-${puzzleSettings.maxValue}]$`;
    return new RegExp(pattern).test(number);
}

export const checkSinglePlacement = (puzzleString, row, column, value) => {
    const grid = puzzleStringToGrid(puzzleString);
    const rowIndex = rowsLetterToNumber(row) - 1;
    const colIndex = parseInt(column, 10) - 1;
    value = parseInt(value, 10);

    if (grid[rowIndex][colIndex] === value) {
        grid[rowIndex][colIndex] = 0;
    }

    return gridToPuzzleString(grid);
  }