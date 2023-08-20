import { Button, Flex, Modal, Text, TextInput } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { LanyardContext } from 'components/Providers/LanyardProvider'
import { useContext, useRef } from 'react'

const ChangeFTextModal = ({ isOpen, onClose }) => {
  const { updateKV, kv } = useContext(LanyardContext)
  const textInputRef = useRef(null)

  return (
    <Modal
      centered
      opened={isOpen}
      onClose={onClose}
      title="Change F Screen Text"
    >
      <Flex gap="sm" direction="column">
        <Text>
          Change text that appears when the stream is on the F screen.
        </Text>
        <Text>Current: {kv?.f_text ?? 'Not set'}</Text>
        <TextInput
          ref={textInputRef}
          label="Text"
          placeholder="Stream is lagging, brb"
        />
        <Button.Group>
          <Button
            fullWidth
            color="red"
            variant="light"
            onClick={() => {
              onClose()
            }}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            color="green"
            onClick={() => {
              updateKV('f_text', textInputRef.current?.value?.trim() || '')
              showNotification({
                title: 'Success',
                message: 'F screen text updated successfully',
                color: 'green',
              })

              onClose()
            }}
          >
            Save
          </Button>
        </Button.Group>
      </Flex>
    </Modal>
  )
}

export default ChangeFTextModal
