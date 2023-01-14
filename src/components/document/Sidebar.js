import styled from '@emotion/styled'
import { Box, CloseButton, Divider, Navbar, NavLink } from '@mantine/core'
import {
  IconDashboard,
  IconPower,
  IconSettings,
  IconVideo,
} from '@tabler/icons'
import { useContext, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SidebarContext } from '../Providers/SidebarProvider'

const StyledNavLink = styled(NavLink)`
  border-radius: 8px;
  margin-bottom: 6px;
`

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
        label="Dashboard"
        active={pathname === '/'}
        icon={<IconDashboard />}
        onClick={() => {
          navigate('/')
        }}
      />
      <StyledNavLink
        label="Settings"
        active={pathname === '/settings'}
        icon={<IconSettings />}
        onClick={() => {
          navigate('/settings')
        }}
      />
      <Divider my="sm" />
      <StyledNavLink
        label="Go Live"
        active={pathname === '/go-live'}
        icon={<IconVideo />}
        onClick={() => {
          navigate('/go-live')
        }}
      />
      <StyledNavLink
        label="Server Control"
        active={pathname === '/server'}
        icon={<IconPower />}
        onClick={() => {
          navigate('/server')
        }}
      />
    </Navbar>
  )
}

export default Sidebar
