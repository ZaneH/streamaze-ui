import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Avatar, Box, Flex, Text } from '@mantine/core'

/**
 * Calculate the colors for a given super chat amount.
 * Returns the background color [0], the header color (darkened) [1],
 * and the text color [2].
 * https://stackoverflow.com/questions/67161041/what-are-the-ui-colors-for-the-youtube-superchat-tiers/75343187#75343187
 * @param {string|number} amount
 * @returns {[string, string, string]}
 */
const getSuperChatColors = (amount) => {
  if (typeof amount === 'string') {
    amount = parseFloat(amount.replace(/[^\d.-]/g, ''))
  }

  if (amount >= 1 && amount <= 1.99) {
    return ['#1565C0', '#1565C0', '#FFFFFF']
  } else if (amount >= 2 && amount <= 4.99) {
    return ['#00E5FF', '#00B8D4', '#000000']
  } else if (amount >= 5 && amount <= 9.99) {
    return ['#0F9D58', '#0A8043', '#000000']
  } else if (amount >= 10 && amount <= 19.99) {
    return ['#FFCA28', '#FFB300', '#000000']
  } else if (amount >= 20 && amount <= 49.99) {
    return ['#F57C00', '#E65100', '#FFFFFF']
  } else if (amount >= 50 && amount <= 99.99) {
    return ['#E91E63', '#C2185B', '#FFFFFF']
  } else if (amount >= 100 && amount <= 199.99) {
    return ['#E62117', '#D00000', '#FFFFFF']
  } else if (amount >= 200 && amount <= 299.99) {
    return ['#E62117', '#D00000', '#FFFFFF']
  } else if (amount >= 300 && amount <= 399.99) {
    return ['#E62117', '#D00000', '#FFFFFF']
  } else if (amount >= 400 && amount <= 499.99) {
    return ['#E62117', '#D00000', '#FFFFFF']
  } else if (amount >= 500) {
    return ['#E62117', '#D00000', '#FFFFFF']
  } else {
    console.error('Invalid amount for superchat', amount)
    return ['#1565C0', '#1565C0', '#FFFFFF']
  }
}

const YTCard = styled.div`
  border-radius: 4px;
  ${({ bg }) => `background-color: ${bg};`}

  opacity: 1;

  ${({ onClick }) => onClick && 'cursor: pointer;'}

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

export default function SuperChatCard({ donation, isAnimated, onClick }) {
  const {
    data: {
      amount,
      displayString,
      message,
      name,
      gift_count,
      gift_level,
      metadata,
    },
    type,
  } = donation || {}

  const [bgColor, headerBgColor, textColor] = getSuperChatColors(amount || 5)
  const pfp = metadata && metadata?.pfp

  return (
    <YTCard bg={bgColor} isAnimated={isAnimated} onClick={onClick}>
      <Flex direction="column">
        <Flex
          py="md"
          px="16px"
          gap="16px"
          style={{
            // 8% darker than the background color
            backgroundColor: headerBgColor,
            borderRadius: '4px',
          }}
        >
          <Avatar size="44px" radius="50%" src={pfp && pfp}>
            {!pfp && name?.[0]}
          </Avatar>
          <Flex direction="column" justify="center">
            <Box>
              <Text
                size="md"
                color={textColor}
                lh="1.1em"
                opacity="0.75"
                weight={500}
              >
                {name}
              </Text>
            </Box>
            <Box>
              <Text color={textColor} weight={700}>
                {type === 'membershipGift'
                  ? `${gift_count}x ${gift_level}s`
                  : type === 'subscription' && metadata
                  ? `Became a member for ${metadata.months} month${
                      metadata.months > 1 ? 's' : ''
                    }`
                  : displayString}
              </Text>
            </Box>
          </Flex>
        </Flex>
        {message && (
          <Box py="md" px="16px">
            <Text color={textColor} weight={500}>
              {message}
            </Text>
          </Box>
        )}
      </Flex>
    </YTCard>
  )
}
