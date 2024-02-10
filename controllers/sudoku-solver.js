class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return {
        ok: false,
        error: 'Expected puzzle to be 81 characters long'
      };
    }

    const validCharacters = /^[1-9.]+$/;
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

  }

  checkColPlacement(puzzleString, row, column, value) {

  }

  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solve(puzzleString) {

  }
}

module.exports = SudokuSolver;

