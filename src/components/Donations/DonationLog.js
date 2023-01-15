import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Box, Center, Flex, Loader, Text, Title } from '@mantine/core'
import { useContext, useEffect } from 'react'
import useWebSocket from 'react-use-websocket'
import { Virtuoso } from 'react-virtuoso'
import { ConfigContext } from '../Providers/ConfigProvider'
import { DonationContext } from '../Providers/DonationProvider'

const { REACT_APP_API_WS_URL } = process.env

const Item = styled.div`
  margin: 12px 32px;
  padding: 18px 24px;

  border-radius: 3px;
  border: 5px solid #dee2e6;
  color: white;
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
  const { donations, setDonations, setTTSQueue } = useContext(DonationContext)
  const streamToken = slobsConfig?.streamToken
  const ttsVoice = slobsConfig?.ttsVoice

  const qs = new URLSearchParams()
  qs.append('token', streamToken)
  if (ttsVoice) {
    qs.append('voice', ttsVoice)
  }

  const donationsWS = useWebSocket(
    `${REACT_APP_API_WS_URL}/streamlabs/donations?${qs.toString()}`
  )
  const { lastMessage, readyState } = donationsWS

  // send message to websocket every 20s
  useEffect(() => {
    const interval = setInterval(() => {
      if (streamToken) {
        donationsWS.sendMessage('ping')
      }
    }, 20000)

    return () => clearInterval(interval)
  }, [donationsWS, streamToken])

  useEffect(() => {
    if (lastMessage) {
      try {
        const newEvent = JSON.parse(lastMessage.data)
        setDonations((donations) => [newEvent, ...donations])

        // Add donation to TTS queue if tts_url is in data
        if (newEvent?.data?.tts_url) {
          setTTSQueue((ttsQueue) => [...ttsQueue, newEvent.data.tts_url])
        }
      } catch {
        console.log('Error parsing donation message', lastMessage.data)
      }
    }
  }, [lastMessage, setTTSQueue, setDonations])

  if (donations.length === 0 && readyState !== 1) {
    return (
      <Center my="lg">
        <Loader />
      </Center>
    )
  } else if (donations.length === 0 && readyState === 1) {
    return (
      <Box my="lg" mx="36px">
        <Text color="dimmed" size="lg">
          No donations yet...
        </Text>
      </Box>
    )
  }

  return (
    <Virtuoso
      style={{ height: '100%' }}
      data={donations}
      totalCount={donations.length}
      components={{
        Item,
        List,
        Scroller,
        Footer,
      }}
      itemContent={(i, donation) => {
        const { data, type } = donation
        const { name, message, amount, event_id } = data

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
          <AnimatedDiv key={event_id} isAnimated={i === 0}>
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
                    {currency}
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
