'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');
const { isCharacterInRange, isNumberInRange, puzzleStringToGrid, checkSinglePlacement } = require('../utils/sudoku-solver-utils.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { coordinate, puzzle, value } = req.body;
      if (coordinate && puzzle && value) {
        const validationResult = solver.validate(puzzle);
        if (validationResult.ok) {
          if (coordinate.length != 2 || !isCharacterInRange(coordinate.charAt(0)) || !isNumberInRange(coordinate.charAt(1))) {
            return res.json({ error: 'Invalid coordinate' });
          }
          if (!isNumberInRange(value)) {
            return res.json({ error: 'Invalid value' });
          }
          const conflict = [];
          const row = coordinate.charAt(0);
          const col = coordinate.charAt(1);
          let valid = true;
          checkSinglePlacement(puzzle, row, col, value);
          const rowPlacementChecked = solver.checkRowPlacement(puzzle, row, col, value);
          const colPlacementChecked = solver.checkColPlacement(puzzle, row, col, value);
          const regionPlacementChecked = solver.checkRegionPlacement(puzzle, row, col, value);
          if (!rowPlacementChecked || !colPlacementChecked || !regionPlacementChecked) {
            valid = false;
          }
          if (!rowPlacementChecked) {
            conflict.push('row');
          }
          if (!colPlacementChecked) {
            conflict.push('column');
          }
          if (!regionPlacementChecked) {
            conflict.push('region');
          }
          return res.json({ valid, conflict });
        }
        return res.json({ error: validationResult.error });
      }
      return res.json({ error: 'Required field(s) missing' });
    });

  app.route('/api/solve')
    .post((req, res) => {
      const puzzleString = req.body.puzzle;
      const validationResult = solver.validate(puzzleString);
      if (validationResult.ok) {
        const solution = solver.solve(puzzleString);
        if (solution && typeof solution === 'string') {
          return res.json({ solution: solution });
        }
        return res.json({ error: 'Puzzle cannot be solved' });
      }
      return res.json({ error: validationResult.error });
    });
};
