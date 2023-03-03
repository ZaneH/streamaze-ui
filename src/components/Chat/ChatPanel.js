import {
  ActionIcon,
  Box,
  Flex,
  Text,
  Tooltip,
  useMantineTheme,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconChartBar, IconExternalLink } from '@tabler/icons'
import PollModal from 'components/Modals/PollModal/PollModal'
import { PollContext } from 'components/Providers/PollProvider'
import { StatPanel } from 'components/StreamStats'
import { useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PanelHead } from '../document'
import { ConfigContext } from '../Providers/ConfigProvider'
import ChatLog from './ChatLog'

const ChatPanel = () => {
  const { chatConfig } = useContext(ConfigContext)
  const { showPollModal, setShowPollModal } = useContext(PollContext)
  const isMedium = useMediaQuery('(max-width: 768px)')
  const [searchParams] = useSearchParams()
  const { colors } = useMantineTheme()

  return (
    <Flex direction="column" h="100%">
      <Flex w="100%" bg={colors.dark[9]} px="lg" py="md" mt="-78px" ml="-10px">
        <StatPanel />
      </Flex>
      <PollModal
        isOpen={showPollModal}
        onClose={() => setShowPollModal(false)}
      />
      <PanelHead
        style={{
          flex: '0 1 auto',
        }}
      >
        <Flex justify="space-between">
          Chat
          <Flex gap="md" align="center">
            <Tooltip
              label={
                <Box m="sm">
                  <Text>Open chat in a popout window</Text>
                </Box>
              }
            >
              <ActionIcon
                onClick={() => {
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
                }}
              >
                <IconExternalLink size={22} />
              </ActionIcon>
            </Tooltip>
            <Tooltip
              label={
                <Box m="sm">
                  <Text>Show chat poll</Text>
                </Box>
              }
            >
              <ActionIcon
                onClick={() => {
                  setShowPollModal(true)
                }}
              >
                <IconChartBar size={22} />
              </ActionIcon>
            </Tooltip>
          </Flex>
        </Flex>
      </PanelHead>
      <Box style={{ flex: '1 1 auto' }}>
        <ChatLog
          fullHeight
          isDark
          compact={isMedium ? true : false}
          mx={isMedium ? '24px' : '32px'}
          tiktokUsername={chatConfig.tiktok.username}
          youtubeChannel={chatConfig.youtube.channel}
          twitchUsername={chatConfig.twitch.username}
        />
      </Box>
      <Box style={{ flex: '0 1 0px' }} />
    </Flex>
  )
}

export default ChatPanel
