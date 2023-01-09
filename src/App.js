import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
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
              <Route path="/chat" element={<ChatLog height="100vh" />} />
              <Route
                path="/sam"
                element={
                  <Navigate
                    replace
                    to="/?isChatUrl=true&youtubeChannel=https://www.youtube.com/c/sam&tiktokUsername=sampepper&isTimestampUrl=true&discordChannelId=1061689422455767141&tsYoutubeChannel=https://www.youtube.com/c/sam"
                  />
                }
              />
            </Routes>
          </SidebarProvider>
        </BrowserRouter>
      </NotificationsProvider>
    </MantineProvider>
  )
}

export default App
