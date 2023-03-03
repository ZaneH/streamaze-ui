import { Box, Flex } from '@mantine/core'
import { ChatPanel } from '../components/Chat'
import { Layout } from '../components/document'
import { DonationPanel } from '../components/Donations'
import { ControlPanel } from '../components/StreamControls'
import TagSEO from '../components/TagSEO'

const Home = () => {
  return (
    <Layout showStats>
      <TagSEO />
      <Flex h="100%">
        <Flex direction="column" w="50%" align="center">
          <DonationPanel />
          <Box w="100%" maw="725px">
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
