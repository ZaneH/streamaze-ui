import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Box, Center, Flex, Loader, Text, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useContext, useEffect } from 'react'
import useWebSocket from 'react-use-websocket'
import { Virtuoso } from 'react-virtuoso'
import { ConfigContext } from '../Providers/ConfigProvider'
import { DonationContext } from '../Providers/DonationProvider'

const { REACT_APP_API_WS_URL } = process.env

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
  const ttsVoice = slobsConfig?.ttsVoice

  const slQS = new URLSearchParams()
  slQS.append('token', streamToken)
  if (ttsVoice) {
    slQS.append('voice', ttsVoice)
  }

  const ttQS = new URLSearchParams()
  if (slobsConfig?.tiktokUsername) {
    ttQS.append('username', slobsConfig.tiktokUsername)
  }

  // Streamlabs donations websocket
  const slDonationsWS = useWebSocket(
    `${REACT_APP_API_WS_URL}/streamlabs/donations?${slQS.toString()}`,
    {
      retryOnError: true,
      reconnectInterval: 10000,
      onError: () => {
        showNotification({
          title: 'StreamLabs Donations Error',
          message: "Couldn't connect to StreamLabs for donations.",
          color: 'red',
        })
      },
    },
    !!streamToken
  )

  // TikTok donations websocket
  const ttDonationsWS = useWebSocket(
    `${REACT_APP_API_WS_URL}/tiktok/donations?${ttQS.toString()}`,
    {
      retryOnError: true,
      reconnectInterval: 10000,
      onError: () => {
        showNotification({
          title: 'TikTok Gifts Error',
          message: "Couldn't connect to TikTok for gifts.",
          color: 'red',
        })
      },
    },
    false
  )

  const { lastMessage: slLastMessage, readyState: slReadyState } = slDonationsWS
  const { lastMessage: ttLastMessage, readyState: ttReadyState } = ttDonationsWS

  // send message to websocket every 20s
  useEffect(() => {
    const slInterval = setInterval(() => {
      if (streamToken) {
        slDonationsWS.sendMessage('ping')
      }
    }, 20000)

    const ttInterval = setInterval(() => {
      if (slobsConfig?.tiktokUsername) {
        ttDonationsWS.sendMessage('ping')
      }
    }, 20000)

    return () => {
      clearInterval(slInterval)
      clearInterval(ttInterval)
    }
  }, [slDonationsWS, ttDonationsWS, streamToken, slobsConfig?.tiktokUsername])

  useEffect(() => {
    if (slLastMessage) {
      try {
        const newEvent = JSON.parse(slLastMessage.data)
        setDonations((prev) => [...prev, newEvent])
      } catch {
        console.log('Error parsing donation message', slLastMessage.data)
      }
    }
  }, [slLastMessage, setDonations])

  useEffect(() => {
    if (ttLastMessage) {
      try {
        const newEvent = JSON.parse(ttLastMessage.data)
        setDonations((prev) => [...prev, newEvent])
      } catch {
        console.log('Error parsing donation message', ttLastMessage.data)
      }
    }
  }, [ttLastMessage, setDonations])

  if (donations.length === 0 && slReadyState !== 1 && ttReadyState !== 1) {
    return (
      <Center my="lg">
        <Loader />
      </Center>
    )
  } else if (
    donations.length === 0 &&
    (slReadyState === 1 || ttReadyState === 1)
  ) {
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
        const { event_id: eventId } = data
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
