/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import { Box, Flex } from '@mantine/core'
import {
  DonationProvider,
  GpsProvider,
  HopProvider,
  NextUpProvider,
  StatProvider,
} from 'components/Providers'
import LanyardProvider from 'components/Providers/LanyardProvider'
import PhoenixProvider from 'components/Providers/PhoenixProvider'
import PollProvider from 'components/Providers/PollProvider'
import SubathonProvider from 'components/Providers/SubathonProvider'
import { useContext, useEffect } from 'react'
import { ChatPanel } from '../components/Chat'
import { DonationPanel } from '../components/Donations'
import { ControlPanel } from '../components/StreamControls'
import TagSEO from '../components/TagSEO'
import { Layout } from '../components/document'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

const Home = () => {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  const { layoutState } = useContext(ConfigContext)
  const { isDonationPanelOpen } = layoutState || {}

  return (
    <LanyardProvider>
      {/* <KeypadProvider> */}
      <DonationProvider>
        <HopProvider>
          <GpsProvider>
            <SubathonProvider>
              <StatProvider>
                <PhoenixProvider
                  options={{
                    hasMazeConnection: true,
                  }}
                >
                  <PollProvider>
                    <NextUpProvider>
                      <Layout showStats>
                        <TagSEO title="Streamer Dash | Dashboard" />
                        <PanelGroup
                          direction="horizontal"
                          autoSaveId="home-layout"
                          style={{
                            overflow: 'visible',
                          }}
                        >
                          {isDonationPanelOpen && (
                            <Panel minSize={30}>
                              <Flex direction="column" align="center" h="100%">
                                <DonationPanel />
                                <Box w="100%" maw="725px">
                                  <ControlPanel />
                                </Box>
                              </Flex>
                            </Panel>
                          )}

                          <PanelResizeHandle
                            style={{
                              width: '4px',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            }}
                          />

                          <Panel
                            minSize={30}
                            style={{
                              overflow: 'visible',
                            }}
                          >
                            <ChatPanel />
                          </Panel>
                        </PanelGroup>
                      </Layout>
                    </NextUpProvider>
                  </PollProvider>
                </PhoenixProvider>
              </StatProvider>
            </SubathonProvider>
          </GpsProvider>
        </HopProvider>
      </DonationProvider>
      {/* </KeypadProvider> */}
    </LanyardProvider>
  )
}

export default Home
