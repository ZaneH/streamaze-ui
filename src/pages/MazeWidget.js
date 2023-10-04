import styled from '@emotion/styled'
import { Box, Flex } from '@mantine/core'
import { useInterval } from '@mantine/hooks'
import Maze from 'components/Maze/Maze'
import { ProviderProvider } from 'components/Providers'
import MazeProvider, { MazeContext } from 'components/Providers/MazeProvider'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLanyardWS } from 'use-lanyard'
import { secondsToHHMMSS } from 'utils/time'

const ProvidersWrapper = () => {
  return (
    <ProviderProvider hasHop={false}>
      <MazeProvider>
        <MazeWidget />
      </MazeProvider>
    </ProviderProvider>
  )
}

const MazeTimeLabel = styled.div`
  font-size: 3em;
  font-family: 'Inter';
  font-variant-numeric: tabular-nums;
  color: #fff;
  text-shadow: 0 0 10px #000;
  white-space: pre-wrap;
`

const MazeWidget = () => {
  const { maze, size, MAZE_FRAME_DURATION } = useContext(MazeContext) || {}
  const { id } = useParams()

  const data = useLanyardWS(id)
  const kv = data?.kv

  const cursorIdx = parseInt(kv?.maze_cursor_idx) || 0
  // const chatInput = JSON.parse(kv?.maze_chat_input || '{}')
  const [timeRemainingText, setTimeRemainingText] = useState()
  const lastCommitTs = new Date(parseInt(kv?.maze_last_commit_ts) || 0)
  const isMazeEnabled = kv?.maze_enabled === 'true'

  const textInterval = useInterval(() => {
    setTimeRemainingText(
      secondsToHHMMSS(
        (MAZE_FRAME_DURATION - (Date.now() - lastCommitTs)) / 1000
      )
    )
  }, 250)

  useEffect(() => {
    textInterval.start()
    textInterval.stop()
  }, [lastCommitTs])

  useEffect(() => {
    textInterval.start()

    return textInterval.stop
  }, [])

  if (!isMazeEnabled) {
    return null
  }

  return (
    <Box>
      <Flex justify="end" style={{ maxWidth: '80vh' }}>
        {/* <Flex gap="md" p="lg">
          <Flex gap="6px">
            <Text weight={700}>Up:</Text> <Text>{chatInput?.up || '0'}</Text>
          </Flex>
          <Flex gap="6px">
            <Text weight={700}>Down:</Text>{' '}
            <Text>{chatInput?.down || '0'}</Text>
          </Flex>
          <Flex gap="6px">
            <Text weight={700}>Left:</Text>{' '}
            <Text>{chatInput?.left || '0'}</Text>
          </Flex>
          <Flex gap="6px">
            <Text weight={700}>Right:</Text>{' '}
            <Text>{chatInput?.right || '0'}</Text>
          </Flex>
        </Flex> */}
        <MazeTimeLabel>
          {/* Time left in current frame */}
          {timeRemainingText}
        </MazeTimeLabel>
      </Flex>
      <Maze cursorIdx={cursorIdx} maze={maze} size={size} />
    </Box>
  )
}

export default ProvidersWrapper
