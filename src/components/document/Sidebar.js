/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import styled from '@emotion/styled'
import { Box, CloseButton, Divider, Navbar, NavLink, Text } from '@mantine/core'
import {
  IconBulb,
  IconBulbOff,
  IconDashboard,
  IconGift,
  IconPower,
  IconSettings,
  IconVideo,
} from '@tabler/icons'
import { ReactComponent as FlagIcon } from 'assets/flag-icon-nav.svg'
import { ReactComponent as IconRaspberryPi } from 'assets/raspberry-pi.svg'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { useContext, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SidebarContext } from '../Providers/SidebarProvider'

const StyledNavLink = styled(NavLink)`
  border-radius: 8px;
  margin-bottom: 6px;
  padding: 16px 12px;
`

const NavLinkLabel = ({ children }) => <Text size="md">{children}</Text>

const Sidebar = () => {
  const { themeConfig, setThemeConfig } = useContext(ConfigContext)
  const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isOled = themeConfig?.theme === 'oled'

  useEffect(() => {
    setIsSidebarOpen(false)
    // eslint-disable-next-line
  }, [pathname])

  return (
    <Navbar
      p="md"
      width={{ sm: 250, md: 275, lg: 350 }}
      height="100%"
      display={isSidebarOpen ? 'flex' : 'none'}
    >
      <Box mb="sm">
        <CloseButton onClick={() => setIsSidebarOpen((o) => !o)} size="xl" />
      </Box>
      <StyledNavLink
        label={<NavLinkLabel>Dashboard</NavLinkLabel>}
        active={pathname === '/'}
        icon={<IconDashboard size={28} />}
        onClick={() => {
          navigate('/')
        }}
      />
      <StyledNavLink
        label={<NavLinkLabel>Settings</NavLinkLabel>}
        active={pathname === '/settings'}
        icon={<IconSettings size={28} />}
        onClick={() => {
          window.open('/settings')
        }}
      />
      <Divider my="sm" />
      <StyledNavLink
        label={<NavLinkLabel>Raspberry Pi</NavLinkLabel>}
        active={pathname === '/raspberrypi'}
        icon={
          <IconRaspberryPi
            style={{
              width: 28,
              height: 28,
            }}
          />
        }
        onClick={() => {
          navigate('/raspberrypi')
        }}
      />
      <StyledNavLink
        label={<NavLinkLabel>Livebond Controls</NavLinkLabel>}
        active={pathname === '/server'}
        icon={<IconPower size={28} />}
        onClick={() => {
          navigate('/server')
        }}
      />
      <StyledNavLink
        label={<NavLinkLabel>Go Live</NavLinkLabel>}
        active={pathname === '/go-live'}
        icon={<IconVideo size={28} />}
        onClick={() => {
          navigate('/go-live')
        }}
      />
      <StyledNavLink
        label={<NavLinkLabel>Subathon</NavLinkLabel>}
        active={pathname === '/subathon'}
        icon={<FlagIcon style={{ width: 28, height: 28 }} />}
        onClick={() => {
          navigate('/subathon')
        }}
      />

      <Divider my="sm" />

      <StyledNavLink
        label={<NavLinkLabel>Giveaway</NavLinkLabel>}
        active={pathname === '/giveaway/slots'}
        icon={<IconGift style={{ width: 28, height: 28 }} />}
        onClick={() => {
          navigate('/giveaway/slots')
        }}
      />

      <Divider my="sm" />

      <StyledNavLink
        label={<NavLinkLabel>{isOled ? 'OLED On' : 'OLED Off'}</NavLinkLabel>}
        active={isOled}
        icon={
          isOled ? (
            <IconBulbOff style={{ width: 28, height: 28 }} />
          ) : (
            <IconBulb style={{ width: 28, height: 28 }} />
          )
        }
        onClick={() => {
          setThemeConfig({
            ...themeConfig,
            theme: isOled ? 'dark' : 'oled',
          })
        }}
      />
    </Navbar>
  )
}

export default Sidebar
