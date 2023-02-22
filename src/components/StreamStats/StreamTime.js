import { useInterval } from '@mantine/hooks'
import { ReactComponent as ClockIcon } from 'clock-icon.svg'
import { LanyardContext } from 'components/Providers/LanyardProvider'
import { useContext, useEffect, useState } from 'react'
import { secondsToHHMMSS } from 'utils/time'
import StatInfo from './StatInfo'
import StreamTimeModal from './StreamTimeModal'

const StreamTime = () => {
  const [showStreamTimeModal, setShowStreamTimeModal] = useState(false)
  const { kv } = useContext(LanyardContext)
  const startTime = parseInt(kv?.actual_stream_start_time)
  const [seconds, setSeconds] = useState(
    parseInt(Date.now() / 1000) - startTime
  )

  const tickInterval = useInterval(() => {
    setSeconds((sec) => sec + 1)
  }, 1000)

  useEffect(() => {
    tickInterval.start()
    return tickInterval.stop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    tickInterval.stop()
    setSeconds(parseInt(Date.now() / 1000) - startTime)
    tickInterval.start()
  }, [kv?.actual_stream_start_time, tickInterval, startTime])

  return (
    <>
      <StatInfo
        image={<ClockIcon style={{ width: 26, height: 26 }} />}
        label={secondsToHHMMSS(seconds)}
        onClick={() => {
          setShowStreamTimeModal(true)
        }}
      />
      <StreamTimeModal
        isOpen={showStreamTimeModal}
        onClose={() => setShowStreamTimeModal(false)}
      />
    </>
  )
}

export default StreamTime
