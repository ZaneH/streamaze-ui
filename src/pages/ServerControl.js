import styled from '@emotion/styled'
import {
  Box,
  Button,
  Container,
  Flex,
  Paper,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import {
  IconCircleX,
  IconHelp,
  IconLoader,
  IconMoodSmile,
  IconOctagonOff,
} from '@tabler/icons'
import { ProviderProvider } from 'components/Providers'
import { PhoenixContext } from 'components/Providers/PhoenixProvider'
import { useContext } from 'react'
import { HopContext } from '../components/Providers/HopProvider'
import { Layout } from '../components/document'
import { capitalizeFirstLetter } from '../utils/strings'
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
      <ServerControl />
    </ProviderProvider>
  )
}

const ServerControl = () => {
  const { colors } = useMantineTheme()
  const { serverState, hopError } = useContext(HopContext)
  const isSmall = useMediaQuery('(max-width: 600px)')
  const { streamerChannel } = useContext(PhoenixContext)
  const { adminConfig } = useContext(ConfigContext)

  const isStopped = serverState === 'stopped'
  const isStarting = serverState === 'starting'
  const isReady = serverState === 'ready'

  return (
    <Layout>
      <Flex direction="column" justify="center" my="xl">
        <Container miw={isSmall ? 'auto' : '400px'}>
          <Flex
            align="center"
            gap="12px"
            justify={isSmall ? 'center' : 'inherit'}
          >
            <Title>YouTube/Kick Server</Title>
            <Tooltip
              withinPortal
              label={
                <Box m="sm">
                  <Text>Initialize the YouTube/Kick server.</Text>
                </Box>
              }
            >
              <Text>
                <IconHelp
                  size={24}
                  color={colors.gray[4]}
                  style={{ verticalAlign: 'middle' }}
                />
              </Text>
            </Tooltip>
          </Flex>
          <LiveContainer>
            <Flex align="center" gap="lg">
              {hopError ? <IconCircleX color={colors.red[7]} /> : null}
              {isStopped ? <IconOctagonOff color={colors.red[7]} /> : null}
              {isStarting ? <IconLoader size={28} /> : null}
              {isReady ? (
                <IconMoodSmile size={28} color={colors.green[6]} />
              ) : null}

              <Text size="lg">
                Livebond is <b>{capitalizeFirstLetter(serverState)}</b>
              </Text>
            </Flex>
          </LiveContainer>
          <Button.Group mt="lg">
            <Button
              fullWidth
              color="red"
              onClick={() => {
                const resp = streamerChannel.push('stop_server', {
                  obs_key: adminConfig?.obs_key,
                })

                resp.receive('ok', () => {
                  showNotification({
                    title: 'Success',
                    message: 'Server stopped successfully',
                    color: 'green',
                  })
                })

                resp.receive('error', (msg) => {
                  showNotification({
                    title: 'Error',
                    message: msg.reason,
                    color: 'red',
                  })
                })
              }}
            >
              Turn Off
            </Button>
            <Button
              fullWidth
              color="green"
              onClick={() => {
                const resp = streamerChannel.push('start_server', {
                  obs_key: adminConfig?.obs_key,
                  service: 'youtube',
                })

                resp.receive('ok', () => {
                  showNotification({
                    title: 'Success',
                    message: 'Server started successfully',
                    color: 'green',
                  })
                })

                resp.receive('error', (msg) => {
                  showNotification({
                    title: 'Error',
                    message: msg.reason,
                    color: 'red',
                  })
                })
              }}
            >
              Turn On
            </Button>
          </Button.Group>

          <Flex
            align="center"
            gap="12px"
            justify={isSmall ? 'center' : 'inherit'}
            mt="42px"
          >
            <Title>TikTok Server</Title>
            <Tooltip
              withinPortal
              label={
                <Box m="sm">
                  <Text>Initialize the TikTok server.</Text>
                </Box>
              }
            >
              <Text>
                <IconHelp
                  size={24}
                  color={colors.gray[4]}
                  style={{ verticalAlign: 'middle' }}
                />
              </Text>
            </Tooltip>
          </Flex>
          <LiveContainer>
            <Flex align="center" gap="lg">
              {hopError ? <IconCircleX color={colors.red[7]} /> : null}
              {isStopped ? <IconOctagonOff color={colors.red[7]} /> : null}
              {isStarting ? <IconLoader size={28} /> : null}
              {isReady ? (
                <IconMoodSmile size={28} color={colors.green[6]} />
              ) : null}

              <Text size="lg">
                Livebond is <b>{capitalizeFirstLetter(serverState)}</b>
              </Text>
            </Flex>
          </LiveContainer>
          <Button.Group mt="lg">
            <Button
              fullWidth
              color="red"
              onClick={() => {
                const resp = streamerChannel.push('stop_server', {
                  obs_key: adminConfig?.obs_key,
                })

                resp.receive('ok', () => {
                  showNotification({
                    title: 'Success',
                    message: 'Server stopped successfully',
                    color: 'teal',
                  })
                })

                resp.receive('error', (msg) => {
                  showNotification({
                    title: 'Error',
                    message: msg.reason,
                    color: 'red',
                  })
                })
              }}
            >
              Turn Off
            </Button>
            <Button
              fullWidth
              color="green"
              onClick={() => {
                const resp = streamerChannel.push('start_server', {
                  obs_key: adminConfig?.obs_key,
                  service: 'tiktok',
                })

                resp.receive('ok', () => {
                  showNotification({
                    title: 'Success',
                    message: 'Server started successfully',
                    color: 'teal',
                  })
                })

                resp.receive('error', (msg) => {
                  showNotification({
                    title: 'Error',
                    message: msg.reason,
                    color: 'red',
                  })
                })
              }}
            >
              Turn On
            </Button>
          </Button.Group>
        </Container>
      </Flex>
    </Layout>
  )
}

export default ProvidersWrapper
