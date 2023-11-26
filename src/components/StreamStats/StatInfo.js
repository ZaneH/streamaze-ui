/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import { Flex, Text } from '@mantine/core'
import { SocialIcon } from 'react-social-icons'

const StatInfo = ({
  network,
  label,
  image,
  onClick,
  tabularNums = false,
  textSize = 18,
}) => {
  return (
    <Flex
      onClick={onClick}
      align="center"
      style={{
        cursor: onClick ? 'pointer' : 'initial',
        ...(tabularNums && { fontVariantNumeric: 'tabular-nums' }),
      }}
    >
      {image ? (
        image
      ) : (
        <SocialIcon
          network={network}
          fgColor="white"
          style={{
            width: 26,
            height: 26,
          }}
        />
      )}
      <Text size={textSize} ml="sm" color="white" weight={800}>
        {label}
      </Text>
    </Flex>
  )
}

export default StatInfo
