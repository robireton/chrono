import { datetag, timestamp, dateFromUnix, unixTime } from './chrono.js'

const ms = (new Date(2021, 1, 11, 16, 7, 48, 989)).getTime()
let errors = 0

const dt = datetag(ms)
const correctDatetag = '2021-02-11'
if (dt !== correctDatetag) {
  errors++
  console.log(`datetag returned '${dt}' instead of '${correctDatetag}'`)
}

const ts = timestamp(ms)
const correctTimestamp = '2021-02-11 16:07:48'
if (ts !== correctTimestamp) {
  errors++
  console.log(`timestamp returned '${ts}' instead of '${correctTimestamp}'`)
}

const ud = dateFromUnix()
if (ud !== null) {
  errors++
  console.log('dateFromUnix() should return null')
}

const nd = dateFromUnix(null)
if (nd !== null) {
  errors++
  console.log('dateFromUnix(null) should return null')
}

const s = Math.floor(ms / 1000)
const iso = '2021-02-11T21:07:48.000Z'
const d = dateFromUnix(s)
if (d.toISOString() !== iso) {
  errors++
  console.log(`dateFromUnix(${s}) should return a date with ISO string ‘${iso}’`)
}

const ufd = unixTime(d)
if (ufd !== s) {
  errors++
  console.log(`unixTime(${d.toISOString()}:date) should return ${s}`)
}

const ufn = unixTime(ms)
if (ufn !== s) {
  errors++
  console.log(`unixTime(${ms}:number) should return ${s}`)
}

if (errors > 0) console.error('there were errors')
process.exit(errors)
