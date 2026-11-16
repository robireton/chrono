import { EventEmitter } from 'node:events'

// Normalises the accepted “moment” inputs to a Temporal.Instant.
// Numbers are epoch milliseconds, truncated toward zero the way Date does.
function toInstant (when, caller) {
  if (when instanceof Temporal.Instant) return when
  if (when instanceof Date) when = when.valueOf()
  if (typeof when === 'number') {
    if (!Number.isFinite(when)) throw new RangeError(`${caller}: invalid time value “${when}”`)
    return Temporal.Instant.fromEpochMilliseconds(Math.trunc(when))
  }
  throw new TypeError(`${caller}: I don’t know what to do with “${when}” (${typeof when})`)
}

// An omitted time zone means the system zone (which follows TZ), looked up at call time.
// Temporal.Now.timeZoneId() can report an unusable 'Etc/Unknown' (e.g. TZ=''), whereas
// Temporal.Now.zonedDateTimeISO() falls back to UTC, as Date’s local-time methods do.
const systemTimeZone = () => Temporal.Now.zonedDateTimeISO().timeZoneId

function zoned (when, timeZone, caller) {
  return toInstant(when, caller).toZonedDateTimeISO(timeZone ?? systemTimeZone())
}

export function timestamp (now = Date.now(), timeZone) {
  const zdt = zoned(now, timeZone, 'timestamp')
  return `${zdt.toPlainDate()}\u00A0${zdt.toPlainTime().toString({ smallestUnit: 'second' })}` // non-breaking space
}

export function datetag (now = Date.now(), timeZone) {
  return zoned(now, timeZone, 'datetag').toPlainDate().toString()
}

export function dateFromUnix (u) {
  if (u === null) return null
  if (typeof u === 'undefined') return null
  if (typeof u === 'number') {
    if (!Number.isFinite(u)) throw new RangeError(`dateFromUnix: invalid time value “${u}”`)
    return new Date(1000 * u)
  }
  throw new TypeError(`dateFromUnix: I don’t know what to do with “${u}” (${typeof u})`)
}

export function unixTime (n = Date.now()) {
  if (n instanceof Date) n = n.valueOf()
  if (typeof n === 'number') {
    if (!Number.isFinite(n)) throw new RangeError(`unixTime: invalid time value “${n}”`)
    return Math.floor(n / 1000)
  }
  throw new TypeError(`unixTime: I don’t know what to do with “${n}” (${typeof n})`)
}

export function localDate (date) {
  const [year, month, day] = date.split(/\D+/, 3).map(s => Number.parseInt(s))
  const d = new Date(2000, 0, 1) // local midnight
  d.setFullYear(year, (month || 1) - 1, day || 1) // setFullYear doesn’t map years 0–99 onto 1900–1999
  return d
}

export const months = [
  { index: 0, id: 1, digits: '01', long: 'January', short: 'Jan', days: 31 },
  { index: 1, id: 2, digits: '02', long: 'February', short: 'Feb', days: 28 },
  { index: 2, id: 3, digits: '03', long: 'March', short: 'Mar', days: 31 },
  { index: 3, id: 4, digits: '04', long: 'April', short: 'Apr', days: 30 },
  { index: 4, id: 5, digits: '05', long: 'May', short: 'May', days: 31 },
  { index: 5, id: 6, digits: '06', long: 'June', short: 'Jun', days: 30 },
  { index: 6, id: 7, digits: '07', long: 'July', short: 'Jul', days: 31 },
  { index: 7, id: 8, digits: '08', long: 'August', short: 'Aug', days: 31 },
  { index: 8, id: 9, digits: '09', long: 'September', short: 'Sep', days: 30 },
  { index: 9, id: 10, digits: '10', long: 'October', short: 'Oct', days: 31 },
  { index: 10, id: 11, digits: '11', long: 'November', short: 'Nov', days: 30 },
  { index: 11, id: 12, digits: '12', long: 'December', short: 'Dec', days: 31 }
]

export const weekdays = [
  { index: 0, long: 'Sunday', short: 'Sun', narrow: 'S' },
  { index: 1, long: 'Monday', short: 'Mon', narrow: 'M' },
  { index: 2, long: 'Tuesday', short: 'Tue', narrow: 'T' },
  { index: 3, long: 'Wednesday', short: 'Wed', narrow: 'W' },
  { index: 4, long: 'Thursday', short: 'Thu', narrow: 'H' },
  { index: 5, long: 'Friday', short: 'Fri', narrow: 'F' },
  { index: 6, long: 'Saturday', short: 'Sat', narrow: 'S' }
]

export const hours = [
  { index: 0, digits: '00' },
  { index: 1, digits: '01' },
  { index: 2, digits: '02' },
  { index: 3, digits: '03' },
  { index: 4, digits: '04' },
  { index: 5, digits: '05' },
  { index: 6, digits: '06' },
  { index: 7, digits: '07' },
  { index: 8, digits: '08' },
  { index: 9, digits: '09' },
  { index: 10, digits: '10' },
  { index: 11, digits: '11' },
  { index: 12, digits: '12' },
  { index: 13, digits: '13' },
  { index: 14, digits: '14' },
  { index: 15, digits: '15' },
  { index: 16, digits: '16' },
  { index: 17, digits: '17' },
  { index: 18, digits: '18' },
  { index: 19, digits: '19' },
  { index: 20, digits: '20' },
  { index: 21, digits: '21' },
  { index: 22, digits: '22' },
  { index: 23, digits: '23' }
]

function checkInterval (ms) {
  if (typeof ms !== 'number' || !Number.isFinite(ms) || ms < 1 || ms > 2147483647) throw new RangeError(`Cron: invalid interval “${ms}”`)
  return ms
}

export class Cron extends EventEmitter {
  #interval
  #timeout
  #timeZone
  #days
  #hours

  constructor (interval, activeDays = weekdays.map(day => day.index), activeHours = hours.map(hour => hour.index), timeZone) {
    super()
    this.#interval = checkInterval(interval)
    // validate and canonicalise once, so a bad zone fails here rather than on the first tick
    if (timeZone !== undefined) this.#timeZone = Temporal.Now.zonedDateTimeISO(timeZone).timeZoneId
    this.days = activeDays
    this.hours = activeHours
    this.#timeout = setInterval(this.#emit.bind(this), this.#interval)
  }

  #emit () {
    const ms = Date.now() // not Temporal.Now, so that mocked timers can drive it
    const zdt = zoned(ms, this.#timeZone, 'Cron')
    if (this.#days.has(zdt.dayOfWeek % 7) && this.#hours.has(zdt.hour)) { // Temporal: Monday = 1 … Sunday = 7
      this.emit('cron', new Date(ms))
    }
  }

  close () {
    if (this.#timeout) {
      clearInterval(this.#timeout)
      this.#timeout = null
    }
  }

  get timeZone () {
    return this.#timeZone
  }

  get days () {
    return this.#days
  }

  set days (iterable) {
    this.#days = new Set(iterable)
  }

  get hours () {
    return this.#hours
  }

  set hours (iterable) {
    this.#hours = new Set(iterable)
  }

  get interval () {
    return this.#interval
  }

  set interval (ms) {
    this.#interval = checkInterval(ms)
    if (this.#timeout) {
      clearInterval(this.#timeout)
      this.#timeout = setInterval(this.#emit.bind(this), this.#interval)
    }
  }
}
