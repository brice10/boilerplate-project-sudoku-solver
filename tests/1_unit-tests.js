const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const { invalidPuzzleStrings, validPuzzleStrings } = require('./data/tests-data.js');
let solver = new Solver();

suite('Unit Tests', () => {

    suite('Validate the given input string', function () {

        test('Validate method should correctly read valid puzzle input strings', function () {
            const puzzleStrings = validPuzzleStrings;
            const ok = puzzleStrings.every(str => (solver.validate(str).ok));
            const error = puzzleStrings.every(str => (solver.validate(str).error === null));
            assert.isTrue(ok, 'Validate function should return { ok: true, ... } when puzzle input string is valid');
            assert.isTrue(error, 'Validate function should return { error: null, ... } when puzzle input string is valid');
        });

        test('Validate method should correctly read invalid puzzle input strings', function () {
            const puzzleStrings = invalidPuzzleStrings;
            const test = puzzleStrings.every(str => (solver.validate(str).ok));
            assert.isFalse(test, 'Validate function should return { ok: false, ... } when puzzle input string is invalid');
        });

        test('Validate method should return an error when puzzle input string length is greater than 81', function () {
            const invalidPuzzleString = '1.5.2.8/44..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            const validationObj = solver.validate(invalidPuzzleString);
            assert.property(validationObj, 'ok', 'validation object should contain ok');
            assert.property(validationObj, 'error', 'validation object should contain error');
            assert.isFalse(validationObj.ok, 'Validate function should return { ok: false, ... }');
            assert.equal(validationObj.error, 'Expected puzzle to be 81 characters long');
        });

        test('Validate method should return an error when puzzle input string length is less than 81', function () {
            const invalidPuzzleString = '1.5.2.8/..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            const validationObj = solver.validate(invalidPuzzleString);
            assert.property(validationObj, 'ok', 'validation object should contain ok');
            assert.property(validationObj, 'error', 'validation object should contain error');
            assert.isFalse(validationObj.ok, 'Validate function should return { ok: false, ... }');
            assert.equal(validationObj.error, 'Expected puzzle to be 81 characters long');
        });

        test('Validate method should return an error when puzzle input string contains invalid caracters', function () {
            const invalidPuzzleString = '1.5.2.84%..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            const validationObj = solver.validate(invalidPuzzleString);
            assert.property(validationObj, 'ok', 'validation object should contain ok');
            assert.property(validationObj, 'error', 'validation object should contain error');
            assert.isFalse(validationObj.ok, 'Validate function should return { ok: false, ... }');
            assert.equal(validationObj.error, 'Invalid characters in puzzle');
        });

        test('Validate method should return an error when puzzle input string is not provided', function () {
            const invalidPuzzleStrings = ['', null, undefined];
            const ok = invalidPuzzleStrings.every(str => (solver.validate(str).ok));
            const error = invalidPuzzleStrings.every(str => (solver.validate(str).error === 'Required field missing'));
            assert.isFalse(ok, 'Validate function should return { ok: false, ... } when puzzle input string is not provided');
            assert.isTrue(error, "Validate function should return { error: 'Required field missing', ... } when puzzle input string is not provided");
        });

    });

});
