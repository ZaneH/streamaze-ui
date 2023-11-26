/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import { Button, Modal, Space, Text } from '@mantine/core'

const DisconnectModal = ({ isOpen = false, onClose }) => {
  return (
    <Modal
      title="Check Your Connection"
      opened={isOpen}
      centered
      onClose={onClose}
    >
      <Text>The stream is degrading. Check your camera and/or connection.</Text>
      <Space h="md" />
      <Button color="red" variant="outline" fullWidth onClick={onClose}>
        Dismiss
      </Button>
    </Modal>
  )
}

export default DisconnectModal
