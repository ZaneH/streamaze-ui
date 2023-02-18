import styled from '@emotion/styled'
import { SubathonContext } from 'components/Providers/SubathonProvider'
import { useContext } from 'react'
import { secondsToHHMMSS } from 'utils/time'

const CountdownLabel = styled.div`
  font-size: 8rem;
  font-weight: 600;
  font-family: 'Courier New', Courier, monospace;
  color: #fff;
  text-align: right;
  text-shadow: 0 0 10px #000;
  letter-spacing: -0.05em;
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
