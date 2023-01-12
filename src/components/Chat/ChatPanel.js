import { Box, Flex } from '@mantine/core'
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
        Chat
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
