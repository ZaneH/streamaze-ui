import { Button, Modal } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { LanyardContext } from 'components/Providers/LanyardProvider'
import { useContext } from 'react'

const StreamTimeModal = ({ isOpen = false, onClose }) => {
  const { updateKV } = useContext(LanyardContext)

  return (
    <Modal opened={isOpen} onClose={onClose} title="Stream Time" centered>
      <Button
        fullWidth
        color="red"
        variant="outline"
        onClick={() => {
          // set actual_stream_start_time in KV
          updateKV('actual_stream_start_time', (Date.now() / 1000).toFixed(0))
            .then(() => {
              showNotification({
                title: 'Success',
                message: 'Reset Stream Start Time',
                color: 'green',
              })

              onClose()
            })
            .catch(() => {
              showNotification({
                title: 'Error',
                message: 'Failed to reset Stream Start Time',
                color: 'red',
              })
            })
        }}
      >
        Reset Stream Time
      </Button>
    </Modal>
  )
}

export default StreamTimeModal
