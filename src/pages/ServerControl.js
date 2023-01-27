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
import { useContext } from 'react'
import wretch from 'wretch'
import { Layout } from '../components/document'
import { HopContext } from '../components/Providers/HopProvider'
import { capitalizeFirstLetter } from '../utils/strings'

const LiveContainer = styled(Paper)`
  border: 1px solid #495057;
  padding: 24px 32px;
  border-radius: 8px;
  margin-top: 16px;
`

const { REACT_APP_API_URL } = process.env

const ServerControl = () => {
  const { colors } = useMantineTheme()
  const { serverState, hopError, streamActiveScene } = useContext(HopContext)
  const isSmall = useMediaQuery('(max-width: 600px)')

  const isStopped = serverState === 'stopped'
  const isStarting = serverState === 'starting'
  const isReady = serverState === 'ready'

  return (
    <Layout>
      <Flex direction="column" h="70%" justify="center">
        <Container miw={isSmall ? 'auto' : '400px'}>
          <Flex
            align="center"
            gap="12px"
            justify={isSmall ? 'center' : 'inherit'}
          >
            <Title>Server Control</Title>
            <Tooltip
              withinPortal
              label={
                <Box m="sm">
                  <Text>
                    This server allows you to control OBS from the dashboard.
                  </Text>
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
              disabled={isStopped}
              onClick={() => {
                wretch(`${REACT_APP_API_URL}/obs/stop-server`)
                  .post()
                  .json((res) => {
                    if (res?.error) {
                      throw new Error(res.error)
                    } else if (res?.message) {
                      showNotification({
                        title: 'Success!',
                        message: res.message,
                      })
                    }
                  })
                  .catch((err) => {
                    showNotification({
                      title: 'OBS Error',
                      message: err.message,
                    })
                  })
              }}
            >
              Turn Off
            </Button>
            <Button
              loading={isStarting}
              disabled={!isReady}
              fullWidth
              color="green"
              onClick={() => {
                wretch(`${REACT_APP_API_URL}/obs/start-server`)
                  .post()
                  .json((res) => {
                    if (res?.error) {
                      throw new Error(res.error)
                    } else if (res?.message) {
                      showNotification({
                        title: 'Success!',
                        message: res.message,
                      })
                    }
                  })
                  .catch((err) => {
                    showNotification({
                      title: 'OBS Error',
                      message: err.message,
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

export default ServerControl
