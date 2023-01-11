import { Flex } from '@mantine/core'
import { useContext } from 'react'
import { ReactComponent as BitRateIcon } from '../../bit-rate-icon.svg'
import { StatContext } from '../Providers/StatProvider'
import StatInfo from './StatInfo'

const StatPanel = () => {
  const { ytViewers, tiktokViewers } = useContext(StatContext)
  return (
    <Flex direction="column" gap="xs">
      <Flex gap="md" style={{ flexWrap: 'wrap' }}>
        {ytViewers && (
          <StatInfo
            network="youtube"
            label={parseInt(ytViewers).toLocaleString()}
          />
        )}
        {/* TODO: Implement Twitch /viewers endpoint */}
        {/* <StatInfo network="twitch" label="661" /> */}
        {tiktokViewers && (
          <StatInfo
            network="tiktok"
            label={parseInt(tiktokViewers).toLocaleString()}
          />
        )}
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
