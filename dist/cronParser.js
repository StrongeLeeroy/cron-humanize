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
        this.monthsArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.days = {
            MON: 'Monday',
            TUE: 'Tuesday',
            WED: 'Wednesday',
            THU: 'Thursday',
            FRI: 'Friday',
            SAT: 'Saturday',
            SUN: 'Sunday',
            getKey: function (key) {
                return this[key];
            }
        };
        this.daysArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    }
    CronParser.prototype.humanize = function (expression) {
        var detail = this.dissect(expression);
        return this.getMonthString(detail.month) + this.getYearString(detail.year);
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
    CronParser.prototype.getTime = function (seconds, minutes, hours) {
        if (seconds === '*' && minutes === '*' && hours === '*') {
            return 'every second';
        }
    };
    CronParser.prototype.getSecondsString = function (seconds) {
        if (seconds === '*') {
            return 'every second';
        }
        else if (seconds === '0') {
            return '00';
        }
        else {
            return null;
        }
    };
    CronParser.prototype.getMinutesString = function (minutes) {
        if (minutes === '*') {
            return 'every minute';
        }
        else if (minutes === '0') {
            return '00';
        }
        else {
            return null;
        }
    };
    CronParser.prototype.getHoursString = function (hours) {
        if (hours === '*') {
            return 'every hour';
        }
        else if (hours === '0') {
            return '00';
        }
        else {
            return null;
        }
    };
    CronParser.prototype.getYearString = function (years) {
        var isRange = years.indexOf(this.DASH) > 0, isMulti = years.indexOf(this.COMA) > 0;
        if (years === this.WILDCARD || !years) {
            return 'every year';
        }
        else if (isRange) {
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
        return this.getType('months', month);
    };
    CronParser.prototype.getDayString = function (days) {
        var isRange = days.indexOf(this.DASH) > 0, isMulti = days.indexOf(this.COMA) > 0;
        if (days === this.WILDCARD) {
            return 'every day';
        }
        else if (isRange) {
            var dayArray = days.split(this.DASH);
            return "every day from " + this.getDayName(dayArray[0]) + " to " + this.getDayName(dayArray[1]);
        }
        else if (isMulti) {
            var dayArray = days.split(this.COMA), last = dayArray.pop();
            return "every " + dayArray.map(this.getDayName.bind(this)).join(', ') + " and " + this.getDayName(last);
        }
        else {
            return "every " + this.getDayName(days);
        }
    };
    CronParser.prototype.getDayName = function (day) {
        return this.getType('days', day);
    };
    CronParser.prototype.getType = function (type, value) {
        var parsed = parseInt(value);
        switch (type) {
            case 'days':
                return isNaN(parsed) ? this.days.getKey(value) :
                    typeof parsed === 'number' ? this.daysArray[parsed - 1] :
                        null;
            case 'months':
            default:
                return isNaN(parsed) ? this.months.getKey(value) :
                    typeof parsed === 'number' ? this.monthsArray[parsed] :
                        null;
        }
    };
    return CronParser;
}());
exports.CronParser = CronParser;
//# sourceMappingURL=cronParser.js.map