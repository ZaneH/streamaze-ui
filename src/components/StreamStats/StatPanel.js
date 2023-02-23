import { Flex } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { LanyardContext } from 'components/Providers/LanyardProvider'
import { SubathonContext } from 'components/Providers/SubathonProvider'
import { ReactComponent as DollarSignIcon } from 'dollar-sign-icon.svg'
import { ReactComponent as FlagIcon } from 'flag-icon.svg'
import { useContext, useState } from 'react'
import { secondsToHHMMSS } from 'utils/time'
import { ReactComponent as BitRateIcon } from '../../bit-rate-icon.svg'
import { HopContext } from '../Providers/HopProvider'
import { StatContext } from '../Providers/StatProvider'
import ExpenseModal from './ExpenseModal'
import StatInfo from './StatInfo'
import StreamTime from './StreamTime'
import SubathonModal from './SubathonModal'

const StatPanel = () => {
  const { ytViewers, tiktokViewers, isYTLoading, isTikTokLoading } =
    useContext(StatContext)
  const { bitrate, isLive } = useContext(HopContext)
  const { kv } = useContext(LanyardContext)
  const { timeRemaining } = useContext(SubathonContext)
  const { subathonConfig } = useContext(ConfigContext)
  const [showMoneyModal, setShowMoneyModal] = useState(false)
  const [showSubathonModal, setShowSubathonModal] = useState(false)

  return (
    <>
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
        <Flex gap="md" style={{ flexWrap: 'wrap' }}>
          <StatInfo
            image={<BitRateIcon style={{ width: 26, height: 26 }} />}
            label={bitrate ? `${bitrate} Kbps` : 'Offline'}
          />
          {kv?.net_profit ? (
            <StatInfo
              onClick={() => {
                if (kv?.net_profit) {
                  setShowMoneyModal(true)
                } else {
                  showNotification({
                    title: 'Error',
                    message: 'Lanyard is not ready...',
                    color: 'yellow',
                  })
                }
              }}
              image={<DollarSignIcon style={{ width: 26, height: 26 }} />}
              label={parseFloat(kv?.net_profit)
                .toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })
                .replace('.00', '')}
            />
          ) : null}

          {subathonConfig?.isSubathonActive && (
            <StatInfo
              image={<FlagIcon style={{ width: 26, height: 26 }} />}
              label={
                kv?.subathon_ended === 'true'
                  ? '[ENDED]'
                  : secondsToHHMMSS(timeRemaining)
              }
              onClick={() => {
                setShowSubathonModal(true)
              }}
            />
          )}

          {isLive && <StreamTime />}
        </Flex>
      </Flex>

      <ExpenseModal
        isOpen={showMoneyModal}
        onClose={() => {
          setShowMoneyModal(false)
        }}
      />

      <SubathonModal
        isOpen={showSubathonModal}
        onClose={() => {
          setShowSubathonModal(false)
        }}
      />
    </>
  )
}

export default StatPanel
