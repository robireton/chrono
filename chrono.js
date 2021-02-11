'use strict'

// returns time (default current) as 'YYYY-MM-DD HH:MM:SS' string
module.exports.timestamp = (now = Date.now()) => {
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

// returns date (default current) as 'YYYY-MM-DD'
module.exports.datetag = (now = new Date()) => [now.getFullYear().toString(), (now.getMonth() + 1).toString().padStart(2, '0'), now.getDate().toString().padStart(2, '0')].join('-')
