import { Box, Flex } from '@mantine/core'
import { PanelHead } from '../document'
import { DonationLog } from '.'

const DonationPanel = () => {
  return (
    <Flex direction="column" h="100%">
      <PanelHead
        style={{
          flex: '0 1 auto',
        }}
      >
        Donations
      </PanelHead>
      <Box style={{ flex: '1 1 auto' }}>
        <DonationLog />
      </Box>
      <Box style={{ flex: '0 1 0px' }} />
    </Flex>
  )
}

export default DonationPanel
