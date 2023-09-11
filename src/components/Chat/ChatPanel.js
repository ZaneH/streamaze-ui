import {
  ActionIcon,
  Box,
  Flex,
  Menu,
  Text,
  Tooltip,
  useMantineTheme,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import {
  IconChartBar,
  IconDotsVertical,
  IconExternalLink,
  IconGridDots,
  IconHeartMinus,
  IconLayoutSidebarRightExpand,
  IconListNumbers,
} from '@tabler/icons'
import NextUpGameOverModal from 'components/Modals/NextUpGameOverModal'
import NextUpModal from 'components/Modals/NextUpModal'
import PollModal from 'components/Modals/PollModal/PollModal'
import { NextUpContext } from 'components/Providers/NextUpProvider'
import { PollContext } from 'components/Providers/PollProvider'
import { WordRankContext } from 'components/Providers/WordRankProvider'
import { StatPanel } from 'components/StreamStats'
import { useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ConfigContext } from '../Providers/ConfigProvider'
import { PanelHead } from '../document'
import ChatLog from './ChatLog'
import WordRank from './WordRank'

const statPanelOffsets = {
  mt: '-78px',
  ml: '-10px',
}

const ChatPanel = () => {
  const { chatConfig, layoutConfig, setLayoutConfig } =
    useContext(ConfigContext)
  const { showPollModal, setShowPollModal } = useContext(PollContext)
  const { showWordRankPanel, setShowWordRankPanel } =
    useContext(WordRankContext)
  const { nextUp, setShowNextUpModal, nextUpClock } = useContext(NextUpContext)
  const isMedium = useMediaQuery('(max-width: 768px)')
  const [searchParams] = useSearchParams()
  const { colors } = useMantineTheme()
  const { isDonationPanelOpen } = layoutConfig || {}

  const menuItems = [
    {
      element: 'Open chat in a popout window',
      icon: IconExternalLink,
      onClick: () => {
        const qs = new URLSearchParams()
        qs.append('isChat', 'true')
        qs.append('theme', searchParams.get('theme') || 'dark')

        if (chatConfig?.tiktok?.username) {
          qs.append('tiktokChat', chatConfig.tiktok.username)
        }

        if (chatConfig?.twitch?.username) {
          qs.append('twitchChat', chatConfig.twitch.username)
        }

        if (chatConfig?.youtube?.channel) {
          qs.append('youtubeChat', chatConfig.youtube.channel)
        }

        window.open(
          `/chat?${qs.toString()}`,
          'sharer',
          'toolbar=0,status=0,width=350,height=550'
        )
      },
    },
    null,
    {
      element: 'Show chat poll',
      icon: IconChartBar,
      onClick: () => {
        setShowPollModal(true)
      },
    },
    {
      element: `${showWordRankPanel ? 'Hide' : 'Show'} word rank`,
      icon: IconListNumbers,
      onClick: () => {
        setShowWordRankPanel(!showWordRankPanel)
      },
    },
    null,
    {
      element: 'Play Next Up game',
      icon: IconHeartMinus,
      onClick: () => {
        setShowNextUpModal(true)
      },
    },
    null,
    {
      element: 'Toggle information',
      icon: IconGridDots,
      onClick: () => {
        setLayoutConfig((prev) => ({
          ...prev,
          isToggleInfoModalOpen: !prev.isToggleInfoModalOpen,
        }))
      },
    },
  ]

  return (
    <Flex direction="column" h="100%">
      <Flex
        w="100%"
        bg={colors.dark[9]}
        px="lg"
        py="md"
        mt={isDonationPanelOpen ? statPanelOffsets.mt : 0}
        ml={isDonationPanelOpen ? statPanelOffsets.ml : 0}
      >
        <StatPanel />
      </Flex>
      <PollModal
        isOpen={showPollModal}
        onClose={() => setShowPollModal(false)}
      />
      <NextUpModal />
      <NextUpGameOverModal />
      <PanelHead
        style={{
          flex: '0 1 auto',
        }}
      >
        <Flex justify="space-between">
          Chat
          <Flex gap="sm" align="center">
            {!isDonationPanelOpen && (
              <Tooltip
                withinPortal
                position="right"
                label={
                  <Box m="sm">
                    <Text>Open donations panel.</Text>
                  </Box>
                }
              >
                <ActionIcon
                  onClick={() => {
                    setLayoutConfig((prev) => ({
                      ...prev,
                      isDonationPanelOpen: !prev.isDonationPanelOpen,
                    }))
                  }}
                >
                  <IconLayoutSidebarRightExpand size={22} />
                </ActionIcon>
              </Tooltip>
            )}
            <Menu>
              <Menu.Target>
                <ActionIcon>
                  <IconDotsVertical size={22} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                {menuItems.map((item, i) => {
                  if (item === null) {
                    return <Menu.Divider key={i} />
                  }

                  return (
                    <Menu.Item
                      key={i}
                      icon={<item.icon size={22} />}
                      onClick={item.onClick}
                    >
                      {item.element}
                    </Menu.Item>
                  )
                })}
              </Menu.Dropdown>
            </Menu>
          </Flex>
        </Flex>
      </PanelHead>
      {nextUp.nextUpTimestamp && (
        <Box h="44px" w="100%" px={isMedium ? '24px' : '32px'}>
          <Flex justify="space-between" align="center">
            <Box>
              Lives
              <Text display="inline" weight="bold" ml="md">
                {nextUp.lives}
              </Text>
            </Box>
            <Box>
              Checkpoint
              <Text
                display="inline"
                weight="bold"
                ml="md"
                style={{
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {nextUpClock}
              </Text>
            </Box>
          </Flex>
        </Box>
      )}
      <Box style={{ flex: '1 1 auto' }}>
        {showWordRankPanel && <WordRank />}
        <ChatLog
          fullHeight={showWordRankPanel ? false : true}
          height={showWordRankPanel ? '60%' : '100%'}
          isDark
          compact={isMedium ? true : false}
          px={isMedium ? '24px' : '32px'}
          tiktokUsername={chatConfig.tiktok.username}
          youtubeChannel={chatConfig.youtube.channel}
          twitchChannel={chatConfig.twitch.channel}
        />
      </Box>
      <Box style={{ flex: '0 1 0px' }} />
    </Flex>
  )
}

export default ChatPanel
