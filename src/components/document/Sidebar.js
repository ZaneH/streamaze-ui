import styled from '@emotion/styled'
import { Box, CloseButton, Navbar, NavLink } from '@mantine/core'
import { IconHome2, IconSettings } from '@tabler/icons'
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
        label="Home"
        href="/"
        active={pathname === '/'}
        icon={<IconHome2 />}
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
    </Navbar>
  )
}

export default Sidebar
