/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import moment from 'moment'

export function secondsToHHMMSS(secs) {
  var sec_num = parseInt(secs, 10)
  if (sec_num <= 0) {
    return '00:00'
  }

  var hours = Math.floor(sec_num / 3600)
  var minutes = Math.floor(sec_num / 60) % 60
  var seconds = sec_num % 60

  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? '0' + v : v))
    .filter((v, i) => v !== '00' || i > 0)
    .join(':')
}

export function calculateTimeRemaining(
  subathonSecondsAdded,
  subathonStartTime,
  subathonStartMinutes
) {
  const startTimeUnix =
    moment(subathonStartTime).utc(true).unix() + subathonStartMinutes * 60
  const currentTimeUnix = moment().utc(true).unix()

  const seconds = startTimeUnix - currentTimeUnix + subathonSecondsAdded

  return seconds
}
