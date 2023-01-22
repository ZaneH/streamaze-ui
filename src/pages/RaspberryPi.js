import styled from '@emotion/styled'
import {
  Button,
  ColorSwatch,
  Container,
  Flex,
  Paper,
  Stack,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { IconOctagonOff, IconVideoOff } from '@tabler/icons'
import { useContext } from 'react'
import wretch from 'wretch'
import { Layout } from '../components/document'
import { HopContext } from '../components/Providers/HopProvider'

const LiveContainer = styled(Paper)`
  border: 1px solid #495057;
  padding: 24px 32px;
  border-radius: 8px;
  margin-top: 16px;
`

const BlinkingDiv = styled.div`
  animation: blinker 1.32s ease-in-out infinite;
  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
`

const { REACT_APP_API_URL } = process.env

const RaspberryPi = () => {
  const { colors } = useMantineTheme()
  const isLive = false
  const isSmall = useMediaQuery('(max-width: 600px)')
  let statusMessage = 'Offline'

  return (
    <Layout>
      <Flex direction="column" h="70%" justify="center">
        <Container miw={isSmall ? 'auto' : '400px'}>
          <Flex
            align="center"
            gap="18px"
            justify={isSmall ? 'center' : 'inherit'}
          >
            {!isLive && <IconOctagonOff color={colors.red[7]} size={32} />}
            <Title>Your Pi is {statusMessage}</Title>
            {isLive ? (
              <BlinkingDiv>
                <ColorSwatch color={colors.red[7]} />
              </BlinkingDiv>
            ) : null}
          </Flex>
          <LiveContainer>
            <Stack>
              <Button
                fullWidth
                color="green"
                disabled={isLive}
                onClick={() => {
                  wretch(`${REACT_APP_API_URL}/obs/start-broadcast`)
                    .post()
                    .json((res) => {
                      if (res?.error) {
                        throw new Error(res.error)
                      } else if (res?.message) {
                        showNotification({
                          title: 'Success',
                          message: res.message,
                          color: 'green',
                        })
                      }
                    })
                    .catch((err) => {
                      showNotification({
                        title: 'Error',
                        message: err.message,
                        color: 'red',
                      })
                    })
                }}
              >
                Start Raspberry Pi
              </Button>
              <Button
                fullWidth
                color="red"
                disabled={!isLive}
                onClick={() => {
                  wretch(`${REACT_APP_API_URL}/obs/stop-broadcast`)
                    .post()
                    .json((res) => {
                      if (res?.error) {
                        throw new Error(res.error)
                      } else if (res?.message) {
                        showNotification({
                          title: 'Success',
                          message: res.message,
                          color: 'green',
                        })
                      }
                    })
                    .catch((err) => {
                      showNotification({
                        title: 'Error',
                        message: err.message,
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

export default RaspberryPi
