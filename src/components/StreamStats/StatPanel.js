import { Box, Flex } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { ReactComponent as BitRateIcon } from 'assets/bit-rate-icon.svg'
import { ReactComponent as DollarSignIcon } from 'assets/dollar-sign-icon.svg'
import { ReactComponent as DollarFanIcon } from 'assets/dollar-fan-icon.svg'
import { ReactComponent as DollarBankIcon } from 'assets/dollar-bank-icon.svg'
import { ReactComponent as FlagIcon } from 'assets/flag-icon.svg'
import { ReactComponent as KickIcon } from 'assets/kick-logo-icon.svg'
import BankModal from 'components/Modals/BankModal'
import ToggleInfoModal from 'components/Modals/ToggleInfoModal'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { LanyardContext } from 'components/Providers/LanyardProvider'
import { SubathonContext } from 'components/Providers/SubathonProvider'
import { useContext, useState } from 'react'
import { secondsToHHMMSS } from 'utils/time'
import ExpenseModal from '../Modals/ExpenseModal'
import SubathonModal from '../Modals/SubathonModal'
import { HopContext } from '../Providers/HopProvider'
import { StatContext } from '../Providers/StatProvider'
import StatInfo from './StatInfo'
import ChangeFTextModal from 'components/Modals/ChangeFTextModal'
import WifiModal from 'components/Modals/WifiModal'
import { MazeProvider, WifiProvider } from 'components/Providers'
import ToggleOverlaysModal from 'components/Modals/ToggleOverlaysModal'
import WifiPasswordModal from 'components/Modals/WifiPasswordModal'
import CashBalModal from 'components/Modals/CashBalModal'
import MazeModal from 'components/Modals/MazeModal'

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
  const { kv } = useContext(LanyardContext)
  const { timeRemaining } = useContext(SubathonContext)
  const { subathonConfig, layoutConfig, layoutState, setLayoutState } =
    useContext(ConfigContext)
  const [showMoneyModal, setShowMoneyModal] = useState(false)
  const [showSubathonModal, setShowSubathonModal] = useState(false)
  // const [showBankModal, setShowBankModal] = useState(false)
  const [showCashBalModal, setShowCashBalModal] = useState(false)
  const { netProfit } = useContext(StatContext)
  const matches = useMediaQuery('(max-width: 768px)')

  const isViewersHidden = layoutConfig?.hiddenInfo?.includes('viewers')
  const isProfitHidden = layoutConfig?.hiddenInfo?.includes('profit')
  const isCashBalanceHidden = layoutConfig?.hiddenInfo?.includes('cash_balance')
  const isLivestreamInfoHidden =
    layoutConfig?.hiddenInfo?.includes('livestream_info')
  const isSubathonHidden = layoutConfig?.hiddenInfo?.includes('subathon')

  return (
    <>
      <Flex direction="column" gap="xs">
        <Flex gap="md" style={{ flexWrap: 'wrap' }}>
          {!isViewersHidden && (
            <span>
              {ytViewers || isYTLoading ? (
                <StatInfo
                  network="youtube"
                  label={
                    isYTLoading
                      ? 'Loading'
                      : parseInt(ytViewers).toLocaleString()
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
            </span>
          )}

          {netProfit !== undefined && !isProfitHidden ? (
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

          {!isCashBalanceHidden ? (
            <StatInfo
              onClick={() => {
                setShowCashBalModal(true)
              }}
              image={<DollarBankIcon style={{ width: 26, height: 26 }} />}
              label={(parseInt(kv?.cash_balance || 0) / 100)
                .toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })
                .replace('.00', '')}
            />
          ) : null}

          {subathonConfig?.isSubathonActive && !isSubathonHidden && (
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

          {/* {isLive && <StreamTime />} */}

          {!isLivestreamInfoHidden && (
            <StatInfo
              textSize={matches ? 14 : 18}
              image={<BitRateIcon style={{ width: 26, height: 26 }} />}
              tabularNums
              label={
                <Flex align="center" gap="xs" wrap="wrap">
                  {bitrate ? `${bitrate} Kbps` : 'Offline'}
                  {rtt ? <Box>{Math.floor(rtt)} ms</Box> : null}
                  {uptime ? (
                    <Box display="inline-flex" style={{ alignItems: 'center' }}>
                      {secondsToHHMMSS(uptime)}
                    </Box>
                  ) : null}
                </Flex>
              }
            />
          )}
        </Flex>
      </Flex>

      <ExpenseModal
        isOpen={showMoneyModal}
        onClose={() => {
          setShowMoneyModal(false)
        }}
        // onOpenBank={() => {
        //   setShowBankModal(true)
        //   setShowMoneyModal(false)
        // }}
      />

      {/* <BankModal
        isOpen={showBankModal}
        onClose={() => setShowBankModal(false)}
      /> */}

      <CashBalModal
        isOpen={showCashBalModal}
        onClose={() => {
          setShowCashBalModal(false)
        }}
      />

      <SubathonModal
        isOpen={showSubathonModal}
        onClose={() => {
          setShowSubathonModal(false)
        }}
      />

      <ToggleInfoModal
        isOpen={layoutState?.isToggleInfoModalOpen}
        onClose={() => {
          setLayoutState((prev) => ({
            ...prev,
            isToggleInfoModalOpen: false,
          }))
        }}
      />

      <ToggleOverlaysModal
        isOpen={layoutState?.isToggleOverlaysModalOpen}
        onClose={() => {
          setLayoutState((prev) => ({
            ...prev,
            isToggleOverlaysModalOpen: false,
          }))
        }}
      />

      <ChangeFTextModal
        isOpen={layoutState?.isChangeFTextModalOpen}
        onClose={() =>
          setLayoutState((prev) => ({
            ...prev,
            isChangeFTextModalOpen: false,
          }))
        }
      />
      <WifiProvider>
        <WifiModal
          isOpen={layoutState?.isWiFiModalOpen}
          onClose={() =>
            setLayoutState((prev) => ({
              ...prev,
              isWiFiModalOpen: false,
            }))
          }
        />

        <WifiPasswordModal
          isOpen={layoutState?.isWifiPasswordModalOpen}
          onClose={() => {
            setLayoutState((prev) => ({
              ...prev,
              isWifiPasswordModalOpen: false,
            }))
          }}
        />
      </WifiProvider>
    </>
  )
}

export default StatPanel
