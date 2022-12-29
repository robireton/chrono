# chrono

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![current version](https://img.shields.io/npm/v/@robireton/chrono)](https://www.npmjs.com/package/@robireton/chrono)
[![install size](https://packagephobia.com/badge?p=@robireton/chrono)](https://packagephobia.com/result?p=@robireton/chrono)

*date/time related helpers*

Starting with v2.0.0, this is an ECMAScript module—stick with v1.x.x if you need a CommonJS module.


## Methods

### `timestamp` ( *number* )
Takes a number of milliseconds since January 1, 1970, 00:00:00 UTC (defaults to current time) and returns a string of the form 'YYYY-MM-DD HH:MM:SS'. The space between the date and time is a non-breaking space (U+00A0).

### `datetag` ( *number* )
Takes a number of milliseconds since January 1, 1970, 00:00:00 UTC (defaults to current time) and returns a string of the form 'YYYY-MM-DD'.

