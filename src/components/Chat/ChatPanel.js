import { Box, Flex, Title, useMantineTheme } from '@mantine/core'
import { PanelHead } from '../document'
import ChatLog from '../ChatLog'

const ChatPanel = () => {
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
        <ChatLog fullHeight isDark mx="md" />
      </Box>
      <Box style={{ flex: '0 1 0px' }} />
    </Flex>
  )
}

export default ChatPanel
