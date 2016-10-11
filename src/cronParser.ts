// Format: * * * * * * * => SECONDS - MINUTES - HOURS - DAY OF MONTH - MONTH - DAY OF WEEK - YEAR

interface CronDissection {
    seconds: string;
    minutes: string;
    hours: string;
    dayOfMonth: string;
    month: string;
    dayOfWeek: string;
    year: string;
}

export class CronParser {
    private SEPARATOR: string = ' ';
    private COMA: string = ',';
    private DASH: string = '-';
    private WILDCARD: string = '*';

    private months = {
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
        getKey: function(key: string) {
            return this[key];
        }
    };

    private monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    public humanize(expression: string): string {
        let detail = this.dissect(expression);

        let yearString = `during ${this.getYearString(detail.year)}.`;
        return '';
    }

    public getTime(seconds: string, minutes: string, hours: string): string {
        let timeString = '';

        return timeString;
    }

    public dissect(expression: string): CronDissection {
        let exprArray = expression.split(this.SEPARATOR);
        return {
            seconds: exprArray[0],
            minutes: exprArray[1],
            hours: exprArray[2],
            dayOfMonth: exprArray[3],
            month: exprArray[4],
            dayOfWeek: exprArray[5],
            year: exprArray[6]
        }
    }

    public getYearString(years: string) {
        let isRange = years.indexOf(this.DASH) > 0,
            isMulti = years.indexOf(this.COMA) > 0;

        if (isRange) {
            let yearArray = years.split(this.DASH);
            return `between ${yearArray[0]} and ${yearArray[1]}`;
        } else if (isMulti) {
            let yearArray = years.split(this.COMA),
                last = yearArray.pop();

            return `during ${yearArray.join(', ')} and ${last}`;
        } else {
            return `during ${years}`;
        }
    }

    public getMonthString(months: string) {
        let isRange = months.indexOf(this.DASH) > 0,
            isMulti = months.indexOf(this.COMA) > 0;

        if (months === this.WILDCARD) {
            return 'every month'
        } else if (isRange) {
            let monthArray = months.split(this.DASH);
            return `in the months of ${this.getMonthName(monthArray[0])} through ${this.getMonthName(monthArray[1])}`;
        } else if (isMulti) {
            let monthArray = months.split(this.COMA),
                last = monthArray.pop();
            return `in the months of ${monthArray.map(this.getMonthName.bind(this)).join(', ')} and ${this.getMonthName(last)}`;
        } else {
            return `in the month of ${this.getMonthName(months)}`;
        }
    }

    public getMonthName(month: string): string {
        let parsed = parseInt(month);
        if (isNaN(parsed)) {
            return this.months.getKey(month);
        } else if (typeof parsed === 'number') {
            return this.monthArray[parsed];
        }
    }
}