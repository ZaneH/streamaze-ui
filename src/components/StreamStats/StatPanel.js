import { Flex } from '@mantine/core'
import { useContext } from 'react'
import { ReactComponent as BitRateIcon } from '../../bit-rate-icon.svg'
import { ReactComponent as DollarSignIcon } from 'dollar-sign-icon.svg'
import { HopContext } from '../Providers/HopProvider'
import { StatContext } from '../Providers/StatProvider'
import StatInfo from './StatInfo'
import { LanyardContext } from 'components/Providers/LanyardProvider'

const StatPanel = () => {
  const { ytViewers, tiktokViewers, isYTLoading, isTikTokLoading } =
    useContext(StatContext)
  const { lanyardData } = useContext(LanyardContext)
  const { bitrate } = useContext(HopContext)

  const netProfit = lanyardData?.kv?.net_profit
  console.log(lanyardData)

  return (
    <Flex direction="column" gap="xs">
      <Flex gap="md" style={{ flexWrap: 'wrap' }}>
        {ytViewers || isYTLoading ? (
          <StatInfo
            network="youtube"
            label={
              isYTLoading ? 'Loading' : parseInt(ytViewers).toLocaleString()
            }
          />
        ) : null}
        {/* TODO: Implement Twitch /viewers endpoint */}
        {/* <StatInfo network="twitch" label="661" /> */}
        {tiktokViewers || isTikTokLoading ? (
          <StatInfo
            network="tiktok"
            label={
              isTikTokLoading
                ? 'Loading'
                : parseInt(tiktokViewers).toLocaleString()
            }
          />
        ) : null}
      </Flex>
      <Flex gap="md">
        <StatInfo
          image={<BitRateIcon style={{ width: 26, height: 26 }} />}
          label={bitrate ? `${bitrate} Kbps` : 'Offline'}
        />
        {netProfit ? (
          <StatInfo
            image={<DollarSignIcon style={{ width: 26, height: 26 }} />}
            label={parseFloat(netProfit)
              .toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })
              .replace('.00', '')}
          />
        ) : null}
      </Flex>
    </Flex>
  )
}

export default StatPanel
