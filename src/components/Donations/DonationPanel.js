import { Box, Flex } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { DonationLog } from '.'
import { PanelHead } from '../document'
import BlankAudio from './BlankAudio'

const DonationPanel = () => {
  const isLarge = useMediaQuery('(min-width: 1440px)')

  return (
    <Flex direction="column" h="100%" style={{ alignSelf: 'stretch' }}>
      <PanelHead
        style={{
          flex: '0 1 auto',
        }}
      >
        Donations
      </PanelHead>
      <Box
        style={{
          flex: '1 1 auto',
          marginBottom: isLarge ? '32px' : '0px',
        }}
      >
        <DonationLog />
        <BlankAudio />
      </Box>
      <Box style={{ flex: '0 1 0px' }} />
    </Flex>
  )
}

export default DonationPanel
