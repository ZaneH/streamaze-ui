import styled from '@emotion/styled'
import { LanyardContext } from 'components/Providers/LanyardProvider'
import { SubathonContext } from 'components/Providers/SubathonProvider'
import { useContext } from 'react'
import { secondsToHHMMSS } from 'utils/time'

const CountdownLabel = styled.div`
  font-size: 8rem;
  font-family: 'Inter';
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: #fff;
  text-align: center;

  position: relative;
  background: transparent;
  z-index: 5;

  &:before {
    content: attr(data-content);
    text-align: center;
    position: absolute;
    -webkit-text-stroke: 0.1em #000;
    left: auto;
    right: auto;
    z-index: -1;
  }
`

const Countdown = () => {
  const { timeRemaining } = useContext(SubathonContext)
  const { kv } = useContext(LanyardContext)

  if (kv?.is_subathon_active !== 'true') {
    return null
  }

  const timeRemainingString = secondsToHHMMSS(timeRemaining)

  return (
    <CountdownLabel
      className="countdown-label"
      data-content={timeRemainingString}
    >
      {timeRemainingString}
    </CountdownLabel>
  )
}

export default Countdown
