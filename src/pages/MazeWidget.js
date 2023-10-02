import { Box } from '@mantine/core'
import Maze from 'components/Maze/Maze'
import { ProviderProvider } from 'components/Providers'
import MazeProvider, { MazeContext } from 'components/Providers/MazeProvider'
import useMaze from 'hooks/useMaze'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLanyardWS } from 'use-lanyard'

const ProvidersWrapper = () => {
  return (
    <ProviderProvider hasHop={false}>
      <MazeProvider>
        <MazeWidget />
      </MazeProvider>
    </ProviderProvider>
  )
}

const MazeWidget = () => {
  const { chatInput, maze, generateMaze, size, setSize, cursorIdx } =
    useContext(MazeContext) || {}
  const { id } = useParams()

  const data = useLanyardWS(id)
  const kv = data?.kv

  const mazeMap = JSON.parse(kv?.maze_map || '[]')
  console.log(mazeMap)

  return (
    <Box>
      <Maze
        cursorIdx={cursorIdx}
        maze={mazeMap}
        size={size}
        setSize={setSize}
      />
      Up: {chatInput?.up || '--'}
      Right: {chatInput?.right || '--'}
      Down: {chatInput?.down || '--'}
      Left: {chatInput?.left || '--'}
    </Box>
  )
}

export default ProvidersWrapper
