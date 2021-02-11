'use strict'
const chrono = require('./chrono.js')

const date = new Date(2021, 1, 11, 16, 7, 48, 989)
let errors = 0

const datetag = chrono.datetag(date)
const correctDatetag = '2021-02-11'
if (datetag !== correctDatetag) {
  errors++
  console.log(`chrono.datetag returned '${datetag}' instead of '${correctDatetag}'`)
}

const timestamp = chrono.timestamp(date)
const correctTimestamp = '2021-02-11 16:07:48'
if (timestamp !== correctTimestamp) {
  errors++
  console.log(`chrono.timestamp returned '${timestamp}' instead of '${correctTimestamp}'`)
}

if (errors > 0) console.error('there were errors')
process.exit(errors)
