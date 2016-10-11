"use strict";
var CronParser = (function () {
    function CronParser() {
        this.SEPARATOR = ' ';
        this.COMA = ',';
        this.DASH = '-';
        this.WILDCARD = '*';
        this.months = {
            JAN: 'January',
            FEB: 'February',
            MAR: 'March',
            APR: 'April',
            MAY: 'May',
            JUN: 'June',
            JUL: 'July',
            AUG: 'August',
            SEP: 'September',
            OCT: 'October',
            NOV: 'November',
            DEC: 'December',
            getKey: function (key) {
                return this[key];
            }
        };
        this.monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    }
    CronParser.prototype.humanize = function (expression) {
        var detail = this.dissect(expression);
        var yearString = "during " + this.getYearString(detail.year) + ".";
        return '';
    };
    CronParser.prototype.getTime = function (seconds, minutes, hours) {
        var timeString = '';
        return timeString;
    };
    CronParser.prototype.dissect = function (expression) {
        var exprArray = expression.split(this.SEPARATOR);
        return {
            seconds: exprArray[0],
            minutes: exprArray[1],
            hours: exprArray[2],
            dayOfMonth: exprArray[3],
            month: exprArray[4],
            dayOfWeek: exprArray[5],
            year: exprArray[6]
        };
    };
    CronParser.prototype.getYearString = function (years) {
        var isRange = years.indexOf(this.DASH) > 0, isMulti = years.indexOf(this.COMA) > 0;
        if (isRange) {
            var yearArray = years.split(this.DASH);
            return "between " + yearArray[0] + " and " + yearArray[1];
        }
        else if (isMulti) {
            var yearArray = years.split(this.COMA), last = yearArray.pop();
            return "during " + yearArray.join(', ') + " and " + last;
        }
        else {
            return "during " + years;
        }
    };
    CronParser.prototype.getMonthString = function (months) {
        var isRange = months.indexOf(this.DASH) > 0, isMulti = months.indexOf(this.COMA) > 0;
        if (months === this.WILDCARD) {
            return 'every month';
        }
        else if (isRange) {
            var monthArray = months.split(this.DASH);
            return "in the months of " + this.getMonthName(monthArray[0]) + " through " + this.getMonthName(monthArray[1]);
        }
        else if (isMulti) {
            var monthArray = months.split(this.COMA), last = monthArray.pop();
            return "in the months of " + monthArray.map(this.getMonthName.bind(this)).join(', ') + " and " + this.getMonthName(last);
        }
        else {
            return "in the month of " + this.getMonthName(months);
        }
    };
    CronParser.prototype.getMonthName = function (month) {
        var parsed = parseInt(month);
        if (isNaN(parsed)) {
            return this.months.getKey(month);
        }
        else if (typeof parsed === 'number') {
            return this.monthArray[parsed];
        }
    };
    return CronParser;
}());
exports.CronParser = CronParser;
//# sourceMappingURL=cronParser.js.map