import { Button, Flex, Modal, NumberInput, Space, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { NextUpContext } from 'components/Providers/NextUpProvider'
import { useContext, useRef } from 'react'

const NextUpModal = ({ onClose }) => {
  const {
    nextUp,
    startNextUp,
    endNextUp,
    showNextUpModal,
    setShowNextUpModal,
  } = useContext(NextUpContext)
  const livesInputRef = useRef(null)
  const frameLengthInputRef = useRef(null)

  return (
    <Modal
      title="Next Up"
      opened={showNextUpModal}
      centered
      onClose={() => {
        setShowNextUpModal(false)
        onClose?.()
      }}
    >
      <Text>
        Next Up is a game to keep your content engaging. It starts with an
        amount of lives and if viewers vote more bad than good, you lose a life.
        How long can you last?
      </Text>
      <Space h="md" />
      <Flex direction="column" gap="sm">
        <NumberInput ref={livesInputRef} defaultValue={20} label="Lives" />
        <NumberInput
          ref={frameLengthInputRef}
          defaultValue={nextUp.frameLength / 1000 / 60}
          label="Time (minutes)"
        />
        <Flex gap="sm" mt="sm">
          <Button
            type="submit"
            color="green"
            variant="filled"
            fullWidth
            onClick={() => {
              try {
                const lives = parseInt(livesInputRef.current.value)
                const frameLength =
                  parseFloat(frameLengthInputRef.current.value) * 1000 * 60

                startNextUp({
                  lives,
                  frameLength,
                })

                setShowNextUpModal(false)
              } catch (e) {
                showNotification({
                  title: 'Error',
                  message: 'Please enter valid numbers',
                  color: 'red',
                })

                console.error(e)
              }
            }}
          >
            Start the Clock
          </Button>
          <Button
            color="red"
            variant="outline"
            fullWidth
            onClick={() => {
              endNextUp()
              setShowNextUpModal(false)
            }}
          >
            End the Game
          </Button>
        </Flex>
      </Flex>
    </Modal>
  )
}

export default NextUpModal
