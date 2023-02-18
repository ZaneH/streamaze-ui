import styled from '@emotion/styled'
import { SubathonContext } from 'components/Providers/SubathonProvider'
import { useContext } from 'react'
import { secondsToHHMMSS } from 'utils/time'

const CountdownLabel = styled.div`
  font-size: 8rem;
  font-family: 'Inter';
  font-variant-numeric: tabular-nums;
  color: #fff;
  text-align: right;
  text-shadow: 0 0 10px #000;
`

const Countdown = () => {
  const { timeRemaining } = useContext(SubathonContext)

  return (
    <CountdownLabel className="countdown-label">
      {secondsToHHMMSS(timeRemaining)}
    </CountdownLabel>
  )
}

export default Countdown
