export function secondsToHHMMSS(seconds) {
  var sec_num = parseInt(seconds, 10)
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
