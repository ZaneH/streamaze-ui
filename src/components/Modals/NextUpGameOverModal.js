/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import { Modal, Text } from '@mantine/core'
import { NextUpContext } from 'components/Providers/NextUpProvider'
import { useContext } from 'react'

const NextUpGameOverModal = ({ onClose }) => {
  const { nextUp, showGameOverModal, setShowGameOverModal } =
    useContext(NextUpContext)

  return (
    <Modal
      title="Game Over"
      opened={showGameOverModal}
      centered
      onClose={() => {
        setShowGameOverModal(false)
        onClose?.()
      }}
    >
      <Text>
        Your {nextUp.startLives} lives are up! You lasted{' '}
        {nextUp.totalTime / 60} minutes. Nice work!
      </Text>
    </Modal>
  )
}

export default NextUpGameOverModal
