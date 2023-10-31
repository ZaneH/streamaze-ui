import styled from '@emotion/styled'
import { Box, Flex, Text } from '@mantine/core'
import Maze from 'components/Maze/Maze'
import { DonationProvider, StatProvider } from 'components/Providers'
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
              <MazeProvider>
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
    </Box>
  )
}

export default ProvidersWrapper
