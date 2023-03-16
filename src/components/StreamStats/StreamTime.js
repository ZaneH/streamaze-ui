import { useInterval } from '@mantine/hooks'
import { ReactComponent as ClockIcon } from 'clock-icon.svg'
import { StatContext } from 'components/Providers/StatProvider'
import moment from 'moment'
import { useContext, useEffect, useState } from 'react'
import { secondsToHHMMSS } from 'utils/time'
import StreamTimeModal from '../Modals/StreamTimeModal'
import StatInfo from './StatInfo'

const StreamTime = () => {
  const [showStreamTimeModal, setShowStreamTimeModal] = useState(false)
  const { streamStartTime } = useContext(StatContext)
  const startTime = moment(streamStartTime).utc(true).unix()
  const [seconds, setSeconds] = useState(
    parseInt(moment().utc(true).unix()) - startTime
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
    setSeconds(parseInt(moment().utc(true).unix()) - startTime)
    tickInterval.start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamStartTime, startTime])

  return (
    <>
      <StatInfo
        tabularNums
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
