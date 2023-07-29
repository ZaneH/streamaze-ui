import { Box, Flex } from '@mantine/core'
import { ChatPanel } from '../components/Chat'
import { Layout } from '../components/document'
import { DonationPanel } from '../components/Donations'
import { ControlPanel } from '../components/StreamControls'
import TagSEO from '../components/TagSEO'
import { useEffect } from 'react'
import LanyardProvider from 'components/Providers/LanyardProvider'
import KeypadProvider from 'components/Providers/KeypadProvider'
import {
  DonationProvider,
  GpsProvider,
  HopProvider,
  StatProvider,
} from 'components/Providers'
import SubathonProvider from 'components/Providers/SubathonProvider'
import PhoenixProvider from 'components/Providers/PhoenixProvider'
import PollProvider from 'components/Providers/PollProvider'

const Home = () => {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <LanyardProvider>
      <KeypadProvider>
        <DonationProvider>
          <HopProvider>
            <GpsProvider>
              <SubathonProvider>
                <StatProvider>
                  <PhoenixProvider>
                    <PollProvider>
                      <Layout showStats>
                        <Flex h="100%">
                          <TagSEO title="Streamaze | Dashboard" />
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
                    </PollProvider>
                  </PhoenixProvider>
                </StatProvider>
              </SubathonProvider>
            </GpsProvider>
          </HopProvider>
        </DonationProvider>
      </KeypadProvider>
    </LanyardProvider>
  )
}

export default Home
