import styled from '@emotion/styled'
import { Button, Container, Flex, Paper, Stack, Title } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { PhoenixContext } from 'components/Providers/PhoenixProvider'
import { useContext } from 'react'
import { Layout } from '../components/document'

const LiveContainer = styled(Paper)`
  border: 1px solid #495057;
  padding: 24px 32px;
  border-radius: 8px;
  margin-top: 16px;
`

// const BlinkingDiv = styled.div`
//   animation: blinker 1.32s ease-in-out infinite;
//   @keyframes blinker {
//     50% {
//       opacity: 0;
//     }
//   }
// `

const { REACT_APP_API_2_URL } = process.env

const RaspberryPi = () => {
  // const { colors } = useMantineTheme()
  // const isLive = false
  const isSmall = useMediaQuery('(max-width: 600px)')
  const { streamerChannel } = useContext(PhoenixContext)
  // let statusMessage = 'Offline'

  return (
    <Layout>
      <Flex direction="column" justify="center" my="xl">
        <Container miw={isSmall ? 'auto' : '400px'}>
          <Flex
            align="center"
            gap="18px"
            justify={isSmall ? 'center' : 'inherit'}
          >
            {/*!isLive && <IconOctagonOff color={colors.red[7]} size={32} />*/}
            {/* <Title>Your Pi is {statusMessage}</Title> */}
            <Title w="100%" align="center">
              Raspberry Pi Control
            </Title>
            {/* {isLive ? (
              <BlinkingDiv>
                <ColorSwatch color={colors.red[7]} />
              </BlinkingDiv>
            ) : null} */}
          </Flex>
          <LiveContainer>
            <Stack>
              <Button
                fullWidth
                color="red"
                onClick={() => {
                  const resp = streamerChannel.push('stop_pi', {})
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

export default RaspberryPi
