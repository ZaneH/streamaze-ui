import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import {
  ConfigProvider,
  DonationProvider,
  HopProvider,
  StatProvider,
} from './components/Providers'
import SidebarProvider from './components/Providers/SidebarProvider'
import Home from './pages/Home'
import Settings from './pages/Settings'

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
                <DonationProvider>
                  <StatProvider>
                    <SidebarProvider>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route
                          path="/sam"
                          element={
                            <Navigate
                              replace
                              to="/?isChat=true&youtubeChat=https://youtube.com/c/sam&tiktokChat=sampepper&isClip=true&clipDiscord=1061689422455767141&clipYT=https://www.youtube.com/c/sam&isObs=true&obsChannel=bondctrl:sam&isStats=true&tiktokStats=sampepper&youtubeStats=https://youtube.com/c/sam"
                            />
                          }
                        />
                        <Route
                          path="/sam/save"
                          element={
                            <Navigate
                              replace
                              to="/settings?isChat=true&youtubeChat=https://youtube.com/c/sam&tiktokChat=sampepper&isClip=true&clipDiscord=1061689422455767141&clipYT=https://www.youtube.com/c/sam&isObs=true&obsChannel=bondctrl:sam&isStats=true&tiktokStats=sampepper&youtubeStats=https://youtube.com/c/sam"
                            />
                          }
                        />
                        <Route
                          path="/lofi"
                          element={
                            <Navigate
                              replace
                              to="/?isChat=true&youtubeChat=https://www.youtube.com/@LofiGirl&isClip=true&clipDiscord=1061689422455767141&clipYT=https://www.youtube.com/@LofiGirl&isStats=true&youtubeStats=https://www.youtube.com/@LofiGirl&isObs=true&obsChannel=bondctrl:sam"
                            />
                          }
                        />
                        <Route
                          path="/lofi/save"
                          element={
                            <Navigate
                              replace
                              to="/settings?isChat=true&youtubeChat=https://www.youtube.com/@LofiGirl&isClip=true&clipDiscord=1061689422455767141&clipYT=https://www.youtube.com/@LofiGirl&isStats=true&youtubeStats=https://www.youtube.com/@LofiGirl&isObs=true&obsChannel=bondctrl:sam"
                            />
                          }
                        />
                      </Routes>
                    </SidebarProvider>
                  </StatProvider>
                </DonationProvider>
              </HopProvider>
            </ConfigProvider>
          </BrowserRouter>
        </NotificationsProvider>
      </HelmetProvider>
    </MantineProvider>
  )
}

export default App
