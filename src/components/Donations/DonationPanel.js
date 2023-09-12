import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Flex,
  Popover,
  Select,
  Text,
  Tooltip,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { IconDotsVertical, IconLayoutSidebarLeftCollapse } from '@tabler/icons'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { DonationContext } from 'components/Providers/DonationProvider'
import { HopContext } from 'components/Providers/HopProvider'
import { LanyardContext } from 'components/Providers/LanyardProvider'
import { PhoenixContext } from 'components/Providers/PhoenixProvider'
import { useContext } from 'react'
import { DonationLog } from '.'
import { ReactComponent as IconWarning } from '../../assets/warning-icon.svg'
import { PanelHead } from '../document'
import BlankAudio from './BlankAudio'

const DonationPanel = () => {
  const isLarge = useMediaQuery('(min-width: 1440px)')
  const { isAutoplay } = useContext(DonationContext)
  const { updateKV } = useContext(LanyardContext)
  const { currentProfile, availableProfiles } = useContext(HopContext)
  const { streamerChannel } = useContext(PhoenixContext)
  const { adminConfig, setLayoutConfig, setLayoutState } =
    useContext(ConfigContext)

  return (
    <Flex direction="column" h="100%" style={{ alignSelf: 'stretch' }}>
      <PanelHead
        style={{
          flex: '0 1 auto',
        }}
      >
        <Flex justify="space-between">
          <Box>
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
          </Box>
          <Flex gap="sm" align="center">
            <Tooltip
              withinPortal
              position="right"
              label={
                <Box m="sm">
                  <Text>Collapse donations panel.</Text>
                </Box>
              }
            >
              <ActionIcon
                onClick={() => {
                  setLayoutConfig((prev) => ({
                    ...prev,
                    isDonationPanelOpen: !prev.isDonationPanelOpen,
                  }))
                }}
              >
                <IconLayoutSidebarLeftCollapse size={22} />
              </ActionIcon>
            </Tooltip>
            {availableProfiles?.length > 0 ? (
              <Popover width={200} position="bottom" withArrow shadow="md">
                <Popover.Target>
                  <ActionIcon>
                    <IconDotsVertical size={22} />
                  </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown>
                  <Flex gap="sm" direction="column">
                    <Text size="sm">Change OBS profiles</Text>
                    <Select
                      size="sm"
                      value={currentProfile}
                      data={availableProfiles?.map((p) => ({
                        value: p,
                        label: p,
                      }))}
                      onChange={(e) => {
                        const resp = streamerChannel?.push('switch_profile', {
                          obs_key: adminConfig?.obs_key,
                          profile: e,
                        })

                        resp?.receive('ok', () => {
                          showNotification({
                            title: 'Success',
                            message: 'Profile switched successfully',
                            color: 'green',
                          })
                        })

                        resp?.receive('error', (msg) => {
                          showNotification({
                            title: 'Error',
                            message: msg?.reason,
                            color: 'red',
                          })
                        })
                      }}
                    />

                    <Divider />

                    <Button
                      onClick={() => {
                        setLayoutState((prev) => ({
                          ...prev,
                          isChangeFTextModalOpen: true,
                        }))
                      }}
                    >
                      Change F Text
                    </Button>
                    <Button
                      color="red"
                      onClick={() => {
                        updateKV('f_text', '')
                      }}
                    >
                      Clear F Text
                    </Button>

                    <Divider />

                    <Text size="sm">Network</Text>
                    <Button
                      fullWidth
                      color="blue"
                      onClick={() => {
                        setLayoutState((prev) => ({
                          ...prev,
                          isWiFiModalOpen: true,
                        }))
                      }}
                    >
                      Select Wi-Fi
                    </Button>
                  </Flex>
                </Popover.Dropdown>
              </Popover>
            ) : null}
          </Flex>
        </Flex>
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
