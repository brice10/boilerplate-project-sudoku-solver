const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const { invalidPuzzleStrings, validPuzzleStrings } = require('./data/tests-data.js');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');
let solver = new Solver();

suite('Unit Tests', () => {

    suite('Validate the given input string', function () {

        test('Logic handles a valid puzzle string of 81 characters', function () {
            const puzzleStrings = validPuzzleStrings;
            const ok = puzzleStrings.every(str => (solver.validate(str).ok));
            const error = puzzleStrings.every(str => (solver.validate(str).error === null));
            assert.isTrue(ok, 'Validate function should return { ok: true, ... } when puzzle input string is valid');
            assert.isTrue(error, 'Validate function should return { error: null, ... } when puzzle input string is valid');
        });

        test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function () {
            // When there are multiple invalid inputs
            const puzzleStrings = invalidPuzzleStrings;
            const test = puzzleStrings.every(str => (solver.validate(str).ok));
            assert.isFalse(test, 'Validate function should return { ok: false, ... } when puzzle input string is invalid');

            // When there is an invalid character in the puzzle input string
            const invalidPuzzleString = '1.5.2.84%..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            const validationObj = solver.validate(invalidPuzzleString);
            assert.property(validationObj, 'ok', 'validation object should contain ok');
            assert.property(validationObj, 'error', 'validation object should contain error');
            assert.isFalse(validationObj.ok, 'Validate function should return { ok: false, ... }');
            assert.equal(validationObj.error, 'Invalid characters in puzzle');
        });

        test('Logic handles a puzzle string that is not 81 characters in length', function () {
            // When puzzle input string length is greater than 81
            let invalidPuzzleString = '1.5.2.8/44..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            let validationObj = solver.validate(invalidPuzzleString);
            assert.property(validationObj, 'ok', 'validation object should contain ok');
            assert.property(validationObj, 'error', 'validation object should contain error');
            assert.isFalse(validationObj.ok, 'Validate function should return { ok: false, ... }');
            assert.equal(validationObj.error, 'Expected puzzle to be 81 characters long');

            // When puzzle input string length is less than 81
            invalidPuzzleString = '1.5.2.8/..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            validationObj = solver.validate(invalidPuzzleString);
            assert.property(validationObj, 'ok', 'validation object should contain ok');
            assert.property(validationObj, 'error', 'validation object should contain error');
            assert.isFalse(validationObj.ok, 'Validate function should return { ok: false, ... }');
            assert.equal(validationObj.error, 'Expected puzzle to be 81 characters long');

            // When puzzle input string length is empty or not defined
            const invalidPuzzleStrings = ['', null, undefined];
            const ok = invalidPuzzleStrings.every(str => (solver.validate(str).ok));
            const error = invalidPuzzleStrings.every(str => (solver.validate(str).error === 'Required field missing'));
            assert.isFalse(ok, 'Validate function should return { ok: false, ... } when puzzle input string is not provided');
            assert.isTrue(error, "Validate function should return { error: 'Required field missing', ... } when puzzle input string is not provided");
        });

    });

    suite('Validate the row placement in the puzzle', function () {

        test('Logic handles a valid row placement', function () {
            const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            const valid = solver.checkRowPlacement(puzzleString,'A', 2, 3);
            assert.isTrue(valid, 'CheckRowPlacement method should return true');
        });

        test('Logic handles an invalid row placement', function () {
            const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            const valid = solver.checkRowPlacement(puzzleString, 'A', 2, 5);
            assert.isFalse(valid, 'CheckRowPlacement method should return false');
        });

    });

    suite('Validate the column placement in the puzzle', function () {

        test('Logic handles a valid column placement', function () {
            const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            const valid = solver.checkColPlacement(puzzleString, 'A', 2, 3);
            assert.isTrue(valid, 'CheckColPlacement method should return true');
        });

        test('Logic handles an invalid column placement', function () {
            const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            const valid = solver.checkColPlacement(puzzleString, 'A', 2, 2);
            assert.isFalse(valid, 'CheckColPlacement method should return false');
        });

    });

    suite('Validate the region (3x3 grid) placement in the puzzle', function () {

        test('Logic handles a valid region (3x3 grid) placement', function () {
            const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            const valid = solver.checkRegionPlacement(puzzleString, "A", 2 , 9);
            assert.isTrue(valid, 'CheckRegionPlacement method should return true');
        });

        test('Logic handles an invalid region (3x3 grid) placement', function () {
            const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            const valid = solver.checkRegionPlacement(puzzleString, "A", 2, 5);
            assert.isFalse(valid, 'CheckRegionPlacement method should return false');
        });

    });

    suite('Solve the puzzle', function () {

        test('Valid puzzle strings pass the solver', function () {
            const puzzleString = puzzlesAndSolutions[0][0];
            const solution = solver.solve(puzzleString);
            assert.equal(solution, puzzlesAndSolutions[0][1], 'The puzzle cant be solve and the solution should be return');
        });

        test('Invalid puzzle strings fail the solver', function () {
            const invalidPuzzleString = '1.4..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            const result = solver.solve(invalidPuzzleString);
            assert.isFalse(result, 'The puzzle cannot be solve with invalid puzzle string');
        });

        test('Solver returns the expected solution for an incomplete puzzle', function () {
            const puzzleString = puzzlesAndSolutions[1][0];
            const solution = solver.solve(puzzleString);
            assert.equal(solution, puzzlesAndSolutions[1][1], 'The puzzle cant be solve and the solution should be return');
        });

    })

});
