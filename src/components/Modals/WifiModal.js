import { IconRefresh } from '@tabler/icons'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { WifiContext } from 'components/Providers/WifiProvider'
import moment from 'moment'
import wretch from 'wretch'
import { useContext } from 'react'
import { showNotification } from '@mantine/notifications'
const {
  Modal,
  Table,
  Button,
  ActionIcon,
  Divider,
  Flex,
  Box,
} = require('@mantine/core')

const { REACT_APP_API_2_URL } = process.env

const WifiModal = ({ isOpen, onClose }) => {
  const { networks, lastScannedAt, needsToScan } = useContext(WifiContext) || {}

  const rows = networks
    ?.filter((n) => {
      return n?.ssid?.length > 0
    })
    ?.map((network) => {
      return (
        <tr>
          <td>{network?.ssid}</td>
          <td>{network?.signal_level}</td>
          <td>{network?.security}</td>
          <td>{network?.frequency}</td>
        </tr>
      )
    })

  const scanNetworks = () => {
    wretch(`${REACT_APP_API_2_URL}/wifi/scan`)
      .post()
      .res((res) => {
        if (res.status == 200) {
          showNotification({
            title: 'Scan requested...',
            color: 'green',
          })
        } else {
          showNotification({
            title: 'Scan failed',
            color: 'red',
          })
        }
      })
  }

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Select Wi-Fi Network"
      centered
    >
      <Flex gap="md" direction="column">
        <Flex align="center" gap="md">
          <Button
            onClick={() => {
              scanNetworks()
            }}
          >
            <IconRefresh size={22} />
          </Button>
          <Flex gap="4px">
            <b>Last refreshed:</b>
            {lastScannedAt ? (
              <Box> {moment(lastScannedAt).fromNow()}</Box>
            ) : (
              <Box> Never</Box>
            )}
          </Flex>
        </Flex>
        <Divider />
        {needsToScan ? (
          <Box>Please press the refresh button to scan for networks.</Box>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>SSID</th>
                <th>Strength</th>
                <th>Security</th>
                <th>Frequency</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        )}
      </Flex>
    </Modal>
  )
}

export default WifiModal
