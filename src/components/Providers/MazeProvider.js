import MazeWinChime from 'assets/maze_win_chime.mp3'
import useMaze from 'hooks/useMaze'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { LanyardContext } from './LanyardProvider'
import { PhoenixContext } from './PhoenixProvider'
import { useInterval } from '@mantine/hooks'
export const MazeContext = createContext()

// const MAZE_FRAME_SIZE = 3 // Amount of votes to buffer before saving to KV
const MAZE_WIN_THRESHOLD = 3 // Amount of votes required to qualify as "winning"
// const MAZE_FRAME_DURATION = 250 // Game loop duration in ms
const MAZE_KV_UPDATE_INTERVAL = 6_000 // KV update interval in ms

const DIRECTIONS = {
  u: 'up',
  d: 'down',
  l: 'left',
  r: 'right',
}

const MazeProvider = ({ children, isController }) => {
  const { kv, updateKV } = useContext(LanyardContext)
  const { mazeChannel } = useContext(PhoenixContext)
  const isMazeEnabled = true // kv?.maze_enabled === 'true'
  const [mazeWinThreshold, setMazeWinThreshold] = useState(MAZE_WIN_THRESHOLD)
  const [winAudio] = useState(new Audio(MazeWinChime))
  const [cursorIdx, setCursorIdx] = useState(0)
  const [size, setSize] = useState({
    width: 10,
    height: 10,
  })

  const [_generatedMaze, _generateMaze] = useMaze(size.width, size.height)
  const [maze, setMaze] = useState([])
  const [userIds, setUserIds] = useState({})
  // const [lastCommitTs, setLastCommitTs] = useState(0)
  const [lastKvCommitTs, setLastKvCommitTs] = useState(0)
  const [chatInput, setChatInput] = useState({
    up: 0,
    down: 0,
    left: 0,
    right: 0,
  })

  const [hasRegisteredCursorListener, setHasRegisteredCursorListener] =
    useState(false)

  useEffect(() => {
    if (!mazeChannel) {
      return
    }

    if (hasRegisteredCursorListener) {
      return
    }

    setHasRegisteredCursorListener(true)

    mazeChannel?.on('cursor', (payload) => {
      try {
        const { cursor_idx } = payload || {}
        const _cursorIdx = parseInt(cursor_idx)

        if (_cursorIdx > -1) {
          setCursorIdx(_cursorIdx)
        }
      } catch (e) {
        console.error(e)
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mazeChannel])

  const [hasLoadedCursorIdx, setHasLoadedCursorIdx] = useState(false)
  useEffect(() => {
    if (hasLoadedCursorIdx) {
      return
    }

    try {
      const _cursorIdx = parseInt(kv?.maze_cursor_idx)
      if (_cursorIdx > -1) {
        setCursorIdx(_cursorIdx)
        setHasLoadedCursorIdx(true)
      }
    } catch (e) {
      console.error(e)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kv?.maze_cursor_idx])

  useEffect(() => {
    try {
      const _mazeWinThreshold = parseInt(kv?.maze_win_threshold)
      if (_mazeWinThreshold) {
        setMazeWinThreshold(_mazeWinThreshold)
      }
    } catch (e) {
      setMazeWinThreshold(MAZE_WIN_THRESHOLD)
      console.error(e)
    }
  }, [kv?.maze_win_threshold])

  const kvInterval = useInterval(() => {
    setLastKvCommitTs(Date.now())
  }, MAZE_KV_UPDATE_INTERVAL)

  useEffect(() => {
    if (!isController) {
      return
    }

    if (!hasLoadedCursorIdx) {
      return
    }

    if (
      kv?.maze_cursor_idx !== cursorIdx?.toString() &&
      kv?.maze_cursor_idx !== undefined
    ) {
      updateKV('maze_cursor_idx', cursorIdx)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastKvCommitTs])

  useEffect(() => {
    kvInterval.start()

    return kvInterval.stop
  }, [])

  const generateMaze = () => {
    _generateMaze()

    setCursorIdx(0)
    setMaze(_generatedMaze)

    // reset chat input
    const newChatInput = {
      up: 0,
      down: 0,
      left: 0,
      right: 0,
    }

    setChatInput(newChatInput)

    // reset KV
    updateKV('maze_cursor_idx', '0')
    updateKV('maze_last_commit_ts', '0')
    updateKV('maze_map', JSON.stringify(_generatedMaze))
  }

  useEffect(() => {
    setMaze(JSON.parse(kv?.maze_map || '[]'))
  }, [kv?.maze_map])

  const handleMazeResponse = ({ userId, content }) => {
    if (!isMazeEnabled) {
      return
    }

    if (!isController) {
      return
    }

    if (!userId) {
      console.error('[ERROR] Missing userId for maze response')
      return
    }

    // if (userIds[userId]) {
    //   return
    // }

    const sanitizedMessage = content.toLowerCase().trim()
    const foundDirection = ['u', 'd', 'l', 'r'].find(
      (dir) => dir === sanitizedMessage
    )

    if (!foundDirection) {
      return
    }

    moveCursor(DIRECTIONS[foundDirection])

    // setUserIds((prev) => {
    //   const newUsers = { ...prev }
    //   newUsers[userId] = true
    //   return newUsers
    // })
  }

  // useEffect(() => {
  //   // check if the winning vote has been reached
  //   const winningVote = Object.keys(chatInput).reduce((a, b) =>
  //     chatInput[a] > chatInput[b] ? a : b
  //   )

  //   if (chatInput[winningVote] >= mazeWinThreshold) {
  //     setLastCommitTs(Date.now())
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [chatInput])

  // useEffect(() => {
  //   // if (cursorIdx !== parseInt(kv?.maze_cursor_idx)) {
  //   //   updateKV('maze_cursor_idx', cursorIdx)
  //   // }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [cursorIdx])

  const moveCursor = useCallback(
    (dir) => {
      if (!dir) {
        console.error('[ERROR] Missing direction for moveCursor')
        return
      }

      if (!maze) {
        console.error('[ERROR] Missing maze for moveCursor')
        return
      }

      const currentCell = maze[cursorIdx]
      const keys = {
        up: {
          move: size.width * -1,
          check: cursorIdx >= size.width && !currentCell?.top,
        },
        right: {
          move: 1,
          check:
            cursorIdx % size.width !== size.width - 1 && !currentCell?.right,
        },
        down: {
          move: size.width,
          check: cursorIdx < maze.length - size.width && !currentCell?.bottom,
        },
        left: {
          move: -1,
          check: cursorIdx % size.width !== 0 && !currentCell?.left,
        },
      }

      if (keys[dir].check) {
        setCursorIdx((prev) => {
          const newIdx = prev + keys[dir].move
          mazeChannel?.push('update_cursor', { cursor_idx: newIdx })

          return newIdx
        })
      }
    },
    [cursorIdx, maze, size, mazeChannel]
  )

  useEffect(() => {
    if (cursorIdx === size.width * size.height - 1) {
      setTimeout(() => {
        setCursorIdx(0)
      }, 500)
    }
  }, [cursorIdx, size])

  return (
    <MazeContext.Provider
      value={{
        handleMazeResponse,
        chatInput,
        cursorIdx,
        setCursorIdx,
        maze,
        size,
        setSize,
        // lastCommitTs,
        isMazeEnabled,
        generateMaze,
        winAudio,
      }}
    >
      {children}
    </MazeContext.Provider>
  )
}

export default MazeProvider
