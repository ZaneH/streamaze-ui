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
import { DonationProvider, StatProvider } from 'components/Providers'
import PhoenixProvider, {
  PhoenixContext,
} from 'components/Providers/PhoenixProvider'
import SubathonProvider from 'components/Providers/SubathonProvider'
import { useContext } from 'react'
import HopProvider, { HopContext } from '../components/Providers/HopProvider'
import { Layout } from '../components/document'

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

const ProvidersWrapper = () => {
  return (
    <DonationProvider>
      <HopProvider>
        <SubathonProvider>
          <StatProvider>
            <PhoenixProvider>
              <GoLive />
            </PhoenixProvider>
          </StatProvider>
        </SubathonProvider>
      </HopProvider>
    </DonationProvider>
  )
}

const GoLive = () => {
  const { colors } = useMantineTheme()
  const { isLive } = useContext(HopContext)
  const { streamerChannel } = useContext(PhoenixContext)
  const isSmall = useMediaQuery('(max-width: 600px)')

  let statusMessage = 'You are Offline'
  if (isLive) {
    statusMessage = 'You are Live'
  }

  return (
    <Layout>
      <Flex direction="column" justify="center" my="xl">
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
                  const resp = streamerChannel.push('start_broadcast', {})
                  resp.receive('ok', () => {
                    showNotification({
                      title: 'Success',
                      message: 'Your broadcast has started',
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
                Start Stream
              </Button>
              <Button
                fullWidth
                color="red"
                onClick={() => {
                  const resp = streamerChannel.push('stop_broadcast', {})

                  resp.receive('ok', () => {
                    showNotification({
                      title: 'Success',
                      message: 'Your broadcast has stopped',
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
                Stop Stream
              </Button>
            </Stack>
          </LiveContainer>
        </Container>
      </Flex>
    </Layout>
  )
}

export default ProvidersWrapper
