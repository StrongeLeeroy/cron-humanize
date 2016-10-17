[![Travis](https://img.shields.io/travis/StrongeLeeroy/cron-humanize.svg?style=flat-square)](https://travis-ci.org/StrongeLeeroy/cron-humanize)
[![SemVer](http://img.shields.io/:semver-1.0.7-brightgreen.svg?style=flat-square)](http://semver.org)

## cron-humanize

Transforms cron expressions into human speech.


Examples:

    CronParser.humanize('* * * * * * *');
    // Fire every second, every day.
    
    CronParser.humanize('10-20 10/1 12/1 ? 5/FEB 2-THU 2020-2022');
    // Fire every second from 10 through 20, every minute starting at minute 10, past every hour starting at 12:00, every day, every month starting on June, only from Monday through Thursday, between 2020 and 2022.
    
    
#### IN PROGRESS:
    - Support for L, LW, _L and _W units.
    
#### TODO:
    - Optional year parameter.
    - Optional second parameter.