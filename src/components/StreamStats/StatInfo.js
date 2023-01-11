import { Flex, Text } from '@mantine/core'
import { SocialIcon } from 'react-social-icons'

const StatInfo = ({ network, label, image }) => {
  return (
    <Flex>
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
      <Text size={18} ml="sm" color="white" weight={800}>
        {label}
      </Text>
    </Flex>
  )
}

export default StatInfo
