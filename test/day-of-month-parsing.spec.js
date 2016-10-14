"use strict";
var expect = require('chai').expect;
var testCases = require('./testCases.json');
var CronParser = require('../dist/cron-parser').CronParser;
let parser = new CronParser();

