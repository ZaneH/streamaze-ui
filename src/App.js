import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import LanyardProvider from 'components/Providers/LanyardProvider'
import PhoenixProvider from 'components/Providers/PhoenixProvider'
import PollProvider from 'components/Providers/PollProvider'
import SubathonProvider from 'components/Providers/SubathonProvider'
import Countdown from 'pages/Countdown'
import PollWidget from 'pages/PollWidget'
import SubathonSettings from 'pages/SubathonSettings'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ChatLog } from './components/Chat'
import {
  ConfigProvider,
  DonationProvider,
  HopProvider,
  StatProvider,
  GpsProvider,
} from './components/Providers'
import KeypadProvider from './components/Providers/KeypadProvider'
import SidebarProvider from './components/Providers/SidebarProvider'
import GoLive from './pages/GoLive'
import Home from './pages/Home'
import Keypad from './pages/Keypad'
import RaspberryPi from './pages/RaspberryPi'
import ServerControl from './pages/ServerControl'
import Settings from './pages/Settings'
import TickerWidget from 'pages/TickerWidget'
import SubscriberCountWidget from 'pages/SubscriberCountWidget'

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
                    <GpsProvider>
                      <SubathonProvider>
                        <DonationProvider>
                          <StatProvider>
                            <PhoenixProvider>
                              <SidebarProvider>
                                <PollProvider>
                                  <Routes>
                                    <Route
                                      path="/"
                                      element={<Navigate to="/home" />}
                                    />

                                    <Route
                                      path="/settings"
                                      element={<Settings />}
                                    />

                                    <Route path="/home" element={<Home />} />

                                    <Route
                                      path="/go-live"
                                      element={<GoLive />}
                                    />
                                    <Route
                                      path="/server"
                                      element={<ServerControl />}
                                    />

                                    <Route
                                      path="/chat"
                                      element={
                                        <ChatLog
                                          height="100%"
                                          fluid
                                          showProfilePicture={false}
                                          autorefresh={20 * 60 * 1000}
                                        />
                                      }
                                    />

                                    <Route
                                      path="/keypad"
                                      element={<Keypad />}
                                    />

                                    <Route
                                      path="/raspberrypi"
                                      element={<RaspberryPi />}
                                    />

                                    <Route
                                      path="/subathon/clock"
                                      element={<Countdown />}
                                    />
                                    <Route
                                      path="/subathon"
                                      element={<SubathonSettings />}
                                    />

                                    <Route
                                      path="/poll/:id"
                                      element={<PollWidget />}
                                    />

                                    <Route
                                      path="/widget/ticker/:id"
                                      element={<TickerWidget />}
                                    />

                                    <Route
                                      path="/widget/subs/:platform"
                                      element={<SubscriberCountWidget />}
                                    />

                                    <Route
                                      path="*"
                                      element={<Navigate to="/home" />}
                                    />
                                  </Routes>
                                </PollProvider>
                              </SidebarProvider>
                            </PhoenixProvider>
                          </StatProvider>
                        </DonationProvider>
                      </SubathonProvider>
                    </GpsProvider>
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
