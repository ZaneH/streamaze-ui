import { Button, Flex, Modal, Text } from '@mantine/core'
import { PollContext } from 'components/Providers/PollProvider'
import { useContext } from 'react'
import PollBarGraph from './PollBarGraph'

const PollModal = ({ isOpen = false, onClose }) => {
  const { pollResponses, setPollResponses } = useContext(PollContext)

  return (
    <Modal
      title="Chat Poll"
      opened={isOpen}
      onClose={onClose}
      centered
      size="lg"
    >
      <Flex gap="md" direction="column">
        <Text size="lg" weight={500} align="center">
          Total Votes: {pollResponses.length}
        </Text>
        <PollBarGraph />
        <Button
          fullWidth
          variant="outline"
          color="red"
          size="lg"
          onClick={() => {
            setPollResponses([])
          }}
        >
          Reset Poll
        </Button>
      </Flex>
    </Modal>
  )
}

export default PollModal
