import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { LanyardContext } from './LanyardProvider'
import { useInterval } from '@mantine/hooks'
import useMaze from 'hooks/useMaze'
export const MazeContext = createContext()

const MAZE_FRAME_SIZE = 3 // Amount of votes to buffer before saving to KV
const MAZE_FRAME_DURATION = 10_000 // Time in ms to wait before moving cursor

const MazeProvider = ({ children }) => {
  const { kv, updateKV } = useContext(LanyardContext)
  const [cursorIdx, setCursorIdx] = useState(0)
  const [size, setSize] = useState({
    width: 10,
    height: 10,
  })

  const [maze, generateMaze] = useMaze(size.width, size.height)
  const [chatInput, setChatInput] = useState({
    up: 0,
    down: 0,
    left: 0,
    right: 0,
  })

  const timerInterval = useInterval(() => {
    commitMove()
  }, MAZE_FRAME_DURATION)

  useEffect(() => {
    timerInterval.start()

    return () => {
      timerInterval.stop()
    }
  }, [])

  const handleMazeResponse = useCallback(
    ({ userId, content }) => {
      if (!userId) {
        console.error('[ERROR] Missing authorId for maze response')
        return
      }

      const sanitizedMessage = content.toLowerCase().trim()
      const foundDirection = ['up', 'down', 'left', 'right'].find(
        (dir) => dir === sanitizedMessage
      )

      if (!foundDirection) {
        return
      }

      const newChatInput = { ...chatInput }
      newChatInput[foundDirection] = chatInput[foundDirection] + 1
      setChatInput(newChatInput)
    },
    [chatInput, updateKV]
  )

  const moveCursor = useCallback(
    (dir) => {
      if (!dir) {
        console.error('[ERROR] Missing direction for moveCursor')
        return
      }

      const currentCell = maze[cursorIdx]
      const keys = {
        up: {
          move: size.width * -1,
          check: cursorIdx >= size.width && !currentCell.top,
        },
        right: {
          move: 1,
          check:
            cursorIdx % size.width !== size.width - 1 && !currentCell.right,
        },
        down: {
          move: size.width,
          check: cursorIdx < maze.length - size.width && !currentCell.bottom,
        },
        left: {
          move: -1,
          check: cursorIdx % size.width !== 0 && !currentCell.left,
        },
      }

      if (keys[dir].check) setCursorIdx((prev) => prev + keys[dir].move)
    },
    [cursorIdx, maze, size]
  )

  /// The timer has hit 0, so we need to commit the move
  const commitMove = useCallback(() => {
    const pendingVotes = { ...chatInput }
    const currentVotes = kv?.maze_chat_input || {}

    // merge pending votes with current votes
    const mergedVotes = Object.keys(pendingVotes).reduce((acc, key) => {
      acc[key] = (currentVotes[key] || 0) + pendingVotes[key]
      return acc
    }, {})

    console.log('Merged votes', mergedVotes)

    // find the winning vote
    const winningVote = Object.keys(mergedVotes).reduce((a, b) =>
      mergedVotes[a] > mergedVotes[b] ? a : b
    )

    if (mergedVotes[winningVote] === 0) {
      console.log('No winning vote')
      return
    }

    console.log('Winning vote', winningVote)

    moveCursor(winningVote)

    // reset chat input
    const newChatInput = { ...chatInput }
    newChatInput.up = 0
    newChatInput.down = 0
    newChatInput.left = 0
    newChatInput.right = 0

    setChatInput(newChatInput)

    // reset KV
    updateKV('maze_chat_input', {})

    // reset timer
    timerInterval.stop()
    timerInterval.start()
  }, [chatInput, kv, moveCursor, timerInterval])

  return (
    <MazeContext.Provider
      value={{
        handleMazeResponse,
        chatInput,
        cursorIdx,
        setCursorIdx,
        maze,
        generateMaze,
        size,
      }}
    >
      {children}
    </MazeContext.Provider>
  )
}

export default MazeProvider
