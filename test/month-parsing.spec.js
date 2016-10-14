"use strict";
var expect = require('chai').expect;
var testCases = require('./testCases.json');
var UnitDefinition = require('../dist/cron-parser').UnitDefinition;
var CronParser = require('../dist/cron-parser').CronParser;
const CONSTANTS = require('../dist/cron-parser').CONSTANTS;
let parser = new CronParser();

describe('getMonthName', function() {

    let months = [
        { shortname: 'JAN', fullname: 'January',    index: 0 },
        { shortname: 'FEB', fullname: 'February',   index: 1 },
        { shortname: 'MAR', fullname: 'March',      index: 2 },
        { shortname: 'APR', fullname: 'April',      index: 3 },
        { shortname: 'MAY', fullname: 'May',        index: 4 },
        { shortname: 'JUN', fullname: 'June',       index: 5 },
        { shortname: 'JUL', fullname: 'July',       index: 6 },
        { shortname: 'AUG', fullname: 'August',     index: 7 },
        { shortname: 'SEP', fullname: 'September',  index: 8 },
        { shortname: 'OCT', fullname: 'October',    index: 9 },
        { shortname: 'NOV', fullname: 'November',   index: 10 },
        { shortname: 'DEC', fullname: 'December',   index: 11 }
    ];

    it ('should return the month name when a month index is supplied', function() {
        months.forEach(function(month) {
            expect(parser.getMonthName(month.index)).to.be.a('string');
            expect(parser.getMonthName(month.index)).to.equal(month.fullname);
        });
    });
});

describe('getMonthString', function() {
    it('should return a valid string for a the wildcard (*) character', function () {
        let testCase = new UnitDefinition('*', CONSTANTS.SHORT_MONTHS, 0);
        expect(parser.getMonthString(testCase)).to.be.a('string');
        expect(parser.getMonthString(testCase)).to.equal('every month');
    });

    it('should return a valid string when a single month is supplied', function () {
        let testCase = new UnitDefinition('JAN', CONSTANTS.SHORT_MONTHS, 0);
        expect(parser.getMonthString(testCase)).to.be.a('string');
        expect(parser.getMonthString(testCase)).to.equal('in the month of January');

        testCase = new UnitDefinition('0', CONSTANTS.SHORT_MONTHS, 0);
        expect(parser.getMonthString(testCase)).to.be.a('string');
        expect(parser.getMonthString(testCase)).to.equal('in the month of January');
    });

    it('should return a valid string when multiple months are supplied', function () {
        let testCase = new UnitDefinition('JAN,FEB,OCT', CONSTANTS.SHORT_MONTHS, 0);
        expect(parser.getMonthString(testCase)).to.be.a('string');
        expect(parser.getMonthString(testCase)).to.equal('in the months of January, February and October');

        testCase = new UnitDefinition('0,1,9', CONSTANTS.SHORT_MONTHS, 0);
        expect(parser.getMonthString(testCase)).to.be.a('string');
        expect(parser.getMonthString(testCase)).to.equal('in the months of January, February and October');

        testCase = new UnitDefinition('3,OCT,11', CONSTANTS.SHORT_MONTHS, 0);
        expect(parser.getMonthString(testCase)).to.be.a('string');
        expect(parser.getMonthString(testCase)).to.equal('in the months of April, October and December');
    });

    it('should return a valid string when a month range is supplied', function () {
        let testCase = new UnitDefinition('MAR-AUG', CONSTANTS.SHORT_MONTHS, 0);
        expect(parser.getMonthString(testCase)).to.be.a('string');
        expect(parser.getMonthString(testCase)).to.equal('in the months of March through August');

        testCase = new UnitDefinition('2-7', CONSTANTS.SHORT_MONTHS, 0);
        expect(parser.getMonthString(testCase)).to.be.a('string');
        expect(parser.getMonthString(testCase)).to.equal('in the months of March through August');
    });

    it('should return a valid string when an increment is supplied', function() {
        let testCase = new UnitDefinition('5/2', CONSTANTS.SHORT_MONTHS, 0);
        expect(parser.getMonthString(testCase)).to.be.a('string');
        expect(parser.getMonthString(testCase)).to.equal('every 2 months starting on June');

        testCase = new UnitDefinition('0/1', CONSTANTS.SHORT_MONTHS, 0);
        expect(parser.getMonthString(testCase)).to.be.a('string');
        expect(parser.getMonthString(testCase)).to.equal('every month starting on January');

        testCase = new UnitDefinition('9/5', CONSTANTS.SHORT_MONTHS, 0);
        expect(parser.getMonthString(testCase)).to.be.a('string');
        expect(parser.getMonthString(testCase)).to.equal('every 5 months starting on October');
    });
});