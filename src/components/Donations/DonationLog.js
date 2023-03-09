import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Box, Center, Flex, Loader, Text, Title } from '@mantine/core'
import { useContext } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { DonationContext } from '../Providers/DonationProvider'
import MediaCard from './MediaCard'
import SuperChatCard from './SuperChatCard'

const { REACT_APP_API_2_WS_URL, REACT_APP_EXCHANGE_RATE_API_URL } = process.env

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
  const { donations, donationIndex, setDonationIndex } =
    useContext(DonationContext)
  // TODO: Add voice back
  // const ttsVoice = slobsConfig?.ttsVoice

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
      style={{ height: '100%' }}
      data={donations.slice(0, donationIndex)}
      totalCount={donations.slice(0, donationIndex).length}
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
        const isMediaShare = type === 'mediaShareEvent'

        if (isTikTokGift) {
          const {
            gift_name: giftName,
            gift_cost: giftCost, // TODO: Use this, it is the diamond count per gift
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
        const isMembershipGift = type === 'membershipGift'

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

        if (isMediaShare) {
          const {
            action_by: actionBy,
            donation_id: donationId,
            media_link: mediaUrl,
            media_title: mediaTitle,
            duration,
          } = data

          return (
            <MediaCard
              key={eventId}
              url={mediaUrl}
              donationId={donationId}
              isAnimated={i === 0}
              duration={parseFloat(duration ?? 0)}
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

        if (isMembershipGift || isCurrency || type === 'superchat') {
          return (
            <SuperChatCard
              key={eventId}
              donation={donation}
              isAnimated={i === 0}
              onClick={() => {
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
