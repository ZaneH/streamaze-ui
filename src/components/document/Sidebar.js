import styled from '@emotion/styled'
import { Box, CloseButton, Divider, Navbar, NavLink, Text } from '@mantine/core'
import {
  IconDashboard,
  IconPower,
  IconSettings,
  IconVideo,
} from '@tabler/icons'
import { useContext, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SidebarContext } from '../Providers/SidebarProvider'
import { ReactComponent as IconRaspberryPi } from 'raspberry-pi.svg'
import { ReactComponent as FlagIcon } from 'flag-icon-nav.svg'

const StyledNavLink = styled(NavLink)`
  border-radius: 8px;
  margin-bottom: 6px;
  padding: 16px 12px;
`

const NavLinkLabel = ({ children }) => <Text size="md">{children}</Text>

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    setIsSidebarOpen(false)
    // eslint-disable-next-line
  }, [pathname])

  return (
    <Navbar
      p="md"
      width={{ sm: 250, md: 275, lg: 350 }}
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
          navigate('/settings')
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
    </Navbar>
  )
}

export default Sidebar
