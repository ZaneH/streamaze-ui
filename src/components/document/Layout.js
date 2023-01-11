import {
  AppShell,
  Box,
  Burger,
  Flex,
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
          <Title>Streamaze</Title>
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
        },
        main: {
          paddingLeft: '28px',
          padding: 0,
          minHeight: 'inherit',
        },
        body: {
          alignItems: 'stretch',
        },
      }}
    >
      {children}
    </AppShell>
  )
}

export default Layout
