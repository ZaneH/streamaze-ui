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
import { IconVideoOff } from '@tabler/icons'
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

const { REACT_APP_API_2_URL } = process.env

const GoLive = () => {
  const { colors } = useMantineTheme()
  const { isLive } = useContext(HopContext)
  const isSmall = useMediaQuery('(max-width: 600px)')

  let statusMessage = 'You are Offline'
  if (isLive) {
    statusMessage = 'You are Live'
  }

  return (
    <Layout>
      <Flex direction="column" h="70%" justify="center">
        <Container miw={isSmall ? 'auto' : '400px'}>
          <Flex
            align="center"
            gap="18px"
            justify={isSmall ? 'center' : 'inherit'}
          >
            {!isLive && <IconVideoOff size={32} />}
            <Title>{statusMessage}</Title>
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
                onClick={() => {
                  wretch(`${REACT_APP_API_2_URL}/obs/start-broadcast`)
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
                    .catch((e) => {
                      try {
                        const err = JSON.parse(e.message)
                        const message = err?.error
                        showNotification({
                          title: 'OBS Error',
                          color: 'red',
                          message,
                        })
                      } catch (e) {
                        console.error('Error parsing OBS error', e)
                      }
                    })
                }}
              >
                Start Stream
              </Button>
              <Button
                fullWidth
                color="red"
                onClick={() => {
                  wretch(`${REACT_APP_API_2_URL}/obs/stop-broadcast`)
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
                    .catch((e) => {
                      try {
                        const err = JSON.parse(e.message)
                        const message = err?.error
                        showNotification({
                          title: 'OBS Error',
                          color: 'red',
                          message,
                        })
                      } catch (e) {
                        console.error('Error parsing OBS error', e)
                      }
                    })
                }}
              >
                Stop Stream
              </Button>
            </Stack>
          </LiveContainer>
        </Container>
      </Flex>
    </Layout>
  )
}

export default GoLive
