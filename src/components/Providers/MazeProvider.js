import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { LanyardContext } from './LanyardProvider'
import { useInterval } from '@mantine/hooks'
export const MazeContext = createContext()

const MAZE_FRAME_SIZE = 3 // Amount of votes to buffer before saving to KV
const MAZE_FRAME_DURATION = 10_000 // Time in ms to wait before moving cursor

const MazeProvider = ({ children, isController }) => {
  const { kv, updateKV } = useContext(LanyardContext)
  const isMazeEnabled = kv?.maze_enabled === 'true'
  const [cursorIdx, setCursorIdx] = useState(0)
  const [size, setSize] = useState({
    width: 10,
    height: 10,
  })

  // const [maze, generateMaze] = useMaze(size.width, size.height)
  const [maze, setMaze] = useState([])
  const [lastCommitTs, setLastCommitTs] = useState(0)
  const [chatInput, setChatInput] = useState({
    up: 0,
    down: 0,
    left: 0,
    right: 0,
  })

  const [userIds, setUserIds] = useState({})

  useEffect(() => {
    if (!isController) {
      return
    }

    // reset timer
    timerInterval.stop()
    timerInterval.start()

    const kvVotes = JSON.parse(kv?.maze_chat_input || '{}')

    const mergedVotes = {
      up: (kvVotes?.up || 0) + (chatInput?.up || 0),
      down: (kvVotes?.down || 0) + (chatInput?.down || 0),
      left: (kvVotes?.left || 0) + (chatInput?.left || 0),
      right: (kvVotes?.right || 0) + (chatInput?.right || 0),
    }

    // find the winning vote
    const winningVote = Object.keys(mergedVotes).reduce((a, b) =>
      mergedVotes[a] > mergedVotes[b] ? a : b
    )

    // tell widget about time remaining
    updateKV('maze_last_commit_ts', lastCommitTs)

    if (mergedVotes[winningVote] === 0) {
      console.log('No winning vote')
      return
    }

    // verify there isn't a tie
    const winningVoteCount = Object.values(mergedVotes).filter(
      (vote) => vote === mergedVotes[winningVote]
    ).length

    if (winningVoteCount === 1) {
      moveCursor(winningVote)
    }

    // reset chat input
    setChatInput({
      up: 0,
      down: 0,
      left: 0,
      right: 0,
    })

    // reset KV
    updateKV('maze_chat_input', JSON.stringify({}))
  }, [lastCommitTs])

  useEffect(() => {
    setMaze(JSON.parse(kv?.maze_map || '[]'))
  }, [kv?.maze_map])

  const timerInterval = useInterval(() => {
    if (isController) {
      setLastCommitTs(Date.now())
    }
  }, MAZE_FRAME_DURATION)

  useEffect(() => {
    timerInterval.start()

    return () => {
      timerInterval.stop()
    }
  }, [])

  const handleMazeResponse = ({ userId, content }) => {
    if (!userId) {
      console.error('[ERROR] Missing authorId for maze response')
      return
    }

    if (userIds[userId]) {
      return
    }

    const sanitizedMessage = content.toLowerCase().trim()
    const foundDirection = ['up', 'down', 'left', 'right'].find(
      (dir) => dir === sanitizedMessage
    )

    if (!foundDirection) {
      return
    }

    setChatInput((prev) => {
      const newChatInput = { ...prev }
      newChatInput[foundDirection] = chatInput[foundDirection] + 1

      return newChatInput
    })

    setUserIds((prev) => {
      const newUsers = { ...prev }
      newUsers[userId] = true
      return newUsers
    })
  }

  const updateChatInputKV = useCallback(() => {
    // save current chat input to KV
    updateKV('maze_chat_input', JSON.stringify(chatInput))
    setChatInput({
      up: 0,
      down: 0,
      left: 0,
      right: 0,
    })
  }, [chatInput])

  useEffect(() => {
    // check if MAZE_FRAME_SIZE has been reached
    const totalVotes = Object.values(chatInput).reduce((a, b) => a + b)
    if (totalVotes >= MAZE_FRAME_SIZE) {
      // save current chat input to KV
      updateChatInputKV()
    }
  }, [chatInput])

  useEffect(() => {
    if (cursorIdx !== parseInt(kv?.maze_cursor_idx)) {
      updateKV('maze_cursor_idx', cursorIdx)
    }
  }, [cursorIdx])

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
        setCursorIdx((prev) => prev + keys[dir].move)
      }
    },
    [cursorIdx, maze, size]
  )

  useEffect(() => {
    if (cursorIdx === size.width * size.height - 1) {
      setTimeout(() => {
        setCursorIdx(0)
      }, 500)
    }
  }, [cursorIdx, size])

  useEffect(() => {
    if (isMazeEnabled) {
      timerInterval.start()
    } else {
      timerInterval.stop()
    }
  }, [isMazeEnabled, timerInterval])

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
        lastCommitTs,
        MAZE_FRAME_DURATION,
        isMazeEnabled,
      }}
    >
      {children}
    </MazeContext.Provider>
  )
}

export default MazeProvider
