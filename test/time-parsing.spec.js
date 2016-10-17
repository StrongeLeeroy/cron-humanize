"use strict";
var expect = require('chai').expect;
var testCases = require('./testCases.json');
var UnitDefinition = require('../dist/cron-humanize').UnitDefinition;
var parser = require('../dist/cron-humanize').default;

describe('getHoursString', function() {
    it('should return a valid string when a fixed hour is given', function() {
        var testCase =  new UnitDefinition('*');
        expect(parser.getHoursString(testCase)).to.be.a('string');
        expect(parser.getHoursString(testCase)).to.equal('every hour');

        testCase = new UnitDefinition('10');
        expect(parser.getHoursString(testCase)).to.be.a('string');
        expect(parser.getHoursString(testCase)).to.equal('at 10:00');

        testCase = new UnitDefinition('5');
        expect(parser.getHoursString(testCase)).to.be.a('string');
        expect(parser.getHoursString(testCase)).to.equal('at 05:00');

        testCase = new UnitDefinition('23');
        expect(parser.getHoursString(testCase)).to.be.a('string');
        expect(parser.getHoursString(testCase)).to.equal('at 23:00');

        testCase = new UnitDefinition('0');
        expect(parser.getHoursString(testCase)).to.be.a('string');
        expect(parser.getHoursString(testCase)).to.equal('at 00:00');
    });
    it('should return a valid string when a range is given', function() {
        let testCase = new UnitDefinition('10-14');
        expect(parser.getHoursString(testCase)).to.be.a('string');
        expect(parser.getHoursString(testCase)).to.equal('during every hour from 10:00 through 14:00');

        testCase = new UnitDefinition('5-9');
        expect(parser.getHoursString(testCase)).to.be.a('string');
        expect(parser.getHoursString(testCase)).to.equal('during every hour from 05:00 through 09:00');

        testCase = new UnitDefinition('23-0');
        expect(parser.getHoursString(testCase)).to.be.a('string');
        expect(parser.getHoursString(testCase)).to.equal('during every hour from 23:00 through 00:00');

        testCase = new UnitDefinition('1-2');
        expect(parser.getHoursString(testCase)).to.be.a('string');
        expect(parser.getHoursString(testCase)).to.equal('during every hour from 01:00 through 02:00');

        testCase = new UnitDefinition('0-2');
        expect(parser.getHoursString(testCase)).to.be.a('string');
        expect(parser.getHoursString(testCase)).to.equal('during every hour from 00:00 through 02:00');
    });
    it('should return a valid string when multiple hours are given', function() {
        let testCase = new UnitDefinition('10,11,14');
        expect(parser.getHoursString(testCase)).to.be.a('string');
        expect(parser.getHoursString(testCase)).to.equal('during the hours 10:00, 11:00 and 14:00');

        testCase = new UnitDefinition('5,9');
        expect(parser.getHoursString(testCase)).to.be.a('string');
        expect(parser.getHoursString(testCase)).to.equal('during the hours 05:00 and 09:00');

        testCase = new UnitDefinition('1,3,5,10,16');
        expect(parser.getHoursString(testCase)).to.be.a('string');
        expect(parser.getHoursString(testCase)).to.equal('during the hours 01:00, 03:00, 05:00, 10:00 and 16:00');

        testCase = new UnitDefinition('1,2');
        expect(parser.getHoursString(testCase)).to.be.a('string');
        expect(parser.getHoursString(testCase)).to.equal('during the hours 01:00 and 02:00');
    });
    it('should return a valid string when an increment is supplied', function() {
        let testCase = new UnitDefinition('1/5');
        expect(parser.getHoursString(testCase)).to.be.a('string');
        expect(parser.getHoursString(testCase)).to.equal('past every 5th hour starting at 01:00');

        testCase = new UnitDefinition('10/1');
        expect(parser.getHoursString(testCase)).to.be.a('string');
        expect(parser.getHoursString(testCase)).to.equal('past every hour starting at 10:00');

        testCase = new UnitDefinition('0/3');
        expect(parser.getHoursString(testCase)).to.be.a('string');
        expect(parser.getHoursString(testCase)).to.equal('past every 3rd hour starting at 00:00');
    });
    it('should throw an error when input data is invalid', function() {
        // expect(parser.getHoursString(new UnitDefinition('25'))).to.throwError();
        // expect(parser.getHoursString(new UnitDefinition('23,24,25,26'))).to.throwError();
        // expect(parser.getHoursString(new UnitDefinition('10-27'))).to.throwError();
        // expect(parser.getHoursString(new UnitDefinition('25/1'))).to.throwError();
    });
});

describe('getMinutesString', function() {
    it('should return a valid string when fixed minutes are given', function() {
        var testCase =  new UnitDefinition('*');
        expect(parser.getMinutesString(testCase)).to.be.a('string');
        expect(parser.getMinutesString(testCase)).to.equal('every minute');

        testCase = new UnitDefinition('10');
        expect(parser.getMinutesString(testCase)).to.be.a('string');
        expect(parser.getMinutesString(testCase)).to.equal('at minute 10');

        testCase = new UnitDefinition('5');
        expect(parser.getMinutesString(testCase)).to.be.a('string');
        expect(parser.getMinutesString(testCase)).to.equal('at minute 5');

        testCase = new UnitDefinition('23');
        expect(parser.getMinutesString(testCase)).to.be.a('string');
        expect(parser.getMinutesString(testCase)).to.equal('at minute 23');

        testCase = new UnitDefinition('0');
        expect(parser.getMinutesString(testCase)).to.be.a('string');
        expect(parser.getMinutesString(testCase)).to.equal('at minute 0');
    });
    it('should return a valid string when a range is given', function() {
        let testCase = new UnitDefinition('10-14');
        expect(parser.getMinutesString(testCase)).to.be.a('string');
        expect(parser.getMinutesString(testCase)).to.equal('every minute from 10 through 14');

        testCase = new UnitDefinition('5-9');
        expect(parser.getMinutesString(testCase)).to.be.a('string');
        expect(parser.getMinutesString(testCase)).to.equal('every minute from 5 through 9');

        testCase = new UnitDefinition('23-40');
        expect(parser.getMinutesString(testCase)).to.be.a('string');
        expect(parser.getMinutesString(testCase)).to.equal('every minute from 23 through 40');

        testCase = new UnitDefinition('1-2');
        expect(parser.getMinutesString(testCase)).to.be.a('string');
        expect(parser.getMinutesString(testCase)).to.equal('every minute from 1 through 2');

        testCase = new UnitDefinition('0-2');
        expect(parser.getMinutesString(testCase)).to.be.a('string');
        expect(parser.getMinutesString(testCase)).to.equal('every minute from 0 through 2');
    });
    it('should return a valid string when multiple minutes are given', function() {
        let testCase = new UnitDefinition('10,11,14');
        expect(parser.getMinutesString(testCase)).to.be.a('string');
        expect(parser.getMinutesString(testCase)).to.equal('at minutes 10, 11 and 14');

        testCase = new UnitDefinition('5,9');
        expect(parser.getMinutesString(testCase)).to.be.a('string');
        expect(parser.getMinutesString(testCase)).to.equal('at minutes 5 and 9');

        testCase = new UnitDefinition('1,3,5,10,16');
        expect(parser.getMinutesString(testCase)).to.be.a('string');
        expect(parser.getMinutesString(testCase)).to.equal('at minutes 1, 3, 5, 10 and 16');

        testCase = new UnitDefinition('1,2');
        expect(parser.getMinutesString(testCase)).to.be.a('string');
        expect(parser.getMinutesString(testCase)).to.equal('at minutes 1 and 2');
    });
    it('should return a valid string when an increment is supplied', function() {
        let testCase = new UnitDefinition('1/5');
        expect(parser.getMinutesString(testCase)).to.be.a('string');
        expect(parser.getMinutesString(testCase)).to.equal('every 5th minute starting at minute 1');

        testCase = new UnitDefinition('10/1');
        expect(parser.getMinutesString(testCase)).to.be.a('string');
        expect(parser.getMinutesString(testCase)).to.equal('every minute starting at minute 10');

        testCase = new UnitDefinition('0/3');
        expect(parser.getMinutesString(testCase)).to.be.a('string');
        expect(parser.getMinutesString(testCase)).to.equal('every 3rd minute');
    });
    it('should throw an error when input data is invalid', function() {});
});

describe('getSecondsString', function() {
    it('should return a valid string when fixed seconds is given', function() {});
    it('should return a valid string when a range is given', function() {});
    it('should return a valid string when multiple seconds are given', function() {});
    it('should return a valid string when an increment is supplied', function() {});
    it('should throw an error when input data is invalid', function() {});
});

describe('getTimeString', function() {
    it('should return a valid string when a fixed time is given', function() {
        let testSeconds = new UnitDefinition('10'),
            testMinutes = new UnitDefinition('30'),
            testHours = new UnitDefinition('14');
        expect(parser.getTimeString(testSeconds, testMinutes, testHours)).to.be.a('string');
        expect(parser.getTimeString(testSeconds, testMinutes, testHours)).to.equal('at 14:30:10');

        testSeconds = new UnitDefinition('59');
        testMinutes = new UnitDefinition('5');
        testHours = new UnitDefinition('23');
        expect(parser.getTimeString(testSeconds, testMinutes, testHours)).to.be.a('string');
        expect(parser.getTimeString(testSeconds, testMinutes, testHours)).to.equal('at 23:05:59');

        testSeconds = new UnitDefinition('11');
        testMinutes = new UnitDefinition('0');
        testHours = new UnitDefinition('2');
        expect(parser.getTimeString(testSeconds, testMinutes, testHours)).to.be.a('string');
        expect(parser.getTimeString(testSeconds, testMinutes, testHours)).to.equal('at 02:00:11');
    });

    it('should return a valid string when seconds are set to 0', function() {
        let testSeconds = new UnitDefinition('0'),
            testMinutes = new UnitDefinition('30'),
            testHours = new UnitDefinition('14');
        expect(parser.getTimeString(testSeconds, testMinutes, testHours)).to.be.a('string');
        expect(parser.getTimeString(testSeconds, testMinutes, testHours)).to.equal('at 14:30');

        testSeconds = new UnitDefinition('0');
        testMinutes = new UnitDefinition('5');
        testHours = new UnitDefinition('23');
        expect(parser.getTimeString(testSeconds, testMinutes, testHours)).to.be.a('string');
        expect(parser.getTimeString(testSeconds, testMinutes, testHours)).to.equal('at 23:05');

        testSeconds = new UnitDefinition('0');
        testMinutes = new UnitDefinition('11');
        testHours = new UnitDefinition('2');
        expect(parser.getTimeString(testSeconds, testMinutes, testHours)).to.be.a('string');
        expect(parser.getTimeString(testSeconds, testMinutes, testHours)).to.equal('at 02:11');
    });

    it('should throw a an error if any of the parameters is invalid', function() {
        // expect(parser.getTimeString('10', '10', '25')).to.throw(new Error('Invalid date parameters.'));
        // expect(parser.getTimeString('10', '67', '22')).to.throw(new Error('Invalid date parameters.'));
        // expect(parser.getTimeString('89', '10', '22')).to.throw(new Error('Invalid date parameters.'));
    });
});