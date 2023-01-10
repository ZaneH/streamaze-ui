import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import ChatLog from './components/ChatLog'
import SidebarProvider from './components/SidebarProvider'
import Home from './pages/Home'

const App = () => {
  return (
    <MantineProvider withNormalizeCSS withGlobalStyles>
      <HelmetProvider>
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
                <Route
                  path="/testme"
                  element={
                    <Navigate
                      replace
                      to="/?isChatUrl=true&youtubeChannel=https://www.youtube.com/@LofiGirl&isTimestampUrl=true&discordChannelId=1061689422455767141&tsYoutubeChannel=https://www.youtube.com/@LofiGirl"
                    />
                  }
                />
              </Routes>
            </SidebarProvider>
          </BrowserRouter>
        </NotificationsProvider>
      </HelmetProvider>
    </MantineProvider>
  )
}

export default App
