import { Box, Flex, Text, Tooltip } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { ReactComponent as IconWarning } from '../../assets/warning-icon.svg'
import { DonationLog } from '.'
import { PanelHead } from '../document'
import BlankAudio from './BlankAudio'
import { useContext } from 'react'
import { DonationContext } from 'components/Providers/DonationProvider'

const DonationPanel = () => {
  const isLarge = useMediaQuery('(min-width: 1440px)')
  const { isAutoplay } = useContext(DonationContext)

  return (
    <Flex direction="column" h="100%" style={{ alignSelf: 'stretch' }}>
      <PanelHead
        style={{
          flex: '0 1 auto',
        }}
      >
        Donations
        {!isAutoplay && (
          <Tooltip
            position="right"
            withinPortal
            label={
              <Box m="sm">
                <Text>Donations are paused.</Text>
              </Box>
            }
          >
            <span>
              <IconWarning
                style={{
                  verticalAlign: 'middle',
                  marginLeft: '12px',
                  width: '24px',
                  height: '24px',
                }}
              />
            </span>
          </Tooltip>
        )}
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
