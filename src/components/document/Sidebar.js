import styled from '@emotion/styled'
import { Box, CloseButton, Navbar, NavLink } from '@mantine/core'
import { IconHome2, IconSettings } from '@tabler/icons'
import { useContext } from 'react'
import { SidebarContext } from '../Providers/SidebarProvider'

const StyledNavLink = styled(NavLink)`
  border-radius: 8px;
  margin-bottom: 6px;
`

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext)

  return (
    <Navbar
      p="md"
      width={{ sm: 250, md: 275, lg: 350 }}
      display={isSidebarOpen ? 'flex' : 'none'}
    >
      <Box mb="sm">
        <CloseButton onClick={() => setIsSidebarOpen((o) => !o)} size="xl" />
      </Box>
      <StyledNavLink label="Home" href="/" active icon={<IconHome2 />} />
      <StyledNavLink
        label="Settings"
        href="/settings"
        icon={<IconSettings />}
      />
    </Navbar>
  )
}

export default Sidebar
