import { Flex, Space } from '@mantine/core'
import StreamButton from './StreamButton'
import { ReactComponent as PlayIcon } from '../../play-icon.svg'
import { ReactComponent as SkipIcon } from '../../skip-icon.svg'

const ControlPanel = () => {
  return (
    <Flex direction="column">
      <Flex>
        <StreamButton color="green" icon={<PlayIcon />} />
        <StreamButton color="blue" icon={<SkipIcon />} />
      </Flex>

      <Space h="sm" />

      <StreamButton color="red">BRB</StreamButton>
      <StreamButton color="purple">Main</StreamButton>

      <Space h="sm" />

      <StreamButton color="orange">Clip</StreamButton>
    </Flex>
  )
}

export default ControlPanel
