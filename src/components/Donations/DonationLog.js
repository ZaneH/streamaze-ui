import { css } from '@emotion/react'
import styled from '@emotion/styled'
import {
  Box,
  Center,
  Flex,
  Loader,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { useCallback, useContext, useRef, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { DonationContext } from '../Providers/DonationProvider'
import MediaCard from './MediaCard'
import SuperChatCard from './SuperChatCard'
import useWebSocket from 'react-use-websocket'
import useStreamer from 'hooks/useStreamer'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { useInterval } from '@mantine/hooks'

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
  const { colors } = useMantineTheme()
  const { donations, donationIndex, setDonationIndex, setPrevDonationIndex } =
    useContext(DonationContext)
  const { userConfig, slobsConfig } = useContext(ConfigContext)
  const streamer = useStreamer(userConfig?.streamazeKey)
  const [isScrolling, setIsScrolling] = useState(false)
  const virtuosoRef = useRef(null)
  const { sendJsonMessage } = useWebSocket(
    `${process.env.REACT_APP_API_2_WS_URL}`,
    {
      onOpen: () => {
        sendJsonMessage({
          streamerId: streamer?.id,
          streamToken: streamer?.donations_config?.streamlabs_token,
          ttsService: slobsConfig?.ttsService || 'streamlabs',
          streamazeKey: userConfig?.streamazeKey,
        })
      },
      shouldReconnect: () => true,
      reconnectInterval: 3000,
    },
    !!streamer?.donations_config?.streamlabs_token &&
      !!streamer?.id &&
      !!userConfig?.streamazeKey
  )

  // TODO: Add voice back
  // const ttsVoice = slobsConfig?.ttsVoice

  const inactivityInterval = useInterval(() => {
    if (isScrolling) {
      setIsScrolling(false)
      virtuosoRef?.current?.scrollToIndex({
        index: 0,
        behavior: 'smooth',
      })
    }

    inactivityInterval.stop()
  }, 60 * 1000)

  const handleScroll = useCallback(() => {
    inactivityInterval.stop()
    inactivityInterval.start()
    setIsScrolling(true)
  }, [inactivityInterval])

  if (donations.length === 0) {
    return (
      <Center my="lg">
        <Loader />
      </Center>
    )
  } else if (donations.length === 0) {
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
      style={{ height: '100%', backgroundColor: colors.dark[9] }}
      data={donations.slice(0, donationIndex).reverse()}
      totalCount={donations.slice(0, donationIndex).reverse().length}
      ref={virtuosoRef}
      onScroll={() => handleScroll()}
      startReached={() => {
        setIsScrolling(false)
        inactivityInterval.stop()
      }}
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
        const isMediaShare =
          type === 'mediaShareEvent' || type === 'streamlabs_media'

        if (isTikTokGift) {
          const {
            gift_name: giftName,
            // gift_cost: giftCost,
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
        const isMembershipGift =
          type === 'membershipGift' || type === 'kick_gifted_subscription'
        const isRaid = type === 'kick_host'

        let isBits
        let isSub
        let isCurrency

        // Chose how to display the amount
        if (typeof bits !== 'undefined') {
          isBits = true
        } else if (
          typeof months !== 'undefined' ||
          type === 'subscription' ||
          type === 'kick_gifted_subscription' ||
          type === 'kick_subscription'
        ) {
          isSub = true
        } else if (typeof currency !== 'undefined') {
          isCurrency = true
        }

        if (isMediaShare) {
          const {
            action_by: actionBy,
            donation_id: donationId,
            media_link: mediaUrl,
            media_title: mediaTitle,
            duration,
            start_time: startTime,
          } = data.metadata || {}

          return (
            <MediaCard
              key={eventId}
              url={mediaUrl}
              donationId={donationId}
              isAnimated={i === 0}
              duration={parseFloat(duration ?? 0)}
              startTime={parseInt(startTime) ?? 0}
            >
              <Text mb="md">
                <b>{actionBy}</b> sent media
              </Text>
              <Text>
                <b>Title:</b> {mediaTitle}
              </Text>
              <Text>
                <b>Duration:</b> {parseFloat(duration ?? 0) / 1000}s
              </Text>
            </MediaCard>
          )
        }

        if (
          isMembershipGift ||
          isSub ||
          isCurrency ||
          type === 'superchat' ||
          type === 'donation'
        ) {
          return (
            <SuperChatCard
              key={eventId}
              donation={donation}
              isAnimated={i === 0}
              onClick={() => {
                setPrevDonationIndex(donationIndex)
                // set the donationIndex to the current index
                // keeping in mind that the donations are reversed
                setDonationIndex(donations.length - i - 1)
              }}
            />
          )
        }

        if (isRaid) {
          return (
            <SuperChatCard
              key={eventId}
              donation={donation}
              isAnimated={i === 0}
              onClick={() => {
                setPrevDonationIndex(donationIndex)
                // set the donationIndex to the current index
                // keeping in mind that the donations are reversed
                setDonationIndex(donations.length - i - 1)
              }}
            />
          )
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
