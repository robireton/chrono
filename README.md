# chrono

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![current version](https://img.shields.io/npm/v/@robireton/chrono)](https://www.npmjs.com/package/@robireton/chrono)
[![install size](https://packagephobia.com/badge?p=@robireton/chrono)](https://packagephobia.com/result?p=@robireton/chrono)

*date/time related helpers*

Starting with v2.0.0, this is an ECMAScript module—stick with v1.x.x if you need a CommonJS module.


## Exports

### `timestamp` ( *number* )
Takes a number of milliseconds since January 1, 1970, 00:00:00 UTC (defaults to current time) and returns a string of the form 'YYYY-MM-DD HH:MM:SS'. The space between the date and time is a non-breaking space (U+00A0).

### `datetag` ( *number* )
Takes a number of milliseconds since January 1, 1970, 00:00:00 UTC (defaults to current time) and returns a string of the form 'YYYY-MM-DD'.

### `dateFromUnix` ( *number* )
Returns a Javascript `Date` object for the given unix timestamp (in seconds from 1970). Returns `null` if a number is not passed.

### `unixTime` ( *number* or *Date* )
Returns a unix timestamp (in seconds from 1970) for a given Javascript `Date` object or equivalent number of milliseconds from 1970.

### `localDate` ( *string* )
returns a `Date` object corresponding to a local date string in 'Y-M-D' format. 'Y-M' is interpereted as 'Y-M-1'.

### `Cron` ( `interval`: *number*, `days`: *iterable*, `hours`: *iterable* )
class for creating an object that emits a `cron` event every `interval` milliseconds if current weekday index ∈ `days` and current hour index ∈ `hours`. Defaults for `days` and `hours` include all days and times. Event handlers for `cron` events are passed a `Date` object representing the instant the event was emitted.

`Cron.prototype.interval`: get or set the event interval (milliseconds)

`Cron.prototype.days`: get or set the `Set` of weekday indices on which events are emitted

`Cron.prototype.hours`: get or set the `Set` of hour indices during which events are emitted

`Cron.prototype.close()`: stop emitting events



### `months`
An array of month information objects with fields:

| field | description |
| --- | --- |
| `index` | 0-based month number: January = 0 … December = 11 |
| `id` | 1-based month number: January = 1 … December = 12 |
| `digits` | 2-digit string: January = '01' … December = '12' |
| `long` | full month name: 'January' … 'December' |
| `short` | 3-character month abbreviation: 'Jan' … 'Dec' |
| `days` | number of days in month (ignoring leap-years) |

### `weekdays`
An array of weekday information objects with fields:

| field | description |
| --- | --- |
| `index` | 0-based weekday number: Sunday = 0 … Saturday = 6 |
| `long` | full weekday name: 'Sunday' … 'Saturday' |
| `short` | 3-character weekday abbreviation: 'Sun' … 'Sat' |
| `narrow` | single character abbreviation (not injective) |

### `hours`
An array of hour information objects with fields:

| field | description |
| --- | --- |
| `index` | 0-based hour number: 0 … 23 |
| `digits` | 2-digit string: '00' … '23' |
