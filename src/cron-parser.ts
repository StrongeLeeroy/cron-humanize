interface CronConstants {
    SEPARATOR: string;
    COMA: string;
    DASH: string;
    WILDCARD: string;
    UNSPECIFIED: string;
    SLASH: string;

    TYPE_MULTI: string;
    TYPE_RANGE: string;
    TYPE_SINGLE: string;
    TYPE_WILDCARD: string;
    TYPE_UNSPECIFIED: string;
    TYPE_INTERVAL: string;

    SHORT_DAYS: string[];
    FULL_DAYS: string[];

    SHORT_MONTHS: string[];
    FULL_MONTHS: string[];
}

interface CronDissection {
    seconds: string;
    minutes: string;
    hours: string;
    dayOfMonth: string;
    month: string;
    dayOfWeek: string;
    year: string;
}

interface MultiDef { values: number[], last: number }
interface RangeDef { start: number, end: number }
interface IntervalDef { start: number, step: number }

export const CONSTANTS: CronConstants = {
    SEPARATOR: ' ',
    COMA: ',',
    DASH: '-',
    WILDCARD: '*',
    UNSPECIFIED: '?',
    SLASH: '/',
    TYPE_MULTI: 'multi',
    TYPE_RANGE: 'range',
    TYPE_SINGLE: 'single',
    TYPE_WILDCARD: 'wildcard',
    TYPE_UNSPECIFIED: 'unspecified',
    TYPE_INTERVAL: 'interval',
    SHORT_DAYS: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    FULL_DAYS: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    SHORT_MONTHS: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    FULL_MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

export class UnitDefinition {
    public type: string;

    public multi: MultiDef;
    public range: RangeDef;
    public interval: IntervalDef;

    public unspecified: string;
    public wildcard: string;
    public single: number;

    constructor(private rawData: string, private names?: string[], private indexBase?: number) {
        this.type = this.setType(rawData);
        switch(this.type) {
            case CONSTANTS.TYPE_MULTI:
                this.multi = this.getMultiDef(rawData);
                break;
            case CONSTANTS.TYPE_RANGE:
                this.range = this.getRangeDef(rawData);
                break;
            case CONSTANTS.TYPE_INTERVAL:
                this.interval = this.getIntervalDef(rawData);
                break;
            case CONSTANTS.TYPE_UNSPECIFIED:
                this.unspecified = this.getDef(rawData);
                break;
            case CONSTANTS.TYPE_WILDCARD:
                this.wildcard = this.getDef(rawData);
                break;
            case CONSTANTS.TYPE_SINGLE:
                this.single = this.getSingleDef(rawData);
                break;
        }
    }

    public setType(value: string): string {
        if (value.indexOf(CONSTANTS.COMA) > 0) {
            return CONSTANTS.TYPE_MULTI;
        } else if (value.indexOf(CONSTANTS.WILDCARD) >= 0) {
            return CONSTANTS.TYPE_WILDCARD;
        } else if (value.indexOf(CONSTANTS.UNSPECIFIED) >= 0) {
            return CONSTANTS.TYPE_UNSPECIFIED;
        } else if (value.indexOf(CONSTANTS.SLASH) > 0) {
            return CONSTANTS.TYPE_INTERVAL;
        } else if (value.indexOf(CONSTANTS.DASH) > 0) {
            return CONSTANTS.TYPE_RANGE;
        } else {
            return CONSTANTS.TYPE_SINGLE;
        }
    }

    private checkForNamed(value: string): number {
        return isNaN(parseInt(value)) ? this.getIndex(value) : parseInt(value);
    }

    private getMultiDef(value: string): MultiDef {
        let values = value.split(CONSTANTS.COMA).map(current => this.checkForNamed(current)),
            last = values.pop();

        return { values, last };
    }

    private getRangeDef(value: string): RangeDef {
        let range: number[] = value.split(CONSTANTS.DASH).map(current => this.checkForNamed(current));
        return {
            start: range[0],
            end: range[1]
        };
    }
    private getIntervalDef(value: string): IntervalDef {
        let interval = value.split('/').map(current => this.checkForNamed(current));
        return {
            start: interval[0],
            step: interval[1]
        };
    }

    private getDef(value: string): string {
        return value;
    }

    private getSingleDef(value: string): number {
        return this.checkForNamed(value);
    }

    private getIndex(value: string): number {
        return this.names.indexOf(value) + this.indexBase;
    }
}

export class CronExpression {
    private dissection: CronDissection;

    public seconds: UnitDefinition;
    public minutes: UnitDefinition;
    public hours: UnitDefinition;

    public dayOfMonth: UnitDefinition;
    public month: UnitDefinition;
    public dayOfWeek: UnitDefinition;
    public year: UnitDefinition;

    constructor(private expressionString: string) {
        this.setDissection(expressionString);

        this.seconds = new UnitDefinition(this.dissection.seconds);
        this.minutes = new UnitDefinition(this.dissection.minutes);
        this.hours = new UnitDefinition(this.dissection.hours);

        this.dayOfMonth = new UnitDefinition(this.dissection.dayOfMonth);
        this.month = new UnitDefinition(this.dissection.month, CONSTANTS.SHORT_MONTHS, 0);
        this.dayOfWeek = new UnitDefinition(this.dissection.dayOfWeek, CONSTANTS.SHORT_DAYS, 1);
        this.year = new UnitDefinition(this.dissection.year);
    }

    public setDissection(expression: string | CronDissection): void {
        if (!expression) {
            throw new Error('A valid cron expression or generated expression must be provided');
        } else if (typeof expression === 'string') {
            let exprArray = expression.split(CONSTANTS.SEPARATOR);
            this.dissection = {
                seconds: exprArray[0],
                minutes: exprArray[1],
                hours: exprArray[2],
                dayOfMonth: exprArray[3],
                month: exprArray[4],
                dayOfWeek: exprArray[5],
                year: exprArray[6]
            };
        } else {
            try {
                this.dissection = expression;
            } catch (error) {
                throw new Error(error);
            }
        }
    }

    public getDissection(): CronDissection {
        return this.dissection;
    }
}

export class CronParser {

    public humanize(expression: string): string {
        let cron: CronExpression = new CronExpression(expression),
            baseString = 'Fire';

        return `${baseString} ${this.getTimeString(cron.seconds, cron.minutes, cron.hours)}, ${this.getDayOfWeekString(cron.dayOfWeek)}, ${this.getMonthString(cron.month)}, ${this.getYearString(cron.year)}.`;
    }

    public getTimeString(seconds: UnitDefinition, minutes: UnitDefinition, hours: UnitDefinition): string {
        if (seconds.type === CONSTANTS.TYPE_SINGLE && minutes.type === CONSTANTS.TYPE_SINGLE && hours.type === CONSTANTS.TYPE_SINGLE) {
            return `at ${this.padZero(hours.single)}:${this.padZero(minutes.single)}${seconds.single === 0 ? '' : ':' + this.padZero(seconds.single)}`;
        } else if (seconds.type === CONSTANTS.TYPE_WILDCARD && minutes.type === CONSTANTS.TYPE_WILDCARD && hours.type === CONSTANTS.TYPE_WILDCARD) {
            return 'every second';
        } else {
            return `${this.getSecondsString(seconds)}, ${this.getMinutesString(minutes)}, ${this.getHoursString(hours)}`;
        }
    }

    public getSecondsString(seconds: UnitDefinition): string {
        switch(seconds.type) {
            case CONSTANTS.TYPE_WILDCARD:
                return 'every second';
            case CONSTANTS.UNSPECIFIED:
                return '';
            case CONSTANTS.TYPE_RANGE:
                return `every second from ${seconds.range.start} through ${seconds.range.end}`;
            case CONSTANTS.TYPE_MULTI:
                return `at seconds ${seconds.multi.values.join(', ')} and ${seconds.multi.last}`;
            case CONSTANTS.TYPE_INTERVAL:
                let isOne = seconds.interval.step === 1;
                return `every ${isOne ? '' : seconds.interval.step + ' '}second${isOne ? '' : 's'}${seconds.interval.start === 0 ? '' : ' starting at second ' + seconds.interval.start}`;
            case CONSTANTS.TYPE_SINGLE:
            default:
                return `at second ${seconds.single}`;
        }
    }

    public getMinutesString(minutes: UnitDefinition) {
        switch(minutes.type) {
            case CONSTANTS.TYPE_WILDCARD:
                return 'every minute';
            case CONSTANTS.UNSPECIFIED:
                return '';
            case CONSTANTS.TYPE_RANGE:
                return `every minute from ${minutes.range.start} through ${minutes.range.end}`;
            case CONSTANTS.TYPE_MULTI:
                return `at minutes ${minutes.multi.values.join(', ')} and ${minutes.multi.last}`;
            case CONSTANTS.TYPE_INTERVAL:
                let isOne = minutes.interval.step === 1;
                return `every ${isOne ? '' : minutes.interval.step + this.getOrdinal(minutes.interval.step) + ' '}minute${minutes.interval.start === 0 ? '' : ' starting at minute ' + minutes.interval.start}`;
            case CONSTANTS.TYPE_SINGLE:
            default:
                return `at minute ${minutes.single}`;
        }
    }

    public getHoursString(hours: UnitDefinition) {
        switch(hours.type) {
            case CONSTANTS.TYPE_WILDCARD:
            case CONSTANTS.UNSPECIFIED:
                return 'every hour';
            case CONSTANTS.TYPE_RANGE:
                return `during every hour from ${this.pad(hours.range.start)} through ${this.pad(hours.range.end)}`;
            case CONSTANTS.TYPE_MULTI:
                return `during the hours ${hours.multi.values.map(this.pad).join(', ')} and ${this.pad(hours.multi.last)}`;
            case CONSTANTS.TYPE_INTERVAL:
                let isOne = hours.interval.step === 1;
                return `past every ${isOne ? '' : hours.interval.step + this.getOrdinal(hours.interval.step) + ' '}hour starting at ${this.pad(hours.interval.start)}`;
            case CONSTANTS.TYPE_SINGLE:
            default:
                return `at ${this.pad(hours.single)}`;
        }
    }

    private getOrdinal(value: number): string {
        switch (value) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    }

    private pad(value: number | string): string {
        let converted = typeof value === 'number' ? value.toString() : value;

        return converted.length === 1 ?
            `0${value}:00` :
            `${value}:00`;
    }

    private padZero(value: number | string): string {
        let converted = typeof value === 'number' ? value.toString() : value;

        return converted.length === 1 ?
            `0${value}` :
            `${value}`;
    }

    public getYearString(years: UnitDefinition) {
        switch(years.type) {
            case CONSTANTS.TYPE_WILDCARD:
                return 'every year';
            case CONSTANTS.UNSPECIFIED:
                return '';
            case CONSTANTS.TYPE_RANGE:
                return `between ${years.range.start} and ${years.range.end}`;
            case CONSTANTS.TYPE_MULTI:
                return `during ${years.multi.values.join(', ')} and ${years.multi.last}`;
            case CONSTANTS.TYPE_INTERVAL:
                let isOne = years.interval.step === 1;
                return `every ${isOne ? '' : years.interval.step + ' '}year${isOne ? '' : 's'} starting on ${years.interval.start}`;
            case CONSTANTS.TYPE_SINGLE:
            default:
                return `during ${years.single}`;
        }
    }

    public getMonthString(months: UnitDefinition): string {
        switch(months.type) {
            case CONSTANTS.TYPE_WILDCARD:
                return 'every month';
            case CONSTANTS.UNSPECIFIED:
                return '';
            case CONSTANTS.TYPE_RANGE:
                return `in the months of ${this.getMonthName(months.range.start)} through ${this.getMonthName(months.range.end)}`;
            case CONSTANTS.TYPE_MULTI:
                return `in the months of ${months.multi.values.map(this.getMonthName).join(', ')} and ${this.getMonthName(months.multi.last)}`;
            case CONSTANTS.TYPE_INTERVAL:
                let isOne = months.interval.step === 1;
                return `every ${isOne ? '' : months.interval.step + ' '}month${isOne ? '' : 's'} starting on ${this.getMonthName(months.interval.start)}`;
            case CONSTANTS.TYPE_SINGLE:
            default:
                return `in the month of ${this.getMonthName(months.single)}`;
        }
    }

    public getMonthName(month: number): string {
        return CONSTANTS.FULL_MONTHS[month];
    }

    public getDayOfWeekString(days: UnitDefinition): string {
        switch(days.type) {
            case CONSTANTS.TYPE_WILDCARD:
                return 'every day';
            case CONSTANTS.UNSPECIFIED:
                return '';
            case CONSTANTS.TYPE_RANGE:
                return `every day from ${this.getDayOfWeekName(days.range.start)} through ${this.getDayOfWeekName(days.range.end)}`;
            case CONSTANTS.TYPE_MULTI:
                return `every ${days.multi.values.map(this.getDayOfWeekName).join(', ')} and ${this.getDayOfWeekName(days.multi.last)}`;
            case CONSTANTS.TYPE_INTERVAL:
                let isOne = days.interval.step === 1;
                return `every ${isOne ? '' : days.interval.step + ' '}day${isOne ? '' : 's'} starting on ${this.getDayOfWeekName(days.interval.start)}`;
            case CONSTANTS.TYPE_SINGLE:
            default:
                return `every ${this.getDayOfWeekName(days.single)}`;
        }
    }

    public getDayOfWeekName(day: number): string {
        return CONSTANTS.FULL_DAYS[day - 1];
    }


}