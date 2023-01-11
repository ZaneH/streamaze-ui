import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ChatLog from './components/ChatLog'
import { ConfigProvider, HopProvider } from './components/Providers'
import Home from './pages/Home'

const App = () => {
  return (
    <MantineProvider
      withNormalizeCSS
      withGlobalStyles
      theme={{ colorScheme: 'dark' }}
    >
      <HelmetProvider>
        <NotificationsProvider>
          <BrowserRouter>
            <ConfigProvider>
              <HopProvider>
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
              </HopProvider>
            </ConfigProvider>
          </BrowserRouter>
        </NotificationsProvider>
      </HelmetProvider>
    </MantineProvider>
  )
}

export default App
