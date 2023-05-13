import { Flex } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { SubathonContext } from 'components/Providers/SubathonProvider'
import { ReactComponent as DollarSignIcon } from 'dollar-sign-icon.svg'
import { ReactComponent as FlagIcon } from 'flag-icon.svg'
import { ReactComponent as KickIcon } from 'kick-logo-icon.svg'
import { useContext, useState } from 'react'
import { secondsToHHMMSS } from 'utils/time'
import { ReactComponent as BitRateIcon } from '../../bit-rate-icon.svg'
import { HopContext } from '../Providers/HopProvider'
import { StatContext } from '../Providers/StatProvider'
import ExpenseModal from '../Modals/ExpenseModal'
import StatInfo from './StatInfo'
import StreamTime from './StreamTime'
import SubathonModal from '../Modals/SubathonModal'

const StatPanel = () => {
  const {
    ytViewers,
    tiktokViewers,
    isYTLoading,
    isTikTokLoading,
    kickViewers,
    isKickLoading,
  } = useContext(StatContext)
  const { bitrate, isLive, rtt, uptime } = useContext(HopContext)
  const { timeRemaining } = useContext(SubathonContext)
  const { subathonConfig } = useContext(ConfigContext)
  const [showMoneyModal, setShowMoneyModal] = useState(false)
  const [showSubathonModal, setShowSubathonModal] = useState(false)
  const { netProfit } = useContext(StatContext)

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
          {kickViewers || isKickLoading ? (
            <StatInfo
              network="kick"
              image={<KickIcon style={{ width: 26, height: 26 }} />}
              label={
                isKickLoading
                  ? 'Loading'
                  : parseInt(kickViewers).toLocaleString()
              }
            />
          ) : null}
        </Flex>
        <Flex gap="md" style={{ flexWrap: 'wrap' }}>
          <StatInfo
            image={<BitRateIcon style={{ width: 26, height: 26 }} />}
            label={
              <>
                {bitrate ? `${bitrate} Kbps` : 'Offline'}
                <br />
                {rtt ? `${Math.floor(rtt)} ms` : null}
                <br />
                {uptime ? `${uptime}s` : null}
              </>
            }
          />
          {netProfit !== undefined ? (
            <StatInfo
              onClick={() => {
                if (netProfit !== undefined) {
                  setShowMoneyModal(true)
                } else {
                  showNotification({
                    title: 'Error',
                    message: 'Net profit is not ready...',
                    color: 'yellow',
                  })
                }
              }}
              image={<DollarSignIcon style={{ width: 26, height: 26 }} />}
              label={parseFloat(netProfit)
                .toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })
                .replace('.00', '')}
            />
          ) : null}

          {subathonConfig?.isSubathonActive && (
            <StatInfo
              tabularNums
              image={<FlagIcon style={{ width: 26, height: 26 }} />}
              label={
                timeRemaining <= 0 ? '[ENDED]' : secondsToHHMMSS(timeRemaining)
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
