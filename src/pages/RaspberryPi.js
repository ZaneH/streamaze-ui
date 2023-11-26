/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import styled from '@emotion/styled'
import { Button, Container, Flex, Paper, Stack, Title } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { ProviderProvider } from 'components/Providers'
import { PhoenixContext } from 'components/Providers/PhoenixProvider'
import { useContext } from 'react'
import { Layout } from '../components/document'
import { ConfigContext } from 'components/Providers/ConfigProvider'

const LiveContainer = styled(Paper)`
  border: 1px solid #495057;
  padding: 24px 32px;
  border-radius: 8px;
  margin-top: 16px;
`

const ProvidersWrapper = () => {
  return (
    <ProviderProvider>
      <RaspberryPi />
    </ProviderProvider>
  )
}

const RaspberryPi = () => {
  const isSmall = useMediaQuery('(max-width: 600px)')
  const { streamerChannel } = useContext(PhoenixContext)
  const { adminConfig } = useContext(ConfigContext)

  return (
    <Layout>
      <Flex direction="column" justify="center" my="xl">
        <Container miw={isSmall ? 'auto' : '400px'}>
          <Flex
            align="center"
            gap="18px"
            justify={isSmall ? 'center' : 'inherit'}
          >
            <Title w="100%" align="center">
              Raspberry Pi Control
            </Title>
          </Flex>
          <LiveContainer>
            <Stack>
              <Button
                fullWidth
                color="red"
                onClick={() => {
                  const resp = streamerChannel.push('stop_pi', {
                    obs_key: adminConfig?.obs_key,
                  })

                  resp.receive('ok', (resp) => {
                    showNotification({
                      title: 'Success',
                      message: "Raspberry Pi's has been stopped",
                      color: 'green',
                    })
                  })

                  resp.receive('error', (resp) => {
                    showNotification({
                      title: 'Error',
                      message: resp.reason,
                      color: 'red',
                    })
                  })
                }}
              >
                Stop Raspberry Pi
              </Button>
            </Stack>
          </LiveContainer>
        </Container>
      </Flex>
    </Layout>
  )
}

export default ProvidersWrapper
