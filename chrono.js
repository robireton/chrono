export function timestamp (now = Date.now()) {
  const d = new Date(now)
  const p = {
    year: d.getFullYear(),
    month: 1 + d.getMonth(),
    date: d.getDate(),
    hour: d.getHours(),
    minute: d.getMinutes(),
    second: d.getSeconds()
  }

  return [
    [p.year, p.month, p.date].map(n => n.toString()).map(s => s.length < 2 ? `0${s}` : s).join('-'),
    [p.hour, p.minute, p.second].map(n => n.toString()).map(s => s.length < 2 ? `0${s}` : s).join(':')
  ].join(' ') // that’s a non-breaking space
}

export function datetag (now = Date.now()) {
  const d = new Date(now)
  return [d.getFullYear().toString(), (d.getMonth() + 1).toString().padStart(2, '0'), d.getDate().toString().padStart(2, '0')].join('-')
}

export function dateFromUnix (u) {
  if (u === null) return null
  if (typeof u === 'undefined') return null
  if (typeof u === 'number') return new Date(1000 * u)
  throw new TypeError(`dateFromUnix: I don’t know what to do with “${u}” (${typeof u})`)
}

export function unixTime (n = Date.now()) {
  if (n instanceof Date) n = n.valueOf()
  if (typeof n === 'number') return Math.floor(n / 1000)
  throw new TypeError(`unixTime: I don’t know what to do with “${n}” (${typeof n})`)
}

export function localDate (date) {
  const [year, month, day] = date.split(/\D+/, 3).map(s => Number.parseInt(s))
  return new Date(year, month - 1, day || 1)
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
