import styled from '@emotion/styled'
import { StatContext } from 'components/Providers/StatProvider'
import { useContext } from 'react'
import { useParams } from 'react-router-dom'

const NumberWidget = styled.div`
  font-size: 4rem;
  font-family: 'Inter';
  font-variant-numeric: tabular-nums;
  color: #fff;
  text-shadow: 0 0 10px #000;
  white-space: pre-wrap;
`

const SubscriberCountWidget = () => {
  const { platform } = useParams()
  const isAll = platform === 'all'
  const isKick = platform === 'kick'
  const isYouTube = platform === 'youtube'

  const { allSubs, kickSubs, youtubeSubs } = useContext(StatContext)
  return (
    <NumberWidget>
      <b>
        Sub Count: {isAll ? allSubs : null}
        {isKick ? kickSubs : null}
        {isYouTube ? youtubeSubs : null}
      </b>
    </NumberWidget>
  )
}

export default SubscriberCountWidget
