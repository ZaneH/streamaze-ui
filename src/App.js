import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ChatLog from './components/ChatLog'
import SidebarProvider from './components/SidebarProvider'
import Home from './pages/Home'

const App = () => {
  return (
    <MantineProvider withNormalizeCSS withGlobalStyles>
      <NotificationsProvider>
        <BrowserRouter>
          <SidebarProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<ChatLog fullHeight />} />
            </Routes>
          </SidebarProvider>
        </BrowserRouter>
      </NotificationsProvider>
    </MantineProvider>
  )
}

export default App
