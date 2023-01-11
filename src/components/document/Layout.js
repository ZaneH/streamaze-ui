import {
  AppShell,
  Box,
  Burger,
  Container,
  Flex,
  MediaQuery,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { StatPanel } from '../StreamStats'

const SplitHeader = () => {
  const { colors } = useMantineTheme()

  return (
    <Box height={78}>
      <Flex align="center" gap="sm">
        <Flex
          align="center"
          px="32px"
          w="50%"
          bg={colors.dark[7]}
          style={{ alignSelf: 'stretch' }}
        >
          <Burger mr="lg" />
          <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
            <Title>Streamaze</Title>
          </MediaQuery>
        </Flex>
        <Flex w="50%" bg={colors.dark[9]} px="lg" py="md">
          <StatPanel />
        </Flex>
      </Flex>
    </Box>
  )
}

const Layout = ({ children }) => {
  return (
    <AppShell
      padding="16px"
      header={<SplitHeader />}
      styles={{
        root: {
          background: '#141518',
          color: 'white',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        },
        main: {
          paddingLeft: '28px',
          padding: 0,
          minHeight: 'inherit',
        },
        body: {
          alignItems: 'stretch',
          flex: '1 1 auto',
        },
      }}
    >
      {children}
    </AppShell>
  )
}

export default Layout
