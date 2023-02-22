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
  text-shadow: 0 0 10px #000;
`

const Countdown = () => {
  const { timeRemaining } = useContext(SubathonContext)
  const { kv } = useContext(LanyardContext)

  if (kv?.is_subathon_active !== 'true') {
    return null
  }

  return (
    <CountdownLabel className="countdown-label">
      {secondsToHHMMSS(timeRemaining)}
    </CountdownLabel>
  )
}

export default Countdown
