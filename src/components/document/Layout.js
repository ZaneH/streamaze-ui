import {
  AppShell,
  Box,
  Burger,
  ColorSwatch,
  Flex,
  MediaQuery,
  Space,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { useContext } from 'react'
import { HopContext } from '../Providers/HopProvider'
import { SidebarContext } from '../Providers/SidebarProvider'
import { StatPanel } from '../StreamStats'
import Sidebar from './Sidebar'

const SplitHeader = ({ showStats }) => {
  const { colors } = useMantineTheme()
  const { setIsSidebarOpen } = useContext(SidebarContext)
  const { isLive } = useContext(HopContext)

  return (
    <Box height={78}>
      <Flex align="center" gap="sm">
        <Flex
          align="center"
          px="20px"
          w={showStats ? '50%' : '100%'}
          bg={colors.dark[7]}
          style={{ alignSelf: 'stretch' }}
          py="md"
        >
          <Burger
            mr="xl"
            onClick={() => {
              setIsSidebarOpen(true)
            }}
          />
          <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
            <Flex align="center">
              {isLive && (
                <>
                  <ColorSwatch color={colors.red[7]} />
                  <Space w="md" />
                </>
              )}
              <Title>Streamaze</Title>
            </Flex>
          </MediaQuery>
        </Flex>
        {showStats && (
          <Flex w="50%" bg={colors.dark[9]} px="lg" py="md">
            <StatPanel />
          </Flex>
        )}
      </Flex>
    </Box>
  )
}

const Layout = ({ children, showStats = false }) => {
  return (
    <AppShell
      padding="16px"
      header={<SplitHeader showStats={showStats} />}
      navbar={<Sidebar />}
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
