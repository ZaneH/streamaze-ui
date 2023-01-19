import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Box, Center, Flex, Loader, Text, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useContext, useEffect } from 'react'
import useWebSocket from 'react-use-websocket'
import { Virtuoso } from 'react-virtuoso'
import { ConfigContext } from '../Providers/ConfigProvider'
import { DonationContext } from '../Providers/DonationProvider'

const { REACT_APP_API_2_WS_URL } = process.env

const Item = styled.div`
  margin: 12px 32px;
`

const List = styled.div`
  & > div:first-of-type {
    margin-top: 32px;
  }

  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`

const Scroller = styled.div`
  /** disable scrollbars */
  &::-webkit-scrollbar {
    display: none;
  }
`

const Footer = styled.div`
  height: 24px;
`

const AnimatedDiv = styled.div`
  opacity: 1;
  border-radius: 3px;
  border: 5px solid #dee2e6;
  padding: 18px 24px;
  color: white;

  ${({ isAnimated }) =>
    isAnimated &&
    css`
      animation-name: fadeIn;
      animation-duration: 0.5s;
      animation-timing-function: ease-in;
      animation-iteration-count: 1;

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `}
`

const DonationLog = () => {
  const { slobsConfig } = useContext(ConfigContext)
  const { donations, setDonations, donationIndex } = useContext(DonationContext)
  const streamToken = slobsConfig?.streamToken
  // TODO: Add voice back
  // const ttsVoice = slobsConfig?.ttsVoice

  // Donations websocket
  const donationsWS = useWebSocket(`${REACT_APP_API_2_WS_URL}`, {
    retryOnError: true,
    reconnectInterval: 10000,
    shouldReconnect: () => true,
    onError: () => {
      showNotification({
        title: 'Donations Error',
        message: "Couldn't connect to donations server.",
        color: 'red',
      })
    },
    onOpen: () => {
      const params = {}
      if (streamToken) {
        params['streamToken'] = streamToken
      }

      if (slobsConfig?.tiktokUsername) {
        params['tiktokUsername'] = slobsConfig?.tiktokUsername
      }

      donationsWS.sendMessage(JSON.stringify(params))
    },
  })

  const {
    lastJsonMessage: lastDonationJsonMessage,
    readyState: donationsReadyState,
  } = donationsWS

  // send message to websocket every 20s
  useEffect(() => {
    const donationInterval = setInterval(() => {
      if (streamToken || slobsConfig?.tiktokUsername) {
        donationsWS.sendMessage('ping')
      }
    }, 20000)

    return () => {
      clearInterval(donationInterval)
    }
  }, [donationsWS, streamToken, slobsConfig?.tiktokUsername])

  useEffect(() => {
    if (lastDonationJsonMessage) {
      try {
        setDonations((prev) => [...prev, lastDonationJsonMessage])
      } catch {
        console.log('Error parsing donation message', lastDonationJsonMessage)
      }
    }
  }, [lastDonationJsonMessage, setDonations])

  if (donations.length === 0 && donationsReadyState !== 1) {
    return (
      <Center my="lg">
        <Loader />
      </Center>
    )
  } else if (donations.length === 0 && donationsReadyState === 1) {
    return (
      <Box my="lg" mx="36px">
        <Text color="dimmed" size="lg">
          No donations yet...
        </Text>
      </Box>
    )
  } else if (donations.length > 0 && donationIndex === -1) {
    return (
      <Box my="lg" mx="36px">
        <Text color="dimmed" size="lg">
          You have <b>new</b> donations! Press the Play button to see them.
        </Text>
      </Box>
    )
  }

  return (
    <Virtuoso
      style={{ height: '100%' }}
      // data is reversed, and only up to the donationIndex
      data={donations.slice(0, donationIndex).reverse()}
      totalCount={donations.slice(0, donationIndex).reverse().length}
      components={{
        Item,
        List,
        Scroller,
        Footer,
      }}
      itemContent={(i, donation) => {
        const { data = {}, type } = donation
        const { id: eventId } = data
        const isTikTokGift = type === 'tiktok_gift'

        if (isTikTokGift) {
          const {
            gift_name: giftName,
            gift_cost: giftCost,
            gift_repeat_count: giftRepeatCount,
            name: senderName,
          } = data

          return (
            <AnimatedDiv key={eventId} isAnimated={i === 0}>
              <Flex direction="column" gap="4px">
                <Flex align="center" justify="space-between">
                  <Title size="h3">{senderName}</Title>
                  <Text size="lg" weight={700} align="right">
                    {giftRepeatCount ?? 1}x {giftName}
                    {giftRepeatCount > 0}
                  </Text>
                </Flex>
              </Flex>
            </AnimatedDiv>
          )
        }

        const { name, message, amount } = data
        const bits = amount?.bits
        const months = amount?.months
        const currency = amount
        const isFollow = type === 'follow'

        let isBits
        let isSub
        let isCurrency

        // Chose how to display the amount
        if (typeof bits !== 'undefined') {
          isBits = true
        } else if (typeof months !== 'undefined') {
          isSub = true
        } else if (typeof currency !== 'undefined') {
          isCurrency = true
        }

        return (
          <AnimatedDiv key={eventId} isAnimated={i === 0}>
            <Flex direction="column" gap="4px">
              <Flex align="center" justify="space-between">
                <Title size="h3">{name}</Title>
                {isBits && (
                  <Text size="lg" weight={700}>
                    {bits} bits
                  </Text>
                )}
                {isSub && (
                  <Text size="lg" weight={700}>
                    {`${months} month${months > 1 ? 's' : ''} sub`}
                  </Text>
                )}
                {isCurrency && (
                  <Text size="lg" weight={700}>
                    {currency.replace(/\.00$/, '')}
                  </Text>
                )}
                {isFollow && (
                  <Text size="lg" weight={700}>
                    Followed
                  </Text>
                )}
              </Flex>
              <Flex>
                <Text size="1.15em">{message}</Text>
              </Flex>
            </Flex>
          </AnimatedDiv>
        )
      }}
    />
  )
}

export default DonationLog
