'use strict';

const { puzzleSettings, puzzleStringToGrid, gridToPuzzleString, rowsLetterToNumber, rowsNumberToLetter, getValidationPattern } = require("../utils/sudoku-solver-utils");

class SudokuSolver {

  validate(puzzleString) {
    if (!puzzleString) {
      return {
        ok: false,
        error: 'Required field missing'
      };
    }

    if (puzzleString.length !== 81) {
      return {
        ok: false,
        error: 'Expected puzzle to be 81 characters long'
      };
    }

    const validCharacters = getValidationPattern();
    if (!validCharacters.test(puzzleString)) {
      return {
        ok: false,
        error: 'Invalid characters in puzzle'
      };
    }

    return {
      ok: true,
      error: null
    };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const validation = this.validate(puzzleString);
    if (!validation.ok)
      return validation.error;

    const grid = puzzleStringToGrid(puzzleString);
    const rowIndex = rowsLetterToNumber(row) - 1;
    const colIndex = parseInt(column, 10) - 1;
    value = parseInt(value, 10);

    if (grid[rowIndex][colIndex] !== 0)
      return false;

    for (let index = 0; index < puzzleSettings.X; index++)
      if (grid[rowIndex][index] === value)
        return false

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const validation = this.validate(puzzleString);
    if (!validation.ok)
      return validation.error;

    const grid = puzzleStringToGrid(puzzleString);
    const rowIndex = rowsLetterToNumber(row) - 1;
    const colIndex = parseInt(column) - 1;
    value = parseInt(value, 10);

    if (grid[rowIndex][colIndex] !== 0)
      return false;

    for (let index = 0; index < puzzleSettings.Y; index++)
      if (grid[index][colIndex] === value)
        return false

    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const validation = this.validate(puzzleString);
    if (!validation.ok)
      return validation.error;

    const grid = puzzleStringToGrid(puzzleString);
    const rowIndex = rowsLetterToNumber(row) - 1;
    const colIndex = parseInt(column) - 1;
    value = parseInt(value, 10);

    if (grid[rowIndex][colIndex] !== 0)
      return false;

    const startRow = rowIndex - (rowIndex % puzzleSettings.Region);
    const startCol = colIndex - (colIndex % puzzleSettings.Region);
    for (let i = 0; i < puzzleSettings.Region; i++)
      for (let j = 0; j < puzzleSettings.Region; j++)
        if (grid[i + startRow][j + startCol] === value)
          return false;

    return true
  }

  isValidPlacement(grid, row, col, num) {
    const puzzleString = gridToPuzzleString(grid);
    const rowLetter = rowsNumberToLetter(row + 1);
    const colNumber = col + 1;

    return (
      this.checkRowPlacement(puzzleString, rowLetter, colNumber, num) &&
      this.checkColPlacement(puzzleString, rowLetter, colNumber, num) &&
      this.checkRegionPlacement(puzzleString, rowLetter, colNumber, num)
    );
  };

  solve(puzzleString) {
    const grid = puzzleStringToGrid(puzzleString);
    const solved = this.solveSudoku(grid);
    return solved? grid.map(row => row.join('')).join(''): solved;
  }

  solveSudoku(grid) {
    for (let row = 0; row < puzzleSettings.X; row++) {
      for (let col = 0; col < puzzleSettings.Y; col++) {
        if (grid[row][col] === 0) {
          for (let num = puzzleSettings.minValue; num <= puzzleSettings.maxValue; num++) {
            if (this.isValidPlacement(grid, row, col, num)) {
              grid[row][col] = num;
  
              if (this.solveSudoku(grid)) {
                return true;
              }
  
              grid[row][col] = 0; // Annuler la valeur si la solution n'est pas valide
            }
          }
          return false; // Aucun numéro n'est possible, revenir en arrière
        }
      }
    }
    return true; // Toutes les cases sont remplies, la grille est résolue
  };
}

module.exports = SudokuSolver;

