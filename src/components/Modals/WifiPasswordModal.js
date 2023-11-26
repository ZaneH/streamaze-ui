/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import { Box, Button, Flex, Modal, PasswordInput, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { WifiContext } from 'components/Providers/WifiProvider'
import { useContext, useRef } from 'react'
import wretch from 'wretch'

const { REACT_APP_API_2_URL } = process.env

const WifiPasswordModal = ({ isOpen, onClose }) => {
  const passwordInputRef = useRef(null)
  const { connectingNetwork } = useContext(WifiContext)

  return (
    <Modal opened={isOpen} centered title="WiFi Password" onClose={onClose}>
      <Flex gap="md" direction="column">
        <Box>
          <Text size="md" fw="bold">
            Connecting to {connectingNetwork?.ssid}
          </Text>
          <Text size="sm">
            Security: {connectingNetwork?.security || '(None)'}
          </Text>
        </Box>
        <PasswordInput label="Password" ref={passwordInputRef} />

        <Button
          fullWidth
          onClick={() => {
            wretch(`${REACT_APP_API_2_URL}/wifi/connect`)
              .post({
                ssid: connectingNetwork?.ssid,
                password: passwordInputRef?.current?.value,
              })
              .res((res) => {
                if (res.status === 200) {
                  showNotification({
                    title: 'Connecting!',
                    color: 'green',
                  })

                  onClose()
                } else {
                  showNotification({
                    title: 'Connection failed',
                    color: 'red',
                  })
                }
              })
              .catch(() => {
                showNotification({
                  title: 'Connection failed',
                  color: 'red',
                })
              })
          }}
        >
          Connect
        </Button>
      </Flex>
    </Modal>
  )
}

export default WifiPasswordModal
