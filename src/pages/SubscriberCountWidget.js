/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import styled from '@emotion/styled'
import { ProviderProvider } from 'components/Providers'
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
  letter-spacing: -0.04em;
`

const ProvidersWrapper = () => {
  return (
    <ProviderProvider>
      <SubscriberCountWidget />
    </ProviderProvider>
  )
}

const SubscriberCountWidget = () => {
  const { platform } = useParams()
  const isAll = platform === 'all'
  const isKick = platform === 'kick'
  const isYouTube = platform === 'youtube'

  const { allSubs, kickSubs, youtubeSubs, statsOffset } =
    useContext(StatContext)

  const {
    kick_gifted_subscription: kickGiftedSubscriptionOffset = 0,
    subscription: youtubeSubscriptionOffset = 0,
    kick_subscription: kickSubscriptionOffset = 0,
  } = statsOffset || {}
  const totalOffset =
    kickGiftedSubscriptionOffset +
    youtubeSubscriptionOffset +
    kickSubscriptionOffset
  const kickOffset = kickGiftedSubscriptionOffset + kickSubscriptionOffset

  return (
    <NumberWidget>
      <b>
        Subs: {isAll ? `${allSubs + totalOffset} / 2500` : null}
        {isKick ? kickSubs + kickOffset : null}
        {isYouTube ? youtubeSubs + youtubeSubscriptionOffset : null}
      </b>
    </NumberWidget>
  )
}

export default ProvidersWrapper
