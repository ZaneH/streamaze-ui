// |Amount Range|Color|Time Displayed (in Ticker)|Max Characters|
// |---|---|---|---|
// |$1.00 - $1.99|#1747A4 (Blue)|0s|0|
// |$2.00 - $4.99|#44E4FF (Light blue)|0s|50|
// |$5.00 - $9.99|#4BE8B2 (Green)|2m|150|
// |$10.00 - $19.99|#FBD900 (Yellow)|5m|200|
// |$20.00 - $49.99|#EF7E00 (Orange)|10m|225|
// |$50.00 - $99.99|#E12866 (Magenta)|30m|250|
// |$100.00 - $199.99|#DE2A1A (Red)|1hr|270|
// |$200.00 - $299.99|#DE2A1A (Red)|2hr|290|
// |$300.00 - $399.99|#DE2A1A (Red)|3hr|310|
// |$400.00 - $499.99|#DE2A1A (Red)|4hr|330|
// |$500.00+|#DE2A1A (Red)|5hr|350|

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Avatar, Box, Flex, Text } from '@mantine/core'

/**
 * Calculate the colors for a given super chat amount.
 * Returns the background color [0], the header color (darkened) [1],
 * and the text color [2].
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
    return ['#1747A4', '#FFFFFF']
  }
}

const YTCard = styled.div`
  border-radius: 4px;
  ${({ bg }) => `background-color: ${bg};`}

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

export default function SuperChatCard({ donation, isAnimated }) {
  const {
    data: { amount, message, name, pfp },
  } = donation

  const [bgColor, headerBgColor, textColor] = getSuperChatColors(amount)

  return (
    <YTCard bg={bgColor} isAnimated={isAnimated}>
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
                {amount}
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
