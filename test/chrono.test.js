import { describe, it, mock, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import process from 'node:process'
import { timestamp, datetag, dateFromUnix, unixTime, localDate, months, weekdays, hours, Cron } from '../chrono.js'

const NBSP = ' '
const iso = '2021-02-11T21:07:48.989Z' // a Thursday
const ms = Date.parse(iso)
const instant = Temporal.Instant.from(iso)
const systemZone = Temporal.Now.zonedDateTimeISO().timeZoneId

describe('timestamp', () => {
  it('formats in the given zone', () => {
    assert.equal(timestamp(ms, 'UTC'), `2021-02-11${NBSP}21:07:48`)
    assert.equal(timestamp(ms, 'America/New_York'), `2021-02-11${NBSP}16:07:48`)
    assert.equal(timestamp(ms, 'Asia/Tokyo'), `2021-02-12${NBSP}06:07:48`)
    assert.equal(timestamp(ms, 'Asia/Kolkata'), `2021-02-12${NBSP}02:37:48`)
  })

  it('handles a DST transition', () => {
    assert.equal(timestamp(Date.parse('2021-03-14T06:30:00Z'), 'America/New_York'), `2021-03-14${NBSP}01:30:00`)
    assert.equal(timestamp(Date.parse('2021-03-14T07:30:00Z'), 'America/New_York'), `2021-03-14${NBSP}03:30:00`)
  })

  it('accepts a number, a Date, or a Temporal.Instant', () => {
    const expected = `2021-02-11${NBSP}21:07:48`
    assert.equal(timestamp(ms, 'UTC'), expected)
    assert.equal(timestamp(new Date(ms), 'UTC'), expected)
    assert.equal(timestamp(instant, 'UTC'), expected)
    assert.equal(timestamp(ms + 0.5, 'UTC'), expected)
  })

  it('defaults to the system zone', () => {
    assert.equal(timestamp(ms), timestamp(ms, systemZone))
  })

  it('defaults to now', () => {
    const before = timestamp(Date.now(), 'UTC')
    const now = timestamp(undefined, 'UTC')
    const after = timestamp(Date.now(), 'UTC')
    assert.ok(now >= before && now <= after)
  })

  it('pads small years', () => {
    const d = new Date(0)
    d.setUTCFullYear(5, 0, 2)
    assert.equal(timestamp(d, 'UTC'), `0005-01-02${NBSP}00:00:00`)
  })

  it('rejects bad input', () => {
    assert.throws(() => timestamp(ms, 'Mars/Olympus_Mons'), RangeError)
    assert.throws(() => timestamp(Number.NaN, 'UTC'), RangeError)
    assert.throws(() => timestamp(Infinity, 'UTC'), RangeError)
    assert.throws(() => timestamp(new Date('nope'), 'UTC'), RangeError)
    assert.throws(() => timestamp(iso, 'UTC'), TypeError)
    assert.throws(() => timestamp(null, 'UTC'), TypeError)
  })
})

describe('datetag', () => {
  it('formats in the given zone', () => {
    assert.equal(datetag(ms, 'UTC'), '2021-02-11')
    assert.equal(datetag(ms, 'America/New_York'), '2021-02-11')
    assert.equal(datetag(ms, 'Asia/Tokyo'), '2021-02-12')
    assert.equal(datetag(new Date(ms), 'Asia/Kolkata'), '2021-02-12')
    assert.equal(datetag(instant, 'Pacific/Honolulu'), '2021-02-11')
  })

  it('defaults to the system zone and to now', () => {
    assert.equal(datetag(ms), datetag(ms, systemZone))
    assert.equal(datetag(), Temporal.Now.zonedDateTimeISO().toPlainDate().toString())
  })

  it('rejects bad input', () => {
    assert.throws(() => datetag(ms, 'Nowhere/Special'), RangeError)
    assert.throws(() => datetag(Number.NaN), RangeError)
    assert.throws(() => datetag('2021-02-11'), TypeError)
  })
})

describe('dateFromUnix', () => {
  it('returns null for null or undefined', () => {
    assert.equal(dateFromUnix(), null)
    assert.equal(dateFromUnix(null), null)
  })

  it('converts seconds to a Date', () => {
    assert.equal(dateFromUnix(Math.floor(ms / 1000)).toISOString(), '2021-02-11T21:07:48.000Z')
    assert.equal(dateFromUnix(0).toISOString(), '1970-01-01T00:00:00.000Z')
    assert.equal(dateFromUnix(-86400).toISOString(), '1969-12-31T00:00:00.000Z')
  })

  it('rejects bad input', () => {
    assert.throws(() => dateFromUnix(Number.NaN), RangeError)
    assert.throws(() => dateFromUnix('1613077668'), TypeError)
  })
})

describe('unixTime', () => {
  const s = Math.floor(ms / 1000)

  it('converts a Date or milliseconds to seconds', () => {
    assert.equal(unixTime(new Date(ms)), s)
    assert.equal(unixTime(ms), s)
    assert.equal(unixTime(-1), -1) // floors toward −∞
  })

  it('round-trips with dateFromUnix', () => {
    assert.equal(unixTime(dateFromUnix(s)), s)
  })

  it('defaults to now', () => {
    const before = Math.floor(Date.now() / 1000)
    const now = unixTime()
    assert.ok(now >= before && now <= before + 1)
  })

  it('rejects bad input', () => {
    assert.throws(() => unixTime(new Date('nope')), RangeError)
    assert.throws(() => unixTime(Number.NaN), RangeError)
    assert.throws(() => unixTime('now'), TypeError)
  })
})

describe('localDate', () => {
  const parts = d => [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes()]

  it('parses Y-M-D as local midnight', () => {
    assert.deepEqual(parts(localDate('2021-02-11')), [2021, 2, 11, 0, 0])
    assert.deepEqual(parts(localDate('2021/2/3')), [2021, 2, 3, 0, 0])
  })

  it('treats Y-M as Y-M-1 and Y as Y-1-1', () => {
    assert.deepEqual(parts(localDate('2021-02')), [2021, 2, 1, 0, 0])
    assert.deepEqual(parts(localDate('2021')), [2021, 1, 1, 0, 0])
  })

  it('keeps years below 100', () => {
    assert.deepEqual(parts(localDate('0050-06-15')), [50, 6, 15, 0, 0])
  })
})

describe('tables', () => {
  it('months', () => {
    assert.equal(months.length, 12)
    months.forEach((m, i) => {
      assert.equal(m.index, i)
      assert.equal(m.id, i + 1)
      assert.equal(m.digits, String(i + 1).padStart(2, '0'))
      assert.equal(m.short, m.long.slice(0, 3))
    })
    assert.equal(months.reduce((sum, m) => sum + m.days, 0), 365)
  })

  it('weekdays', () => {
    assert.equal(weekdays.length, 7)
    weekdays.forEach((d, i) => {
      assert.equal(d.index, i)
      assert.equal(d.short, d.long.slice(0, 3))
    })
    assert.equal(weekdays[0].long, 'Sunday')
  })

  it('hours', () => {
    assert.equal(hours.length, 24)
    hours.forEach((h, i) => {
      assert.equal(h.index, i)
      assert.equal(h.digits, String(i).padStart(2, '0'))
    })
  })
})

describe('Cron', () => {
  const crons = []
  const make = (...args) => {
    const cron = new Cron(...args)
    crons.push(cron)
    return cron
  }
  const count = cron => {
    const events = []
    cron.on('cron', d => events.push(d))
    return events
  }
  const at = when => mock.timers.enable({ apis: ['setInterval', 'Date'], now: Date.parse(when) })

  afterEach(() => {
    crons.splice(0).forEach(cron => cron.close())
    mock.timers.reset()
  })

  it('emits every interval with a Date by default', () => {
    at(iso)
    const cron = make(1000)
    const events = count(cron)
    mock.timers.tick(1000) // one step at a time: a mocked tick() moves Date to its end before firing
    mock.timers.tick(1000)
    mock.timers.tick(1000)
    mock.timers.tick(500)
    assert.equal(events.length, 3)
    assert.ok(events[0] instanceof Date)
    assert.deepEqual(events.map(d => d.getTime()), [ms + 1000, ms + 2000, ms + 3000])
    assert.equal(cron.interval, 1000)
    assert.equal(cron.timeZone, undefined)
  })

  it('is suppressed outside the active days and hours', () => {
    at('2021-02-11T14:00:00Z') // Thursday
    const wrongDay = count(make(1000, [1, 2, 3], hours.map(h => h.index), 'UTC'))
    const wrongHour = count(make(1000, [4], [9], 'UTC'))
    const right = count(make(1000, [4], [14], 'UTC'))
    mock.timers.tick(1000)
    assert.equal(wrongDay.length, 0)
    assert.equal(wrongHour.length, 0)
    assert.equal(right.length, 1)
  })

  it('judges days and hours in its own time zone', () => {
    at('2021-02-11T14:00:00Z') // 09:00 in New York, 23:00 in Tokyo
    const ny = make(1000, [4], [9], 'America/New_York')
    const utc = make(1000, [4], [9], 'UTC')
    const tokyo = make(1000, [4], [23], 'Asia/Tokyo')
    const events = [count(ny), count(utc), count(tokyo)]
    mock.timers.tick(1000)
    assert.deepEqual(events.map(e => e.length), [1, 0, 1])
    assert.equal(ny.timeZone, 'America/New_York')
  })

  it('maps Sunday to index 0', () => {
    at('2021-02-14T12:00:00Z') // Sunday
    const sunday = count(make(1000, [0], [12], 'UTC'))
    const saturday = count(make(1000, [6], [12], 'UTC'))
    mock.timers.tick(1000)
    assert.equal(sunday.length, 1)
    assert.equal(saturday.length, 0)
  })

  it('canonicalises the time zone', () => {
    assert.equal(make(1000, undefined, undefined, 'america/new_york').timeZone, 'America/New_York')
  })

  it('stops on close', () => {
    at(iso)
    const cron = make(1000)
    const events = count(cron)
    mock.timers.tick(1000)
    cron.close()
    cron.close()
    mock.timers.tick(5000)
    assert.equal(events.length, 1)
  })

  it('reschedules when the interval changes, but not after close', () => {
    at(iso)
    const cron = make(1000)
    const events = count(cron)
    cron.interval = 250
    mock.timers.tick(1000)
    assert.equal(events.length, 4)
    cron.close()
    cron.interval = 100
    mock.timers.tick(1000)
    assert.equal(events.length, 4)
    assert.equal(cron.interval, 100)
  })

  it('accepts any iterable for days and hours', () => {
    at('2021-02-11T14:00:00Z')
    const cron = make(1000, [], [], 'UTC')
    const events = count(cron)
    mock.timers.tick(1000)
    cron.days = [4]
    cron.hours = new Set([14]).values()
    assert.ok(cron.days instanceof Set)
    assert.ok(cron.hours instanceof Set)
    mock.timers.tick(1000)
    assert.equal(events.length, 1)
  })

  it('rejects a bad interval or time zone', () => {
    for (const bad of [0, -1, Number.NaN, Infinity, 2 ** 31, '1000', undefined]) {
      assert.throws(() => make(bad), RangeError)
    }
    const cron = make(1000)
    assert.throws(() => { cron.interval = 0 }, RangeError)
    assert.equal(cron.interval, 1000)
    assert.throws(() => make(1000, undefined, undefined, 'Atlantis/Capital'), RangeError)
  })

  it('does not add process listeners', () => {
    const before = process.listenerCount('exit')
    for (let i = 0; i < 20; i++) make(60000)
    assert.equal(process.listenerCount('exit'), before)
  })
})
