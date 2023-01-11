import { Box, Flex } from '@mantine/core'
import ChatLog from '../ChatLog'
import { PanelHead } from '../document'

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
