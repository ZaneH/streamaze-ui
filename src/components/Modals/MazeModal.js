import { Button, Modal } from '@mantine/core'
import { LanyardContext } from 'components/Providers/LanyardProvider'
import { MazeContext } from 'components/Providers/MazeProvider'
import useMaze from 'hooks/useMaze'
import { useContext } from 'react'

const MazeModal = ({ isOpen, onClose }) => {
  const { isMazeEnabled, size } = useContext(MazeContext)
  const { kv, updateKV } = useContext(LanyardContext)
  const [maze, generateMaze] = useMaze(size.width, size.height)

  return (
    <Modal opened={isOpen} onClose={onClose} title="Maze" centered>
      <Button.Group>
        <Button
          fullWidth
          color={isMazeEnabled ? 'red' : 'green'}
          onClick={() => {
            updateKV(
              'maze_enabled',
              kv?.maze_enabled === 'true' ? 'false' : 'true'
            )
          }}
        >
          {isMazeEnabled ? 'Disable' : 'Enable'} Maze
        </Button>

        <Button
          fullWidth
          color="blue"
          onClick={() => {
            generateMaze()
            updateKV('maze_map', JSON.stringify(maze))
            updateKV('maze_cursor_idx', 0)
          }}
        >
          Regenerate Maze
        </Button>
      </Button.Group>
    </Modal>
  )
}

export default MazeModal
