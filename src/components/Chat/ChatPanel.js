import { ActionIcon, Box, Flex, Text, Tooltip } from '@mantine/core'
import { IconExternalLink } from '@tabler/icons'
import { useContext } from 'react'
import ChatLog from '../ChatLog'
import { PanelHead } from '../document'
import { ConfigContext } from '../Providers/ConfigProvider'

const ChatPanel = () => {
  const { chatConfig } = useContext(ConfigContext)
  return (
    <Flex direction="column" h="100%">
      <PanelHead
        style={{
          flex: '0 1 auto',
        }}
      >
        <Flex align="center" gap="md">
          Chat
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
                qs.append('theme', 'dark')

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
        </Flex>
      </PanelHead>
      <Box style={{ flex: '1 1 auto' }}>
        <ChatLog
          fullHeight
          isDark
          mx="md"
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
