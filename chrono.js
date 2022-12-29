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
