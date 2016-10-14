"use strict";
var expect = require('chai').expect;
var testCases = require('./testCases.json');
var parser = require('../dist/cron-humanize').CronHumanize;

describe('humanize', function() {
    it('should return a humanized version of the input cron expression', function() {
        expect(parser.humanize('* * * * * * *')).to.be.a('string');
        expect(parser.humanize('* * * * * * *')).to.equal('Fire every second, every day.');

        expect(parser.humanize('0 0 12 * * * *')).to.be.a('string');
        expect(parser.humanize('0 0 12 * * * *')).to.equal('Fire at 12:00, every day.');

        expect(parser.humanize('0 0 0 ? 2-3 1,2 *')).to.be.a('string');
        expect(parser.humanize('0 0 0 ? 2-3 1,2 *')).to.equal('Fire at 00:00, every day, in the months of March through April, only on Monday and Tuesday.');

        expect(parser.humanize('0/5 * 12 ? 3,OCT,11 2 2020-2022')).to.be.a('string');
        expect(parser.humanize('0/5 * 12 ? 3,OCT,11 2 2020-2022')).to.equal('Fire every 5 seconds, at 12:00, every day, in the months of April, October and December, only on Tuesdays, between 2020 and 2022.');

        expect(parser.humanize('10-20 10/1 12/1 ? 5/FEB 2-THU 2020-2022')).to.be.a('string');
        expect(parser.humanize('10-20 10/1 12/1 ? 5/FEB 2-THU 2020-2022')).to.equal('Fire every second from 10 through 20, every minute starting at minute 10, past every hour starting at 12:00, every day, every month starting on June, only from Tuesday through Thursday, between 2020 and 2022.');

        testCases.forEach(function(testCase) {
            expect(parser.humanize(testCase.expression)).to.be.a('string');
            expect(parser.humanize(testCase.expression)).to.equal(testCase.result);
        });
    });
});

// describe('dissect', function() {
//    it('should return a dissected cron expression', function() {
//        testCases.forEach(function(testCase) {
//            expect(JSON.stringify(parser.dissect(testCase.expression))).to.equal(JSON.stringify(testCase.dissection));
//        });
//    });
// });
