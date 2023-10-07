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
  // const { id } = useParams()

  // const data = useLanyardWS(id)
  // const kv = data?.kv

  // const cursorIdx = parseInt(kv?.maze_cursor_idx) || 0
  // const chatInput = JSON.parse(kv?.maze_chat_input || '{}')
  // const [timeRemainingText, setTimeRemainingText] = useState()
  // const lastCommitTs = new Date(parseInt(kv?.maze_last_commit_ts) || 0)
  // const isMazeEnabled = true // kv?.maze_enabled === 'true'

  // const textInterval = useInterval(() => {
  //   setTimeRemainingText(
  //     secondsToHHMMSS(
  //       (MAZE_FRAME_DURATION - (Date.now() - lastCommitTs)) / 1000
  //     )
  //   )
  // }, 250)

  // useEffect(() => {
  //   textInterval.start()
  //   textInterval.stop()
  // }, [lastCommitTs])

  // useEffect(() => {
  //   textInterval.start()

  //   return textInterval.stop
  // }, [])

  // if (!isMazeEnabled) {
  //   return null
  // }

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
        {/* <MazeTimeLabel>
          {timeRemainingText || '00:00'}
        </MazeTimeLabel> */}
      </Flex>
      <Maze cursorIdx={cursorIdx} maze={maze} size={size} />
    </Box>
  )
}

export default ProvidersWrapper
