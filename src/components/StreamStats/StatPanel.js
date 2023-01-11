import { Flex, useMantineTheme } from '@mantine/core'
import StatInfo from './StatInfo'
import { ReactComponent as BitRateIcon } from '../../bit-rate-icon.svg'

const StatPanel = () => {
  const { colors } = useMantineTheme()

  return (
    <Flex direction="column" gap="xs">
      <Flex gap="md" style={{ flexWrap: 'wrap' }}>
        <StatInfo network="youtube" label="1,044" />
        <StatInfo network="twitch" label="661" />
        <StatInfo network="tiktok" label="760" />
      </Flex>
      <Flex gap="md">
        <StatInfo
          image={<BitRateIcon style={{ width: 26, height: 26 }} />}
          label="12,345 Kbps"
        />
      </Flex>
    </Flex>
  )
}

export default StatPanel
