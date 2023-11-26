/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import styled from '@emotion/styled'
import { Box, Flex, Text } from '@mantine/core'
import { ChatLog } from 'components/Chat'
import Maze from 'components/Maze/Maze'
import { DonationProvider, StatProvider } from 'components/Providers'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import LanyardProvider from 'components/Providers/LanyardProvider'
import MazeProvider, { MazeContext } from 'components/Providers/MazeProvider'
import PhoenixProvider from 'components/Providers/PhoenixProvider'
import SubathonProvider from 'components/Providers/SubathonProvider'
import { useContext } from 'react'

const ProvidersWrapper = () => {
  return (
    // <ProviderProvider hasHop={false}>
    //   <MazeProvider >
    //     <MazeWidget />
    //   </MazeProvider>
    // </ProviderProvider>
    <LanyardProvider>
      <DonationProvider>
        <SubathonProvider>
          <StatProvider>
            <PhoenixProvider
              options={{
                hasMazeConnection: true,
              }}
            >
              <MazeProvider isController={true}>
                <MazeWidget />
              </MazeProvider>
            </PhoenixProvider>
          </StatProvider>
        </SubathonProvider>
      </DonationProvider>
    </LanyardProvider>
  )
}

const MazeTimeLabel = styled.div`
  font-size: 6vh;
  font-family: 'Inter';
  font-variant-numeric: tabular-nums;
  color: #fff;
  text-shadow: 0 0 10px #000;
  white-space: pre-wrap;
`

const MazeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`

const MazeWidget = () => {
  const { chatConfig } = useContext(ConfigContext)
  const { maze, size, cursorIdx } = useContext(MazeContext) || {}

  return (
    <Box mx="16px">
      <Flex justify="space-between" style={{ maxWidth: '80vh' }}>
        <Flex gap="16px" align="center" style={{ fontSize: '3vh' }} my="sm">
          <MazeInfo>
            <Text fw={700}>U</Text> - Up
          </MazeInfo>
          <MazeInfo>
            <Text fw={700}>D</Text> - Down
          </MazeInfo>
          <MazeInfo>
            <Text fw={700}>L</Text> - Left
          </MazeInfo>
          <MazeInfo>
            <Text fw={700}>R</Text> - Right
          </MazeInfo>
        </Flex>
      </Flex>
      <Maze cursorIdx={cursorIdx} maze={maze} size={size} />

      <Box opacity={0}>
        <ChatLog
          height="100%"
          isDark
          compact={false}
          px={'32px'}
          tiktokUsername={chatConfig.tiktok.username}
          youtubeChannel={chatConfig.youtube.channel}
          twitchChannel={chatConfig.twitch.channel}
        />
      </Box>
    </Box>
  )
}

export default ProvidersWrapper
