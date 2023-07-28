import styled from '@emotion/styled'
import { ProviderProvider } from 'components/Providers'
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

const ProvidersWrapper = () => {
  return (
    <ProviderProvider>
      <Countdown />
    </ProviderProvider>
  )
}

const Countdown = () => {
  const { timeRemaining, isSubathonActive } = useContext(SubathonContext)

  if (!isSubathonActive) {
    return (
      <CountdownLabel className="countdown-label" data-content="[ENDED]">
        [ENDED]
      </CountdownLabel>
    )
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

export default ProvidersWrapper
