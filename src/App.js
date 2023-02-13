import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import LanyardProvider from 'components/Providers/LanyardProvider'
import SubathonProvider from 'components/Providers/SubathonProvider'
import SubathonSettings from 'pages/SubathonSettings'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ChatLog } from './components/Chat'
import {
  ConfigProvider,
  DonationProvider,
  HopProvider,
  StatProvider,
} from './components/Providers'
import KeypadProvider from './components/Providers/KeypadProvider'
import SidebarProvider from './components/Providers/SidebarProvider'
import GoLive from './pages/GoLive'
import Home from './pages/Home'
import Keypad from './pages/Keypad'
import RaspberryPi from './pages/RaspberryPi'
import ServerControl from './pages/ServerControl'
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
              <LanyardProvider>
                <KeypadProvider>
                  <HopProvider>
                    <SubathonProvider>
                      <DonationProvider>
                        <StatProvider>
                          <SidebarProvider>
                            <Routes>
                              <Route
                                path="/"
                                element={<Navigate to="/sam" />}
                              />
                              <Route path="/settings" element={<Settings />} />
                              <Route path="/home" element={<Home />} />
                              <Route
                                path="/sam"
                                element={
                                  <Navigate
                                    replace
                                    to={`/home?isChat=true&youtubeChat=@sam&tiktokChat=sampepper&isClip=true&clipDiscord=1061689422455767141&clipYT=https://www.youtube.com/c/sam&isObs=true&obsChannel=bondctrl:sam&isStats=true&tiktokStats=sampepper&youtubeStats=https://youtube.com/c/sam&isSlobs=true&streamToken=${process.env.REACT_APP_SAM_SOCKET_TOKEN_ALIAS}&tiktokDonos=sampepper&isLanyard=true&discordUserId=${process.env.REACT_APP_SAM_DISCORD_ID}&apiKey=${process.env.REACT_APP_SAM_LANYARD_API_KEY}`}
                                  />
                                }
                              />
                              <Route
                                path="/sam/save"
                                element={
                                  <Navigate
                                    replace
                                    to={`/settings?isChat=true&youtubeChat=@sam&tiktokChat=sampepper&isClip=true&clipDiscord=1061689422455767141&clipYT=https://www.youtube.com/c/sam&isObs=true&obsChannel=bondctrl:sam&isStats=true&tiktokStats=sampepper&youtubeStats=https://youtube.com/c/sam&isSlobs=true&streamToken=${process.env.REACT_APP_SAM_SOCKET_TOKEN_ALIAS}&tiktokDonos=sampepper&isLanyard=true&discordUserId=${process.env.REACT_APP_SAM_DISCORD_ID}&apiKey=${process.env.REACT_APP_SAM_LANYARD_API_KEY}`}
                                  />
                                }
                              />
                              <Route
                                path="/lofi"
                                element={
                                  <Navigate
                                    replace
                                    to={`/home?isChat=true&youtubeChat=@LofiGirl&isClip=true&clipDiscord=1061689422455767141&clipYT=https://www.youtube.com/@LofiGirl&isStats=true&youtubeStats=https://www.youtube.com/@LofiGirl&isObs=true&obsChannel=bondctrl:sam&isSlobs=true&streamToken=${process.env.REACT_APP_SAM_SOCKET_TOKEN_ALIAS}&tiktokDonos=sampepper`}
                                  />
                                }
                              />
                              <Route
                                path="/lofi/save"
                                element={
                                  <Navigate
                                    replace
                                    to={`/settings?isChat=true&youtubeChat=@LofiGirl&isClip=true&clipDiscord=1061689422455767141&clipYT=https://www.youtube.com/@LofiGirl&isStats=true&youtubeStats=https://www.youtube.com/@LofiGirl&isObs=true&obsChannel=bondctrl:sam&isSlobs=true&streamToken=${process.env.REACT_APP_SAM_SOCKET_TOKEN_ALIAS}&tiktokDonos=sampepper`}
                                  />
                                }
                              />
                              <Route path="/go-live" element={<GoLive />} />
                              <Route
                                path="/server"
                                element={<ServerControl />}
                              />
                              <Route
                                path="/chat"
                                element={
                                  <ChatLog
                                    height="100vh"
                                    fluid
                                    showProfilePicture={false}
                                  />
                                }
                              />

                              <Route path="/keypad" element={<Keypad />} />
                              <Route
                                path="/raspberrypi"
                                element={<RaspberryPi />}
                              />

                              <Route
                                path="*"
                                element={<Navigate to="/home" />}
                              />

                              <Route
                                path="/subathon"
                                element={<SubathonSettings />}
                              />
                            </Routes>
                          </SidebarProvider>
                        </StatProvider>
                      </DonationProvider>
                    </SubathonProvider>
                  </HopProvider>
                </KeypadProvider>
              </LanyardProvider>
            </ConfigProvider>
          </BrowserRouter>
        </NotificationsProvider>
      </HelmetProvider>
    </MantineProvider>
  )
}

export default App
