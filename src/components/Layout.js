import {
  AppShell,
  Aside,
  Burger,
  Header,
  MediaQuery,
  Navbar,
  NavLink,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { IconMessage2 as IconMessage } from '@tabler/icons'
import { Resizable } from 're-resizable'
import { useContext, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ChatLog from './ChatLog'
import { SidebarContext } from './SidebarProvider'

const Layout = ({ children }) => {
  const theme = useMantineTheme()
  const [navOpened, setNavOpened] = useState(true)
  const {
    width,
    setWidth,
    startDraggingWidth,
    setStartDraggingWidth,
    chatSidebarOpened,
    themeConfig,
    chatConfig,
    chatConfigName,
  } = useContext(SidebarContext)

  const selectedChatConfig = chatConfig[chatConfigName]
  const [searchParams] = useSearchParams()
  let tiktokUsername = selectedChatConfig?.tiktok?.enabled
    ? selectedChatConfig?.tiktok?.handle
    : null
  let twitchUsername = selectedChatConfig?.twitch?.enabled
    ? selectedChatConfig?.twitch?.handle
    : null
  let youtubeChannel = selectedChatConfig?.youtube?.enabled
    ? selectedChatConfig?.youtube?.channel
    : null

  if (searchParams.get('isChatUrl') === 'true') {
    tiktokUsername = searchParams.get('tiktokUsername')
    twitchUsername = searchParams.get('twitchUsername')
    youtubeChannel = searchParams.get('youtubeChannel')
  }

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!chatSidebarOpened}
          width={{ sm: 200, lg: 300 }}
        >
          <NavLink
            label="Home"
            href="/"
            active
            icon={<IconMessage />}
            style={{
              borderRadius: '8px',
            }}
          />
        </Navbar>
      }
      aside={
        chatSidebarOpened && (
          <Aside
            width={{ sm: width, lg: width }}
            hiddenBreakpoint="sm"
            hidden={true}
          >
            <Resizable
              enable={{
                left: true,
              }}
              size={{
                width: width,
                height: '100%',
              }}
              defaultSize={{
                width: 300,
                height: '100%',
              }}
              onResizeStart={(_e, _direction, _ref, _d) => {
                setStartDraggingWidth(width)
              }}
              onResize={(_e, _direction, _ref, d) => {
                setWidth(startDraggingWidth + d.width)
              }}
            >
              <ChatLog
                fullHeight
                isDark={themeConfig?.name === 'dark'}
                isBig={themeConfig?.name === 'overlay-impact'}
                twitchUsername={twitchUsername}
                tiktokUsername={tiktokUsername}
                youtubeChannel={youtubeChannel}
              />
            </Resizable>
          </Aside>
        )
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={navOpened}
                onClick={() => setNavOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Title order={2}>Streamaze</Title>
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  )
}

export default Layout
