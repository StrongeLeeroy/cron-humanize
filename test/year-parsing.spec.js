"use strict";
var expect = require('chai').expect;
var testCases = require('./testCases.json');
var UnitDefinition = require('../dist/cron-parser').UnitDefinition;
var CronParser = require('../dist/cron-parser').CronParser;
let parser = new CronParser();

describe('getYearString', function() {

    it('should return a valid string for a single year', function() {
        let testCase = new UnitDefinition('2005');
        expect(parser.getYearString(testCase)).to.be.a('string');
        expect(parser.getYearString(testCase)).to.equal('during 2005');
    });

    it('should return a valid string for a year range', function() {
        let testCase = new UnitDefinition('2005-2010');
        expect(parser.getYearString(testCase)).to.be.a('string');
        expect(parser.getYearString(testCase)).to.equal('between 2005 and 2010');
    });

    it('should return a valid string for multiple years', function() {
        let testCase = new UnitDefinition('2005,2006,2009,2010');
        expect(parser.getYearString(testCase)).to.be.a('string');
        expect(parser.getYearString(testCase)).to.equal('during 2005, 2006, 2009 and 2010');
    });

    it('should return a valid string when an increment is supplied', function() {
        let testCase = new UnitDefinition('2020/2');
        expect(parser.getYearString(testCase)).to.be.a('string');
        expect(parser.getYearString(testCase)).to.equal('every 2 years starting on 2020');

        testCase = new UnitDefinition('2016/1');
        expect(parser.getYearString(testCase)).to.be.a('string');
        expect(parser.getYearString(testCase)).to.equal('every year starting on 2016');

        testCase = new UnitDefinition('2017/5');
        expect(parser.getYearString(testCase)).to.be.a('string');
        expect(parser.getYearString(testCase)).to.equal('every 5 years starting on 2017');
    });
});