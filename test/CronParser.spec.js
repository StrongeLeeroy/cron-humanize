"use strict";
var expect = require('chai').expect;
var CronParser = require('../dist/cronParser').CronParser;
let parser = new CronParser();


describe('getTimeString', function() {
    it('should return a valid string when a fixed time is given', function() {
        expect(parser.getTimeString('10', '30', '14')).to.be.a('string');
        expect(parser.getTimeString('10', '30', '14')).to.equal('14:30:10');

        expect(parser.getTimeString('59', '5', '23')).to.be.a('string');
        expect(parser.getTimeString('59', '5', '23')).to.equal('23:05:59');

        expect(parser.getTimeString('11', '0', '2')).to.be.a('string');
        expect(parser.getTimeString('11', '0', '2')).to.equal('02:00:11');
    });

    it('should return a valid string when seconds are set to 0', function() {
        expect(parser.getTimeString('0', '30', '14')).to.be.a('string');
        expect(parser.getTimeString('0', '30', '14')).to.equal('14:30');

        expect(parser.getTimeString('0', '5', '23')).to.be.a('string');
        expect(parser.getTimeString('0', '5', '23')).to.equal('23:00');

        expect(parser.getTimeString('0', '11', '2')).to.be.a('string');
        expect(parser.getTimeString('0', '11', '2')).to.equal('2:11');
    });

    it('should throw a an error if any of the parameters is invalid', function() {
        expect(parser.getTimeString('10', '10', '25')).to.throw(new Error('Invalid date parameters.'));
        expect(parser.getTimeString('10', '67', '22')).to.throw(new Error('Invalid date parameters.'));
        expect(parser.getTimeString('89', '10', '22')).to.throw(new Error('Invalid date parameters.'));
    });
});

describe('getDayName', function() {

    let days = [
        { shortname: 'MON', fullname: 'Monday',     index: 1 },
        { shortname: 'TUE', fullname: 'Tuesday',    index: 2 },
        { shortname: 'WED', fullname: 'Wednesday',  index: 3 },
        { shortname: 'THU', fullname: 'Thursday',   index: 4 },
        { shortname: 'FRI', fullname: 'Friday',     index: 5 },
        { shortname: 'SAT', fullname: 'Saturday',   index: 6 },
        { shortname: 'SUN', fullname: 'Sunday',     index: 7 }
    ];

    it ('should return the day name when a day string is supplied', function() {
        days.forEach(function(day) {
            expect(parser.getDayName(day.shortname)).to.be.a('string');
            expect(parser.getDayName(day.shortname)).to.equal(day.fullname);
        });
    });

    it ('should return the day name when a day index is supplied', function() {
        days.forEach(function(day) {
            expect(parser.getDayName(day.index)).to.be.a('string');
            expect(parser.getDayName(day.index)).to.equal(day.fullname);
        });
    });
});


describe('getDayString', function() {
    it('should return a valid string for a the wildcard (*) character', function () {
        expect(parser.getDayString('*')).to.be.a('string');
        expect(parser.getDayString('*')).to.equal('every day');
    });

    it('should return a valid string when a single day is supplied', function () {
        expect(parser.getDayString('WED')).to.be.a('string');
        expect(parser.getDayString('WED')).to.equal('every Wednesday');

        expect(parser.getDayString('3')).to.be.a('string');
        expect(parser.getDayString('3')).to.equal('every Wednesday');
    });

    it('should return a valid string when multiple days are supplied', function () {
        expect(parser.getDayString('MON,TUE,FRI')).to.be.a('string');
        expect(parser.getDayString('MON,TUE,FRI')).to.equal('every Monday, Tuesday and Friday');

        expect(parser.getDayString('1,2,5')).to.be.a('string');
        expect(parser.getDayString('1,2,5')).to.equal('every Monday, Tuesday and Friday');
    });

    it('should return a valid string when a day range is supplied', function () {
        expect(parser.getDayString('TUE-SAT')).to.be.a('string');
        expect(parser.getDayString('TUE-SAT')).to.equal('every day from Tuesday to Saturday');

        expect(parser.getDayString('2-6')).to.be.a('string');
        expect(parser.getDayString('2-6')).to.equal('every day from Tuesday to Saturday');
    });

    it('should return a valid string when an increment is supplied', function() {
        expect(parser.getDayString('1/4')).to.be.a('string');
        expect(parser.getDayString('1/4')).to.equal('every 4 days starting on Monday');

        expect(parser.getDayString('3/1')).to.be.a('string');
        expect(parser.getDayString('3/1')).to.equal('every day starting on Wednesday');

        expect(parser.getDayString('5/5')).to.be.a('string');
        expect(parser.getDayString('5/5')).to.equal('every 5 days starting on Friday');
    });
});

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

    it ('should return the month name when a month string is supplied', function() {
       months.forEach(function(month) {
           expect(parser.getMonthName(month.shortname)).to.be.a('string');
           expect(parser.getMonthName(month.shortname)).to.equal(month.fullname);
       });
    });

    it ('should return the month name when a month index is supplied', function() {
        months.forEach(function(month) {
            expect(parser.getMonthName(month.index.toString())).to.be.a('string');
            expect(parser.getMonthName(month.index.toString())).to.equal(month.fullname);
        });
    });
});

describe('getMonthString', function() {
    it('should return a valid string for a the wildcard (*) character', function () {
        expect(parser.getMonthString('*')).to.be.a('string');
        expect(parser.getMonthString('*')).to.equal('every month');
    });

    it('should return a valid string when a single month is supplied', function () {
        expect(parser.getMonthString('JAN')).to.be.a('string');
        expect(parser.getMonthString('JAN')).to.equal('in the month of January');

        expect(parser.getMonthString('0')).to.be.a('string');
        expect(parser.getMonthString('0')).to.equal('in the month of January');
    });

    it('should return a valid string when multiple months are supplied', function () {
        expect(parser.getMonthString('JAN,FEB,OCT')).to.be.a('string');
        expect(parser.getMonthString('JAN,FEB,OCT')).to.equal('in the months of January, February and October');

        expect(parser.getMonthString('0,1,9')).to.be.a('string');
        expect(parser.getMonthString('0,1,9')).to.equal('in the months of January, February and October');
    });

    it('should return a valid string when a month range is supplied', function () {
        expect(parser.getMonthString('MAR-AUG')).to.be.a('string');
        expect(parser.getMonthString('MAR-AUG')).to.equal('in the months of March through August');

        expect(parser.getMonthString('2-7')).to.be.a('string');
        expect(parser.getMonthString('2-7')).to.equal('in the months of March through August');
    });

    it('should return a valid string when an increment is supplied', function() {
        expect(parser.getMonthString('5/2')).to.be.a('string');
        expect(parser.getMonthString('5/2')).to.equal('every 2 months starting on June');

        expect(parser.getMonthString('0/1')).to.be.a('string');
        expect(parser.getMonthString('0/1')).to.equal('every month starting on January');

        expect(parser.getMonthString('9/5')).to.be.a('string');
        expect(parser.getMonthString('9/5')).to.equal('every 5 months starting on October');
    });
});


describe('getYearString', function() {
    it('should return a valid string for a single year', function() {
        expect(parser.getYearString('2005')).to.be.a('string');
        expect(parser.getYearString('2005')).to.equal('during 2005');
    });

    it('should return a valid string for a year range', function() {
        expect(parser.getYearString('2005-2010')).to.be.a('string');
        expect(parser.getYearString('2005-2010')).to.equal('between 2005 and 2010');
    });

    it('should return a valid string for multiple years', function() {
        expect(parser.getYearString('2005,2006,2009,2010')).to.be.a('string');
        expect(parser.getYearString('2005,2006,2009,2010')).to.equal('during 2005, 2006, 2009 and 2010');
    });

    it('should return a valid string when an increment is supplied', function() {
        expect(parser.getYearString('2020/2')).to.be.a('string');
        expect(parser.getYearString('2020/2')).to.equal('every 2 years starting on 2020');

        expect(parser.getYearString('2016/1')).to.be.a('string');
        expect(parser.getYearString('2016/1')).to.equal('every year starting on 2016');

        expect(parser.getYearString('2017/5')).to.be.a('string');
        expect(parser.getYearString('2017/5')).to.equal('every 5 years starting on 2017');
    });
});