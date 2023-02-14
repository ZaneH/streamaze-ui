import { Button, Modal, Space, Text } from '@mantine/core'

const DisconnectModal = ({ isOpen = false, onClose }) => {
  return (
    <Modal title="No Incoming Data" opened={isOpen} centered onClose={onClose}>
      <Text>
        It looks like the stream isn't receiving any data. Check your camera
        and/or connection.
      </Text>
      <Space h="md" />
      <Button color="red" variant="outline" fullWidth onClick={onClose}>
        Dismiss
      </Button>
    </Modal>
  )
}

export default DisconnectModal
