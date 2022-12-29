import { datetag, timestamp } from './chrono.js'

const date = (new Date(2021, 1, 11, 16, 7, 48, 989)).getTime()
let errors = 0

const dt = datetag(date)
const correctDatetag = '2021-02-11'
if (dt !== correctDatetag) {
  errors++
  console.log(`chrono.datetag returned '${dt}' instead of '${correctDatetag}'`)
}

const ts = timestamp(date)
const correctTimestamp = '2021-02-11 16:07:48'
if (ts !== correctTimestamp) {
  errors++
  console.log(`chrono.timestamp returned '${ts}' instead of '${correctTimestamp}'`)
}

if (errors > 0) console.error('there were errors')
process.exit(errors)
