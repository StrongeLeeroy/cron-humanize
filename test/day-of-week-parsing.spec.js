"use strict";
var expect = require('chai').expect;
var testCases = require('./testCases.json');
var UnitDefinition = require('../dist/cron-humanize').UnitDefinition;
var parser = require('../dist/cron-humanize').default;
const CONSTANTS = require('../dist/cron-humanize').CONSTANTS;

describe('getDayOfWeekName', function() {

    let days = [
        { shortname: 'MON', fullname: 'Monday',     index: 2 },
        { shortname: 'TUE', fullname: 'Tuesday',    index: 3 },
        { shortname: 'WED', fullname: 'Wednesday',  index: 4 },
        { shortname: 'THU', fullname: 'Thursday',   index: 5 },
        { shortname: 'FRI', fullname: 'Friday',     index: 6 },
        { shortname: 'SAT', fullname: 'Saturday',   index: 7 },
        { shortname: 'SUN', fullname: 'Sunday',     index: 1 }
    ];

    it ('should return the day name when a day index is supplied', function() {
        days.forEach(function(day) {
            expect(parser.getDayOfWeekName(day.index)).to.be.a('string');
            expect(parser.getDayOfWeekName(day.index)).to.equal(day.fullname);
        });
    });
});

describe('getDayOfWeekString', function() {
    it('should return a valid string for a the wildcard (*) character', function () {
        let testCase = new UnitDefinition('*', CONSTANTS.SHORT_DAYS, 1);
        expect(parser.getDayOfWeekString(testCase)).to.be.a('string');
        expect(parser.getDayOfWeekString(testCase)).to.equal('every day');
    });

    it('should return a valid string when a single day is supplied', function () {
        let testCase = new UnitDefinition('WED', 1, 7, CONSTANTS.SHORT_DAYS, 1);
        expect(parser.getDayOfWeekString(testCase)).to.be.a('string');
        expect(parser.getDayOfWeekString(testCase)).to.equal('only on Wednesdays');

        testCase = new UnitDefinition('3', 1, 7, CONSTANTS.SHORT_DAYS, 1);
        expect(parser.getDayOfWeekString(testCase)).to.be.a('string');
        expect(parser.getDayOfWeekString(testCase)).to.equal('only on Tuesdays');
    });

    it('should return a valid string when multiple days are supplied', function () {
        let testCase = new UnitDefinition('MON,TUE,FRI', 1, 7, CONSTANTS.SHORT_DAYS, 1);
        expect(parser.getDayOfWeekString(testCase)).to.be.a('string');
        expect(parser.getDayOfWeekString(testCase)).to.equal('only on Monday, Tuesday and Friday');

        testCase = new UnitDefinition('1,2,5', 1, 7, CONSTANTS.SHORT_DAYS, 1);
        expect(parser.getDayOfWeekString(testCase)).to.be.a('string');
        expect(parser.getDayOfWeekString(testCase)).to.equal('only on Sunday, Monday and Thursday');
    });

    it('should return a valid string when a day range is supplied', function () {
        let testCase = new UnitDefinition('TUE-SAT', 1, 7, CONSTANTS.SHORT_DAYS, 1);
        expect(parser.getDayOfWeekString(testCase)).to.be.a('string');
        expect(parser.getDayOfWeekString(testCase)).to.equal('only from Tuesday through Saturday');

        testCase = new UnitDefinition('2-6', 1, 7, CONSTANTS.SHORT_DAYS, 1);
        expect(parser.getDayOfWeekString(testCase)).to.be.a('string');
        expect(parser.getDayOfWeekString(testCase)).to.equal('only from Monday through Friday');
    });

    it('should return a valid string when an increment is supplied', function() {
        let testCase = new UnitDefinition('1/4', 1, 7, CONSTANTS.SHORT_DAYS, 1);
        expect(parser.getDayOfWeekString(testCase)).to.be.a('string');
        expect(parser.getDayOfWeekString(testCase)).to.equal('every 4 days starting on Sunday');

        testCase = new UnitDefinition('3/1', 1, 7, CONSTANTS.SHORT_DAYS, 1);
        expect(parser.getDayOfWeekString(testCase)).to.be.a('string');
        expect(parser.getDayOfWeekString(testCase)).to.equal('every day starting on Tuesday');

        testCase = new UnitDefinition('5/5', 1, 7, CONSTANTS.SHORT_DAYS, 1);
        expect(parser.getDayOfWeekString(testCase)).to.be.a('string');
        expect(parser.getDayOfWeekString(testCase)).to.equal('every 5 days starting on Thursday');
    });
});