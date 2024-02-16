const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const { puzzlesAndSolutions } = require("../controllers/puzzle-strings");
const { puzzleSettings } = require("../utils/sudoku-solver-utils");
const { invalidPuzzleStrings } = require("./data/tests-data");

chai.use(chaiHttp);

suite('Functional Tests', function () {

    this.timeout(5000);

    suite('Solve Api', function () {

        test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/solve')
                .send({ puzzle: puzzlesAndSolutions[0][0] })
                .end(function (err, res) {
                    assert.equal(res.status, 200);

                    const resBody = res.body;

                    assert.isOk(resBody);
                    assert.property(resBody, 'solution');
                    assert.isString(resBody.solution);
                    assert.equal(resBody.solution.length, puzzleSettings.X * puzzleSettings.Y);
                    done();
                });
        });

        test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/solve')
                .send({})
                .end(function (err, res) {
                    assert.equal(res.status, 200);

                    const resBody = res.body;

                    assert.isOk(resBody);
                    assert.property(resBody, 'error');
                    assert.isString(resBody.error);
                    assert.equal(resBody.error, 'Required field missing');
                    done();
                });
        });

        test('Solve a puzzle with invalid characters: POST request to /api/solve', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/solve')
                .send({ puzzle: invalidPuzzleStrings[3] })
                .end(function (err, res) {
                    assert.equal(res.status, 200);

                    const resBody = res.body;

                    assert.isOk(resBody);
                    assert.property(resBody, 'error');
                    assert.isString(resBody.error);
                    assert.equal(resBody.error, 'Invalid characters in puzzle');
                    done();
                });
        });

        test('Solve a puzzle with incorrect length: POST request to /api/solve', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/solve')
                .send({ puzzle: invalidPuzzleStrings[0] })
                .end(function (err, res) {
                    assert.equal(res.status, 200);

                    const resBody = res.body;

                    assert.isOk(resBody);
                    assert.property(resBody, 'error');
                    assert.isString(resBody.error);
                    assert.equal(resBody.error, 'Expected puzzle to be 81 characters long');
                    done();
                });
        });

        test('Solve a puzzle that cannot be solved: POST request to /api/solve', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/solve')
                .send({ puzzle: '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' })
                .end(function (err, res) {
                    assert.equal(res.status, 200);

                    const resBody = res.body;

                    assert.isOk(resBody);
                    assert.property(resBody, 'error');
                    assert.isString(resBody.error);
                    assert.equal(resBody.error, 'Puzzle cannot be solved');
                    done();
                });
        });

    });

    suite('Check Api', function () {

        test('Check a puzzle placement with all fields: POST request to /api/check', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({ 
                    coordinate: "A1",
                    puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                    value : "7" 
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);

                    const resBody = res.body;

                    assert.isOk(resBody);
                    assert.property(resBody, 'valid');
                    assert.isTrue(resBody.valid);
                    done();
                });
        });

        test('Check a puzzle placement with single placement conflict: POST request to /api/check', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({ 
                    coordinate: "A4",
                    puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                    value : "1" 
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);

                    const resBody = res.body;

                    assert.isOk(resBody);
                    assert.property(resBody, 'valid');
                    assert.property(resBody, 'conflict');
                    assert.isFalse(resBody.valid);
                    assert.isArray(resBody.conflict);
                    assert.equal(resBody.conflict.length, 1);
                    assert.equal(resBody.conflict[0], 'row');
                    done();
                });
        });

        test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({ 
                    coordinate: "A1",
                    puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                    value : "1" 
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);

                    const resBody = res.body;

                    assert.isOk(resBody);
                    assert.property(resBody, 'valid');
                    assert.property(resBody, 'conflict');
                    assert.isFalse(resBody.valid);
                    assert.isArray(resBody.conflict);
                    assert.equal(resBody.conflict.length, 2);
                    assert.equal(resBody.conflict[0], 'row');
                    assert.equal(resBody.conflict[1], 'col');
                    done();
                });
        });

        test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({ 
                    coordinate: "A2",
                    puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                    value : "5" 
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);

                    const resBody = res.body;

                    assert.isOk(resBody);
                    assert.property(resBody, 'valid');
                    assert.property(resBody, 'conflict');
                    assert.isFalse(resBody.valid);
                    assert.isArray(resBody.conflict);
                    assert.equal(resBody.conflict.length, 3);
                    assert.equal(resBody.conflict[0], 'row');
                    assert.equal(resBody.conflict[1], 'col');
                    assert.equal(resBody.conflict[2], 'region');
                    done();
                });
        });

        test('Check a puzzle placement with missing required fields: POST request to /api/check', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({ 
                    coordinate: "A2",
                    puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);

                    const resBody = res.body;

                    assert.isOk(resBody);
                    assert.property(resBody, 'error');
                    assert.isString(resBody.error);
                    assert.equal(resBody.error, 'Required field(s) missing');
                    done();
                });
        });

        test('Check a puzzle placement with invalid characters: POST request to /api/check', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({ 
                    coordinate: "A2",
                    puzzle: "..9..5.1.85.4....2432......1...69.83.9.&...6.62.71...9......1945....4.37.4.3..6..",
                    value: '1'
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);

                    const resBody = res.body;

                    assert.isOk(resBody);
                    assert.property(resBody, 'error');
                    assert.isString(resBody.error);
                    assert.equal(resBody.error, 'Invalid characters in puzzle');
                    done();
                });
        });

        test('Check a puzzle placement with incorrect length: POST request to /api/check', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({ 
                    coordinate: "A2",
                    puzzle: "..9..5.1.85.4....2432......1...69.83.9.&...6.62.71...9......1945....4.37..3..6..",
                    value: '1'
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);

                    const resBody = res.body;

                    assert.isOk(resBody);
                    assert.property(resBody, 'error');
                    assert.isString(resBody.error);
                    assert.equal(resBody.error, 'Expected puzzle to be 81 characters long');
                    done();
                });
        });

        test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({ 
                    coordinate: "J10",
                    puzzle: "..9..5.1.85.4....2432......1...69.83.9.1...6.62.71...9......1945....4.37..3..6..3",
                    value: '1'
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);

                    const resBody = res.body;

                    assert.isOk(resBody);
                    assert.property(resBody, 'error');
                    assert.isString(resBody.error);
                    assert.equal(resBody.error, 'Invalid coordinate');
                    done();
                });
        });

        test('Check a puzzle placement with invalid placement value: POST request to /api/check', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({ 
                    coordinate: "A1",
                    puzzle: "..9..5.1.85.4....2432......1...69.83.9.1...6.62.71...9......1945....4.37..3..6..3",
                    value: '10'
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);

                    const resBody = res.body;

                    assert.isOk(resBody);
                    assert.property(resBody, 'error');
                    assert.isString(resBody.error);
                    assert.equal(resBody.error, 'Invalid value');
                    done();
                });
        });

    });

    

});

