import { Flex } from '@mantine/core'
import { useContext } from 'react'
import { ReactComponent as BitRateIcon } from '../../bit-rate-icon.svg'
import { StatContext } from '../Providers/StatProvider'
import StatInfo from './StatInfo'

const StatPanel = () => {
  const { ytViewers, tiktokViewers, isYTLoading, isTikTokLoading } =
    useContext(StatContext)
  return (
    <Flex direction="column" gap="xs">
      <Flex gap="md" style={{ flexWrap: 'wrap' }}>
        {(ytViewers || isYTLoading) && (
          <StatInfo
            network="youtube"
            label={
              isYTLoading ? 'Loading' : parseInt(ytViewers).toLocaleString()
            }
          />
        )}
        {/* TODO: Implement Twitch /viewers endpoint */}
        {/* <StatInfo network="twitch" label="661" /> */}
        {(tiktokViewers || isTikTokLoading) && (
          <StatInfo
            network="tiktok"
            label={
              isTikTokLoading
                ? 'Loading'
                : parseInt(tiktokViewers).toLocaleString()
            }
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
