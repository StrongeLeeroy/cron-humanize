"use strict";
var parser = require('../dist/cron-humanize').CronHumanize;

let result = parser.humanize('0 15 10 * * ? 2005');
console.log(result);