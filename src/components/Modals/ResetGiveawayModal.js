/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import { Button, Modal, Space, Text } from '@mantine/core'

const ResetGiveawayModal = ({ isOpen = false, onClose, onConfirm }) => {
  return (
    <Modal
      title="Reset Giveaway Entries?"
      opened={isOpen}
      centered
      onClose={onClose}
    >
      <Text>
        Are you sure you want to reset all giveaway entries? Entries will need
        to be re-registered.
      </Text>
      <Space h="md" />
      <Button color="red" variant="filled" fullWidth onClick={onConfirm}>
        Reset Giveaway Entries
      </Button>
    </Modal>
  )
}

export default ResetGiveawayModal
