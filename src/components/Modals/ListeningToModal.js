/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import { Flex, Modal, Title } from '@mantine/core'

const ListeningToModal = ({ isOpen, onClose, listeningTo }) => {
  return (
    <Modal
      title="Listening to"
      opened={isOpen}
      centered
      onClose={onClose}
      size="xs"
    >
      <Flex direction="column" gap="md">
        <Title size="h3" lh={0.2}>
          {listeningTo.title}
        </Title>
        <Title size="h4">{listeningTo.artist}</Title>
      </Flex>
    </Modal>
  )
}

export default ListeningToModal
