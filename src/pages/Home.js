import { Box, Flex } from '@mantine/core'
import { ChatPanel } from '../components/Chat'
import { Layout } from '../components/document'
import { DonationPanel } from '../components/Donations'
import { ControlPanel } from '../components/StreamControls'
import TagSEO from '../components/TagSEO'

const Home = () => {
  return (
    <Layout>
      <TagSEO />
      <Flex gap="xs">
        <Flex direction="column" w="50%">
          <DonationPanel />
          <Box pos="absolute" bottom={0} w="50%">
            <ControlPanel />
          </Box>
        </Flex>
        <Flex direction="column" w="50%">
          <ChatPanel />
        </Flex>
      </Flex>
    </Layout>
  )
}

export default Home
