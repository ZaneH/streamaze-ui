import styled from '@emotion/styled'
import { Space } from '@mantine/core'
import { useInterval } from '@mantine/hooks'
import { DonationContext } from 'components/Providers/DonationProvider'
import { useContext, useEffect, useState } from 'react'
import Marquee from 'react-fast-marquee'
import { useParams } from 'react-router-dom'
import { useLanyardWS } from 'use-lanyard'

const TickerContainer = styled.div`
  height: 100px;
  width: 100%;
  color: white;
  font-size: 3em;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
`

const TickerWidget = () => {
  const { id } = useParams()
  const data = useLanyardWS(id)
  const kv = data?.kv
  const { donations } = useContext(DonationContext)
  const [visibleDonations, setVisibleDonations] = useState([])
  const [tickerData, setTickerData] = useState(null)

  useEffect(() => {
    setVisibleDonations((prev) => [donations[donations.length - 1], ...prev])
    if (!donoInterval.active) {
      donoInterval.start()
    }
  }, [donations, setVisibleDonations])

  const donoInterval = useInterval(() => {
    if (visibleDonations && visibleDonations.length > 0) {
      setVisibleDonations((prev) => prev.slice(0, prev.length - 1))
    } else {
      donoInterval.stop()
      setVisibleDonations([])
    }
  }, 6000)

  useEffect(() => {
    donoInterval.start()
    return donoInterval.stop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    try {
      if (!kv?.ticker) {
        return
      }

      setTickerData(kv?.ticker)
    } catch (error) {
      console.error(error)
    }
  }, [kv, setTickerData])

  if (!tickerData) {
    return null
  }

  const visibleDonation = visibleDonations?.[0]
  const { type } = visibleDonation || {}
  const { metadata } = visibleDonation?.data || {}
  const isKickSubscription = type === 'kick_subscription'
  const isKickGift = type === 'kick_gifted_subscription'

  return (
    <TickerContainer>
      <Marquee gradient={false} speed={80}>
        {visibleDonation ? (
          <span>
            {visibleDonation?.data?.name}{' '}
            {type === 'membershipGift' &&
              `${metadata?.gift_count}x ${metadata?.gift_level}s`}
            {type === 'subscription' && metadata
              ? `became a member for ${metadata.months} month${
                  metadata.months > 1 ? 's' : ''
                }`
              : (type === 'superchat' || type === 'donation') &&
                'donated to the stream'}
            {isKickSubscription &&
              `subscribed on Kick for ${metadata.months} month${
                metadata.months > 1 ? 's' : ''
              }`}
            {isKickGift &&
              `gifted ${metadata?.months} subscription${
                metadata?.months > 1 ? 's' : ''
              } on Kick`}
          </span>
        ) : (
          tickerData
        )}
        &nbsp;&nbsp;&nbsp;
      </Marquee>
    </TickerContainer>
  )
}

export default TickerWidget
