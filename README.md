# chrono

[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-brightgreen?style=flat)](https://github.com/neostandard/neostandard)
[![current version](https://img.shields.io/npm/v/@robireton/chrono)](https://www.npmjs.com/package/@robireton/chrono)

*date/time related helpers*

Starting with v3.0.0, this requires Node.js 26 or later and uses `Temporal` internally. `timestamp`, `datetag` and `Cron` accept an optional `timeZone`, so they no longer depend on the process `TZ`. Stick with v2.x.x if you need an older Node.js.

Starting with v2.0.0, this is an ECMAScript module. Stick with v1.x.x if you need a CommonJS module.

### Upgrading from v2
- Existing calls keep working and still follow the system time zone.
- Pass a `timeZone` to stop depending on `TZ`: `timestamp(undefined, zone)`, `datetag(undefined, zone)`, `new Cron(interval, days, hours, zone)`.
- Invalid input now throws where v2 quietly returned `'NaN-NaN-NaN'`, an Invalid Date or `NaN`.
- `Cron` no longer adds a `process` `'exit'` listener for each instance.


## Exports

Wherever a `timeZone` is accepted, it is an IANA time zone identifier such as `'America/New_York'` or `'UTC'`. If it is omitted, the system time zone is used: whatever `TZ` says, looked up at the moment of the call (falling back to UTC if `TZ` is unusable). An unknown identifier throws a `RangeError`.

Wherever a moment `now` is accepted, it may be a number of milliseconds since 1970-01-01T00:00:00Z (fractions are truncated), a `Date`, or a `Temporal.Instant`. It defaults to the current time. A non-finite number or an invalid `Date` throws a `RangeError`, and any other type throws a `TypeError`.

### `timestamp` ( `now`, `timeZone` )
Returns a string of the form 'YYYY-MM-DD HH:MM:SS' giving the wall-clock time of `now` in `timeZone`. The space between the date and time is a non-breaking space (U+00A0).

### `datetag` ( `now`, `timeZone` )
Returns a string of the form 'YYYY-MM-DD' giving the calendar date of `now` in `timeZone`.

### `dateFromUnix` ( *number* )
Returns a Javascript `Date` object for the given unix timestamp (in seconds from 1970). Returns `null` for `null` or `undefined`. Throws a `RangeError` for a non-finite number and a `TypeError` for anything else.

### `unixTime` ( *number* or *Date* )
Returns a unix timestamp (in seconds from 1970) for a given Javascript `Date` object or equivalent number of milliseconds from 1970 (defaults to now). Throws a `RangeError` for an invalid `Date` or non-finite number.

### `localDate` ( *string* )
Returns a `Date` at local midnight for a date string in 'Y-M-D' format. 'Y-M' is interpreted as 'Y-M-1', and 'Y' as 'Y-1-1'. Years 0–99 are taken literally, not mapped onto 1900–1999.

### `Cron` ( `interval`: *number*, `days`: *iterable*, `hours`: *iterable*, `timeZone`: *string* )
Class for an `EventEmitter` that emits a `cron` event every `interval` milliseconds, provided the current weekday index ∈ `days` and the current hour index ∈ `hours`. Weekdays and hours are judged in `timeZone`. If `timeZone` is omitted, they follow the system time zone, as in v2. `days` and `hours` default to all days and all hours. Event handlers for `cron` events are passed a `Date` object representing the instant the event was emitted.

`interval` must be a number of milliseconds from 1 to 2³¹−1, or a `RangeError` is thrown. An unknown `timeZone` throws a `RangeError` from the constructor.

`Cron.prototype.interval`: get or set the event interval (milliseconds). Setting it on a closed `Cron` does not restart it.

`Cron.prototype.days`: get or set the `Set` of weekday indices (Sunday = 0) on which events are emitted. Any iterable may be assigned.

`Cron.prototype.hours`: get or set the `Set` of hour indices during which events are emitted. Any iterable may be assigned.

`Cron.prototype.timeZone`: the canonical time zone identifier passed to the constructor, or `undefined` (read-only).

`Cron.prototype.close()`: stop emitting events.



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
