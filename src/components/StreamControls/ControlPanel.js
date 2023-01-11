import { Flex, Space } from '@mantine/core'
import { useContext } from 'react'
import { ReactComponent as PlayIcon } from '../../play-icon.svg'
import { ReactComponent as SkipIcon } from '../../skip-icon.svg'
import { HopContext } from '../Providers/HopProvider'
import StreamButton from './StreamButton'

const ControlPanel = () => {
  const { hopError } = useContext(HopContext)

  return (
    <Flex direction="column">
      <Flex>
        <StreamButton
          color="green"
          icon={<PlayIcon />}
          disabled={hopError}
          onClick={() => {
            console.log('Play')
          }}
        />
        <StreamButton color="blue" icon={<SkipIcon />} disabled={hopError} />
      </Flex>

      <Space h="sm" />

      {/* TODO: Dynamically load available scenes as buttons */}
      <StreamButton
        color="red"
        disabled={hopError}
        onClick={() => {
          console.log('BRB')
        }}
      >
        BRB
      </StreamButton>
      <StreamButton
        color="purple"
        disabled={hopError}
        onClick={() => {
          console.log('Main')
        }}
      >
        Main
      </StreamButton>

      <Space h="sm" />

      <StreamButton
        color="orange"
        disabled={hopError}
        onClick={() => {
          console.log('Clip')
        }}
      >
        Clip
      </StreamButton>
    </Flex>
  )
}

export default ControlPanel
